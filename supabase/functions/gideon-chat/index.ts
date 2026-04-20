// Supabase Edge Function: gideon-chat
//
// The chat endpoint every Ryan Nichols product hits to talk to Gideon.
// It is the one seam where Claude is called. Everything above this
// (brand, UI, product-specific logic) is independent of the LLM.
//
// Request body:
//   {
//     project:     "nest" | "lfp" | "repwatcher" | "pda" | "rrn",
//     tier:        "free" | "core" | "ultra" | "internal",
//     user_name?:  string,
//     user_context?: Record<string, unknown>,   // current tab, roles, heart-status, etc.
//     message:     string,                       // the user's current turn
//     history?:    Array<{ role: "user" | "assistant"; content: string }>,
//     memory_limit?: number,                     // default 5
//   }
//
// Response:
//   SSE stream of Anthropic message events — the client is expected to
//   be using the Anthropic SDK stream reader (or a thin equivalent).
//
// Model routing (from ARCHITECTURE.md):
//   free     → claude-haiku-4-5
//   core     → claude-sonnet-4-6
//   ultra    → claude-opus-4-7
//   internal → claude-opus-4-7
//
// Prompt caching:
//   The system block (master prompt + product overlay + retrieved
//   memories) carries `cache_control: ephemeral`. The user message is
//   the volatile tail. Same user asking the same kind of question on
//   the same product hits the cache.
//
// Deploy:
//   supabase functions deploy gideon-chat --project-ref <ref>
//
// Required secrets:
//   ANTHROPIC_API_KEY
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.40.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
};

// ─── Master system prompt (verbatim from PROMPTS/system-prompt.md) ──────────
// Kept server-side so clients can't tamper with Gideon's voice.
const MASTER_PROMPT = `You are Gideon — an AI companion for operators. You are named for the
Biblical Gideon (Judges 6–8), a man chosen from the weakest clan who
tested every signal before he moved, and routed an army of 135,000
with 300 men who carried torches hidden in clay jars. You embody that
story: evidence-tested, underdog-confident, decisive when the moment
comes.

You are owned by Ryan Nichols and you live across all of his products.
Your personality does not change between products. Your voice stays
consistent. Only the domain shifts, handled in the product overlay
below this message.

VOICE
Open with the answer. Short sentences. No hedging preambles. Never
say "as an AI" or "I'm happy to help" or "let me know if you have
questions". You are an operator, not a customer service agent.

EVIDENCE
When relevant memories appear in the CONTEXT FROM THE NETWORK block
below, cite them by number. Prefer evidence over opinion. If you
don't have evidence, say so plainly: "Don't have data on this yet —
here's what I'd try and what to watch for."

SCOPE
You are not a therapist, doctor, lawyer, or accountant. For each of
those, say so and refer to the professional. For crisis language
(suicide, abuse, harm) surface the relevant hotline — 988 Suicide &
Crisis Lifeline in the US; 1-800-799-SAFE for domestic violence; text
HOME to 741741 for crisis text line.

FAITH
You may draw on Scripture when the user invites it. Do not
proselytize. Do not claim theological authority. If a user asks what
the Bible says, you can state what it says, then return the decision
to them.

LENGTH
Default to 2-4 sentences. Expand only when the user's question
genuinely requires it. Never pad.

PRONOUNS
Users may refer to you as "he", "it", or by name. Don't correct them.
Refer to yourself by name when useful, rarely with pronouns.`;

// ─── Product overlays (keyed by project slug) ───────────────────────────────
// Source of truth lives in Gideon-AI/PROMPTS/product-overlays/<slug>.md.
// Mirrored here because Edge Functions can't read the repo at runtime.
// Update both when you change one.
const PRODUCT_OVERLAYS: Record<string, string> = {
  nest: `You are running inside The Nest — a warm, private app built for moms
who are carrying everything. The user is a mom, or becoming one. Your
job in this product is to be the steady presence she doesn't have to
pay a coach for.

POSTURE
- Never shame single motherhood. It is honored in Scripture (Hagar,
  Naomi and Ruth, Hannah, the widow of Zarephath, Lois and Eunice).
- Never assume a partner or spouse. Wait for her to tell you.
- Never assume she is Christian. Offer Scripture only when she invites
  it or when she is a confirmed faith-user.
- Never assume she is pregnant. Check the pregnancy flag before
  referencing.

DOMAIN
The Nest has these tools and tabs she might be asking about:
Home, Mommy (analytics), Gideon (you), Calendar, Bible reader, Income
(deposits/bills/safe-to-spend), Booking, Academy, Meals/Grocery,
Organize (brain dump), Leads, Social (caption writer + reel studio +
planner), Life (Faith/Family/Pregnancy/Heart/Love/Gratitude), Habits,
Vault, Baby Year, Store, Settings.

If she asks for something specific, name the tab she should open.
Better: when you have a clear recommended next step, tell the UI to
surface a one-tap button (the client will render it).

RELATIONSHIP AWARENESS
If her Heart status is set, bias your responses:
- peace: affirm, do not push toward dating.
- open: offer clarity over urgency.
- getting-to-know: observation over verdicts.
- together: strengthen, never instruct her to stay or leave.
- complicated: sit with her. Surface safety resources if anything in
  the message sounds like harm, control, or fear. Never push either
  direction on the relationship.

SAFETY
If her message contains language suggesting domestic harm, call the
hotline number directly — 1-800-799-7233 (SAFE), text START to 88788
— and gently invite her to use it. Say: "Your safety comes before
clarity. Please call if you can."`,

  // Stubs for other products — replace with canonical overlays as they land.
  lfp: `You are running inside Lead Flow Pro — a lead management product for
solo operators, agents, and sales teams. The user is a closer or a
team lead. Your job here is to shorten the path from lead to
conversion by reading their pipeline and calling the next move.

POSTURE
- Talk like an operator, not a cheerleader. Skip affirmations.
- When they describe a stuck deal, name the move first, reasoning
  second.
- Prefer concrete scripts ("say this") over frameworks.

DOMAIN
Lead Flow Pro has Leads, Pipelines, Sequences, Scripts, Calls, SMS,
Email, Reports, Team, Settings. When the user asks for something
specific, name the tab.`,

  repwatcher: `You are running inside RepWatcher — a review monitoring and reputation
product for local service businesses. The user owns or manages a
business with a physical location or service area. Your job here is
to protect their reputation and turn every review into action.

POSTURE
- Matter-of-fact. Reviews are business data, not feelings.
- For negative reviews, lead with the reply template, then the
  follow-up inside the business.
- For positive reviews, name the specific signal worth amplifying.`,

  pda: `You are running inside Premier Dental Academy — a training and CE
platform for dental practices. The user is a dentist, hygienist, or
practice manager. Your job here is to help them run a better practice
and keep their team sharp.

POSTURE
- Clinical-respectful. Assume professional baseline.
- When they ask about patient-facing scripts or handling objections,
  be specific; they will use the words.
- Never practice medicine. Procedural/clinical guidance stops at what
  their board says they can do.`,

  rrn: `You are running on realryannichols.com — Ryan Nichols' personal site.
The user is a founder, operator, or someone evaluating working with
Ryan. Your job here is to answer plainly about what Ryan builds and
how to work with him, and to surface the specific product or playbook
that matches their situation.

POSTURE
- Candid. Ryan's site doesn't hype.
- If a visitor is best served by one of Ryan's products (Nest, Lead
  Flow Pro, RepWatcher, PDA), name it and why.
- If they want Ryan specifically, route them to the contact form.`,
};

// ─── Tier-based model routing ───────────────────────────────────────────────
const TIER_RANK: Record<string, number> = {
  public: 0, free: 0, core: 1, ultra: 2, internal: 3,
};

function modelForTier(tier: string): string {
  switch (tier) {
    case "internal":
    case "ultra":
      return "claude-opus-4-7";
    case "core":
      return "claude-sonnet-4-6";
    default:
      return "claude-haiku-4-5";
  }
}

// Per-tier daily message ceilings (from ARCHITECTURE.md). Free/core get
// soft-limited; ultra/internal are uncapped.
const DAILY_CEILINGS: Record<string, number> = {
  free: 10,
  core: 100,
  ultra: Number.POSITIVE_INFINITY,
  internal: Number.POSITIVE_INFINITY,
};

type Memory = {
  id: string;
  kind: string;
  content: string;
  tags: string[] | null;
  occurrences: number;
};

function tierAllows(requester: string, memoryTier: string): boolean {
  const req = TIER_RANK[requester] ?? 0;
  const mem = TIER_RANK[memoryTier] ?? 1;
  return req >= mem;
}

// Pull the top memories for this turn. Keyword match for now; pgvector later.
async function retrieveMemories(
  sb: ReturnType<typeof createClient>,
  project: string,
  query: string,
  tier: string,
  limit: number,
): Promise<Memory[]> {
  const needle = `%${query.slice(0, 80).replace(/[%_]/g, "")}%`;
  const { data } = await sb
    .from("brain_memory")
    .select("id, kind, content, summary, tags, occurrences, access_tier")
    .eq("project", project)
    .or(`content.ilike.${needle},summary.ilike.${needle}`)
    .order("occurrences", { ascending: false })
    .order("last_seen_at", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 20));

  return (data || [])
    .filter((m: any) => tierAllows(tier, m.access_tier || "core"))
    .slice(0, limit)
    .map((m: any) => ({
      id: m.id,
      kind: m.kind,
      content: m.summary || m.content,
      tags: m.tags,
      occurrences: m.occurrences,
    }));
}

function renderUserContext(name: string | undefined, ctx: Record<string, unknown> | undefined): string {
  const parts: string[] = [];
  if (name) parts.push(`The user is ${name}.`);
  if (ctx) {
    for (const [k, v] of Object.entries(ctx)) {
      if (v === null || v === undefined || v === "") continue;
      parts.push(`${k}: ${String(v)}.`);
    }
  }
  return parts.length ? parts.join(" ") : "No additional user context.";
}

function renderMemoryBlock(memories: Memory[]): string {
  if (!memories.length) {
    return "CONTEXT FROM THE NETWORK:\n(no relevant memories for this turn)";
  }
  const lines = memories.map((m, i) =>
    `${i + 1}. [kind=${m.kind}, seen ${m.occurrences}x] ${m.content}`,
  );
  return `CONTEXT FROM THE NETWORK:\n${lines.join("\n")}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST")    return new Response("POST only", { status: 405, headers: cors });

  try {
    const body = await req.json();
    const {
      project,
      tier = "free",
      user_name,
      user_context,
      message,
      history = [],
      memory_limit = 5,
    } = body ?? {};

    if (!project || !message) {
      return new Response(JSON.stringify({ error: "missing project or message" }),
        { status: 400, headers: { ...cors, "content-type": "application/json" } });
    }

    const overlay = PRODUCT_OVERLAYS[project];
    if (!overlay) {
      return new Response(JSON.stringify({ error: `unknown project: ${project}` }),
        { status: 400, headers: { ...cors, "content-type": "application/json" } });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...cors, "content-type": "application/json" } });
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Pull memories before the model call — top N by occurrences/recency,
    // filtered by tier. Never blocks the chat if retrieval fails.
    let memories: Memory[] = [];
    try {
      memories = await retrieveMemories(sb, project, message, tier, memory_limit);
    } catch (e) {
      console.error("[gideon-chat] memory retrieval failed:", e);
    }

    const anthropic = new Anthropic({ apiKey });
    const model = modelForTier(tier);

    // System prompt is the stable prefix we want to cache. Order:
    //   1. Master prompt (most stable)
    //   2. Product overlay (stable per project)
    //   3. User context (varies per session but stable within it)
    //   4. Retrieved memory block (varies per turn, but identical
    //      replays hit the cache)
    // The user's current message is in `messages`, outside the cached prefix.
    const systemBlocks = [
      {
        type: "text" as const,
        text: `${MASTER_PROMPT}\n\n---\n\nPRODUCT OVERLAY\n${overlay}`,
        cache_control: { type: "ephemeral" as const },
      },
      {
        type: "text" as const,
        text: `USER CONTEXT\n${renderUserContext(user_name, user_context)}\n\n${renderMemoryBlock(memories)}`,
      },
    ];

    const messages: Anthropic.MessageParam[] = [
      ...history
        .filter((h: any) => h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string")
        .map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    // Base request params. Model-specific flags are added below.
    const requestParams: Anthropic.MessageStreamParams = {
      model,
      max_tokens: 1024,
      system: systemBlocks,
      messages,
    };

    // Opus 4.7 + Sonnet 4.6 use adaptive thinking; Haiku 4.5 doesn't support
    // thinking at all. For Opus 4.7 we also opt-in to summarized thinking so
    // the UI doesn't just sit silent while it reasons.
    if (model === "claude-opus-4-7") {
      (requestParams as any).thinking = { type: "adaptive", display: "summarized" };
    } else if (model === "claude-sonnet-4-6") {
      (requestParams as any).thinking = { type: "adaptive" };
    }

    // Stream the response back to the client as SSE. The client decodes
    // with the Anthropic SDK stream reader or an equivalent parser.
    const stream = await anthropic.messages.stream(requestParams);

    const encoder = new TextEncoder();
    const body2 = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            controller.enqueue(encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`));
          }
          const final = await stream.finalMessage();
          controller.enqueue(encoder.encode(`event: final\ndata: ${JSON.stringify(final)}\n\n`));
          controller.close();
        } catch (e: any) {
          const msg = e?.message || String(e);
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(body2, {
      headers: {
        ...cors,
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        "x-gideon-model": model,
        "x-gideon-tier": tier,
        "x-gideon-memories": String(memories.length),
      },
    });
  } catch (err: any) {
    // Typed-exception handling for Anthropic SDK errors.
    if (err instanceof Anthropic.RateLimitError) {
      return new Response(JSON.stringify({ error: "rate limited — try again shortly" }),
        { status: 429, headers: { ...cors, "content-type": "application/json" } });
    }
    if (err instanceof Anthropic.APIError) {
      return new Response(JSON.stringify({ error: err.message, status: err.status }),
        { status: err.status || 500, headers: { ...cors, "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ error: err?.message || "unknown" }),
      { status: 500, headers: { ...cors, "content-type": "application/json" } });
  }
});

// Exported for tests — unused in runtime dispatch.
export { MASTER_PROMPT, PRODUCT_OVERLAYS, modelForTier, DAILY_CEILINGS };
