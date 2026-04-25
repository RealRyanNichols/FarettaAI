// POST /api/v1/chat — public Faretta chat API for partners.
// Authenticates with the API key in `Authorization: Bearer frt_live_…`
// then proxies to the same internal pipeline as /api/chat. Tier is
// inferred from the partner's account in the future; v1 forces
// "pro" tier for paying partners.

import Anthropic from "@anthropic-ai/sdk";
import { FARETTA_MASTER_PROMPT } from "@/lib/system-prompt";
import { verifyApiKey } from "@/lib/api-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  message?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  surface?: string;
  visitor_id?: string;
};

function sseLine(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const v = await verifyApiKey(auth);
  if (!v.ok) {
    return new Response(JSON.stringify({ error: v.reason }), {
      status: v.status,
      headers: { "content-type": "application/json", "www-authenticate": "Bearer" },
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const anthropic = new Anthropic({ apiKey });
  const history = (body.history ?? [])
    .filter((h) => h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string")
    .slice(-12);

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const llm = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: [
            { type: "text", text: FARETTA_MASTER_PROMPT, cache_control: { type: "ephemeral" } },
          ],
          messages: [
            ...history.map((h) => ({ role: h.role, content: h.content })),
            { role: "user" as const, content: message },
          ],
        });
        for await (const event of llm) {
          controller.enqueue(enc.encode(sseLine(event.type, event)));
        }
        const final = await llm.finalMessage();
        controller.enqueue(enc.encode(sseLine("final", final)));
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "unknown error";
        controller.enqueue(enc.encode(sseLine("error", { error: msg })));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      "x-faretta-key-id": v.keyId,
      "x-faretta-user-id": v.userId,
    },
  });
}
