// Supabase Edge Function: brain-summarize
//
// Background pass (run nightly via pg_cron or a scheduled webhook)
// that condenses frequent long memories into a summary the retrieval
// layer can serve instead of the raw content.
//
// Trigger rule (from ARCHITECTURE.md):
//   occurrences >= 3 AND length(content) > 500 AND summary IS NULL
//
// Deploy:
//   supabase functions deploy brain-summarize --project-ref <ref>
//
// Invoke:
//   curl -X POST https://<ref>.functions.supabase.co/brain-summarize \
//        -H "Authorization: Bearer <service-role-key>" \
//        -H "content-type: application/json" \
//        -d '{"limit": 25}'
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

// Haiku is the right tool — cheap, fast, 100-char output. We don't
// need Opus reasoning to shorten a paragraph.
const SUMMARY_MODEL = "claude-haiku-4-5";
const MAX_CHARS = 100;

const SYSTEM_PROMPT =
  `You shorten operator wisdom into a single line of at most ${MAX_CHARS} characters. ` +
  `Keep the core claim or tactic. No preamble, no quotes, no trailing period if it pushes over the cap. ` +
  `Output only the one line — no commentary, no markdown.`;

async function summarize(client: Anthropic, content: string): Promise<string> {
  const res = await client.messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 80,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });
  const first = res.content[0];
  if (!first || first.type !== "text") {
    throw new Error("no text block in summary response");
  }
  const line = first.text.split("\n")[0]?.trim() ?? "";
  if (!line) throw new Error("empty summary");
  return line.length > MAX_CHARS ? line.slice(0, MAX_CHARS).trimEnd() : line;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST")    return new Response("POST only", { status: 405, headers: cors });

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...cors, "content-type": "application/json" } });
    }

    const { limit = 25 } = (await req.json().catch(() => ({}))) as { limit?: number };
    const cap = Math.min(Math.max(Number(limit) || 25, 1), 200);

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Pull rows that qualify. Order by occurrences desc so we condense
    // the most-repeated wisdom first — if we hit the cap, those are
    // the ones the retrieval layer will serve most often.
    const { data, error } = await sb
      .from("brain_memory")
      .select("id, content, occurrences")
      .is("summary", null)
      .gte("occurrences", 3)
      .order("occurrences", { ascending: false })
      .limit(cap);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...cors, "content-type": "application/json" } });
    }

    const candidates = (data ?? []).filter((r: any) =>
      typeof r.content === "string" && r.content.length > 500,
    );

    const client = new Anthropic({ apiKey });
    const results: Array<{ id: string; ok: boolean; summary?: string; error?: string }> = [];

    // Serial for now. Rate limits + cost predictability beat the
    // speedup of concurrent calls at this batch size.
    for (const row of candidates) {
      try {
        const summary = await summarize(client, row.content);
        const { error: upErr } = await sb
          .from("brain_memory")
          .update({ summary, updated_at: new Date().toISOString() })
          .eq("id", row.id);
        if (upErr) throw upErr;
        results.push({ id: row.id, ok: true, summary });
      } catch (e: any) {
        results.push({ id: row.id, ok: false, error: e?.message ?? String(e) });
      }
    }

    return new Response(
      JSON.stringify({
        scanned: data?.length ?? 0,
        eligible: candidates.length,
        summarized: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
        results,
      }),
      { headers: { ...cors, "content-type": "application/json" } },
    );
  } catch (err: any) {
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
