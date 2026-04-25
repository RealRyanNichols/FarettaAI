// POST /api/witness — anonymous tip line. A visitor who saw something
// relevant to a public case can submit details without leaving an
// identity. Persists to faretta_witness_tips for moderation.
//
// We store hashed IP + user-agent for abuse triage; we do not store
// the raw IP. No email is required. If they leave one, it's stored
// alongside the tip.

import { getAdminClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const story = String(body.story ?? "").trim();
  const matter = String(body.matter ?? "").trim();
  const contact = String(body.contact ?? "").trim();

  if (!story || story.length < 30 || story.length > 8000) {
    return NextResponse.json({ error: "story must be 30-8000 chars" }, { status: 400 });
  }
  if (matter.length > 200) {
    return NextResponse.json({ error: "matter too long" }, { status: 400 });
  }
  if (contact.length > 200) {
    return NextResponse.json({ error: "contact too long" }, { status: 400 });
  }

  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const rawIp = fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const ipHash = rawIp ? await sha256(rawIp) : null;

  const sb = getAdminClient();
  const { error } = await sb.from("faretta_witness_tips").insert({
    matter: matter || null,
    story,
    contact: contact || null,
    user_agent: req.headers.get("user-agent") || null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[faretta/witness] insert failed:", error);
    return NextResponse.json({ error: "could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
