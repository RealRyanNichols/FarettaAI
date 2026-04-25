// POST /api/lead — capture a hot lead the chat surfaced for an attorney
// referral. Persists to faretta_attorney_leads. Ryan's team triages and
// routes from the operator dashboard.
//
// Body: { name, email, jurisdiction, area, situation, source? }

import { getAdminClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const jurisdiction = String(body.jurisdiction ?? "").trim();
  const area = String(body.area ?? "").trim();
  const situation = String(body.situation ?? "").trim();

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }
  if (!jurisdiction || jurisdiction.length > 80) {
    return NextResponse.json({ error: "jurisdiction required" }, { status: 400 });
  }
  if (!situation || situation.length < 20 || situation.length > 4000) {
    return NextResponse.json({ error: "situation must be 20-4000 chars" }, { status: 400 });
  }

  const sb = getAdminClient();
  const { error } = await sb.from("faretta_attorney_leads").insert({
    name,
    email,
    jurisdiction,
    practice_area: area || null,
    situation,
    source: String(body.source ?? "faretta.ai") || "faretta.ai",
    user_agent: req.headers.get("user-agent") || null,
  });

  if (error) {
    console.error("[faretta/lead] insert failed:", error);
    return NextResponse.json({ error: "could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
