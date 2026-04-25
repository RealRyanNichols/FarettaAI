// POST /api/chat — Faretta's conversation endpoint.
//
// Streams Claude back to the browser as Server-Sent Events. The page-
// embedded <FarettaChat /> component reads the stream and renders text
// as it arrives. Same wire format the gideon-chat Edge Function uses,
// so the embed widget can target either endpoint.
//
// Request body:
//   {
//     message:   string,        // the user's current turn
//     history?:  Array<{ role: "user" | "assistant"; content: string }>,
//     tier?:     "free" | "pro" | "liberty",
//     surface?:  string,        // e.g. "faretta.ai" | "repwatchr.com" — for the brain
//     visitor_id?: string,      // anonymous cookie ID
//   }
//
// Response:
//   text/event-stream of Anthropic message events. Each line is:
//     event: <type>
//     data: <json>
//
// Persistence: every turn (user + assistant) is logged to
// faretta_chat_messages so the brain can learn over time. PII is not
// extracted; the raw text goes in. Lead capture is a separate route.

import Anthropic from "@anthropic-ai/sdk";
import { FARETTA_MASTER_PROMPT } from "@/lib/system-prompt";
import { getAdminClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatBody = {
  message?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  tier?: "free" | "pro" | "liberty";
  surface?: string;
  visitor_id?: string;
};

// ─── Crisis pre-filter ──────────────────────────────────────────────────────
// Keyword check that runs BEFORE Claude sees the message. Flagged turns
// get the canned safety reply with hotline numbers and skip the LLM.
const CRISIS_PATTERNS: Array<{ pattern: RegExp; cat: "suicide" | "dv" | "harm" }> = [
  { pattern: /\b(kill\s+my\s*self|suicid|end\s+my\s+life|want\s+to\s+die|better\s+off\s+dead|take\s+my\s+own\s+life)\b/i, cat: "suicide" },
  { pattern: /\b(self[-\s]?harm|cutting\s+my\s*self|hurt\s+my\s*self)\b/i, cat: "suicide" },
  { pattern: /\b(he\s+hits\s+me|she\s+hits\s+me|(?:being|getting)\s+(?:hit|beat(?:en)?|abused)|he\s+beat|she\s+beat|i\s+am\s+scared\s+of\s+(?:him|her)|domestic\s+(?:violence|abuse))\b/i, cat: "dv" },
  { pattern: /\b(kill\s+(?:him|her|them|someone)|hurt\s+(?:my\s+kid|the\s+baby|my\s+child))\b/i, cat: "harm" },
];

function detectCrisis(s: string): "suicide" | "dv" | "harm" | null {
  for (const { pattern, cat } of CRISIS_PATTERNS) if (pattern.test(s)) return cat;
  return null;
}

function crisisReply(c: "suicide" | "dv" | "harm"): string {
  switch (c) {
    case "suicide":
      return "What you're carrying is heavier than I can hold. Please call or text 988 — the Suicide & Crisis Lifeline. It's free, 24/7. They will stay with you. If you're outside the US, dial your local emergency number. Your case can wait. You matter.";
    case "dv":
      return "Your safety comes before any case, any filing, anything we could talk about here. Please call the National Domestic Violence Hotline: 1-800-799-7233. Text START to 88788 if you can't speak. They'll help you plan. You don't have to decide anything to call.";
    case "harm":
      return "Before we go any further, please reach someone who can help keep everyone safe. Call 988 (US crisis line) or 911 if there's immediate danger. For children at risk: Childhelp National Child Abuse Hotline, 1-800-422-4453. I'll still be here after you've made that call.";
  }
}

function modelForTier(tier?: string): string {
  switch (tier) {
    case "liberty":
      return "claude-opus-4-7";
    case "pro":
      return "claude-sonnet-4-6";
    default:
      return "claude-haiku-4-5";
  }
}

function sseLine(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function logTurn(
  surface: string | undefined,
  visitorId: string | undefined,
  role: "user" | "assistant",
  content: string,
  tier: string,
) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return;
    const sb = getAdminClient();
    await sb.from("faretta_chat_messages").insert({
      surface: surface || "faretta.ai",
      visitor_id: visitorId || null,
      role,
      content,
      tier,
    });
  } catch (e) {
    console.error("[faretta/chat] log turn failed:", e);
  }
}

export async function POST(req: Request) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const message = body.message?.trim();
  if (!message) {
    return new Response(JSON.stringify({ error: "missing message" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const tier = body.tier ?? "free";
  const history = (body.history ?? [])
    .filter((h) => h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string")
    .slice(-12); // cap history to keep token budget sane

  // Log the user turn fire-and-forget. Don't block the stream on it.
  void logTurn(body.surface, body.visitor_id, "user", message, tier);

  // Crisis filter — short-circuit the model entirely.
  const crisis = detectCrisis(message);
  if (crisis) {
    const text = crisisReply(crisis);
    void logTurn(body.surface, body.visitor_id, "assistant", text, "crisis-filter");
    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        controller.enqueue(enc.encode(sseLine("content_block_delta", {
          type: "content_block_delta",
          delta: { type: "text_delta", text },
        })));
        controller.enqueue(enc.encode(sseLine("message_stop", { type: "message_stop" })));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "x-faretta-crisis": crisis,
        "x-faretta-model": "crisis-filter",
      },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const anthropic = new Anthropic({ apiKey });
  const model = modelForTier(tier);

  const system = [
    {
      type: "text" as const,
      text: FARETTA_MASTER_PROMPT,
      cache_control: { type: "ephemeral" as const },
    },
  ];

  const messages: Anthropic.MessageParam[] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user" as const, content: message },
  ];

  // Buffer the assistant text so we can log it after the stream closes.
  let assistantText = "";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const llm = await anthropic.messages.stream({
          model,
          max_tokens: 1024,
          system,
          messages,
        });
        for await (const event of llm) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            assistantText += event.delta.text;
          }
          controller.enqueue(enc.encode(sseLine(event.type, event)));
        }
        const final = await llm.finalMessage();
        controller.enqueue(enc.encode(sseLine("final", final)));
        controller.close();
        void logTurn(body.surface, body.visitor_id, "assistant", assistantText, tier);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "unknown error";
        console.error("[faretta/chat] stream error:", msg);
        controller.enqueue(enc.encode(sseLine("error", { error: msg })));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      "x-faretta-model": model,
      "x-faretta-tier": tier,
    },
  });
}
