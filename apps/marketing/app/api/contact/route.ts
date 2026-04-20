import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// POST /api/contact — the one place the public form can reach Ryan.
// Writes to contact_requests via service-role. Ryan's email is never
// surfaced to the browser and never set as a redirect target.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  company?: string;
  product?: string;
  tier?: string;
  message?: string;
  hp?: string; // honeypot — real humans leave it empty
};

// Minimal email shape check. We don't try to be clever — the dashboard
// operator sees every submission and can triage junk by hand. This just
// stops the most obvious garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Honeypot — if filled, silently 200 so bots don't tune their attack.
  if (body.hp && body.hp.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }
  if (!message || message.length < 10 || message.length > 4000) {
    return NextResponse.json({ error: "message must be 10-4000 chars" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[contact] supabase env missing; submission dropped");
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  const sb = createClient(url, key, { auth: { persistSession: false } });

  // Privacy-preserving visitor capture. We hash the IP instead of
  // storing it raw so abuse patterns can still be detected across
  // submissions without holding PII we don't need.
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const rawIp = fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const ipHash = rawIp ? await hashIp(rawIp) : null;

  const { error } = await sb.from("contact_requests").insert({
    name,
    email,
    company: body.company?.trim() || null,
    product: body.product?.trim() || null,
    tier_of_interest: body.tier?.trim() || null,
    message,
    source_page: req.headers.get("referer") || null,
    referrer: req.headers.get("x-vercel-referer") || null,
    user_agent: req.headers.get("user-agent") || null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[contact] insert failed:", error);
    return NextResponse.json({ error: "could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
