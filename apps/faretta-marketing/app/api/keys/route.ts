// POST /api/keys — issue a new API key for the signed-in user.
// GET  /api/keys — list the caller's keys (no plaintext, no hash).

import { NextResponse } from "next/server";
import { getUserClient, getAdminClient } from "@/lib/supabase-server";
import { issueApiKey } from "@/lib/api-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { name?: string };
  try {
    body = (await req.json()) as { name?: string };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (!name || name.length > 80) {
    return NextResponse.json({ error: "name required (max 80)" }, { status: 400 });
  }

  try {
    const issued = await issueApiKey(user.id, name);
    return NextResponse.json(issued);
  } catch (e) {
    console.error("[faretta/keys] issue failed:", e);
    return NextResponse.json({ error: "could not issue key" }, { status: 500 });
  }
}

export async function GET() {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = getAdminClient();
  const { data: rows } = await admin
    .from("faretta_api_keys")
    .select("id, name, prefix, created_at, last_used_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ keys: rows ?? [] });
}
