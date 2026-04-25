// API-key issuance + verification for Faretta partners (sites embedding
// the chat widget; tools that hit /api/v1/*). Keys are stored hashed —
// the plaintext is shown to the user once, at creation time, and never
// again.
//
// Format: `frt_live_<8-char-prefix>_<32-char-secret>`. The prefix is
// stored in cleartext for display; the full string is stored hashed.

import { getAdminClient } from "./supabase-server";

const PREFIX_LEN = 8;
const SECRET_LEN = 32;
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function rand(n: number): string {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < n; i++) out += ALPHA[buf[i]! % ALPHA.length];
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type IssuedKey = {
  id: string;
  name: string;
  prefix: string;
  /** Plaintext key. Shown ONCE at creation. Never persisted in plaintext. */
  key: string;
};

export async function issueApiKey(userId: string, name: string): Promise<IssuedKey> {
  const prefix = rand(PREFIX_LEN);
  const secret = rand(SECRET_LEN);
  const plaintext = `frt_live_${prefix}_${secret}`;
  const hashed = await sha256Hex(plaintext);

  const sb = getAdminClient();
  const { data, error } = await sb
    .from("faretta_api_keys")
    .insert({
      user_id: userId,
      name,
      prefix,
      hashed_key: hashed,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "could not issue key");
  }

  return { id: data.id as string, name, prefix, key: plaintext };
}

export type VerifyOk = { ok: true; userId: string; keyId: string };
export type VerifyFail = { ok: false; status: number; reason: string };

export async function verifyApiKey(authHeader: string | null): Promise<VerifyOk | VerifyFail> {
  if (!authHeader) return { ok: false, status: 401, reason: "missing Authorization header" };
  const m = authHeader.match(/^Bearer\s+(frt_live_[A-Za-z0-9]{8}_[A-Za-z0-9]{32})$/);
  if (!m) return { ok: false, status: 401, reason: "malformed key" };
  const plaintext = m[1]!;
  const hashed = await sha256Hex(plaintext);

  const sb = getAdminClient();
  const { data } = await sb
    .from("faretta_api_keys")
    .select("id, user_id, revoked_at")
    .eq("hashed_key", hashed)
    .maybeSingle();

  if (!data) return { ok: false, status: 401, reason: "unknown key" };
  if (data.revoked_at) return { ok: false, status: 401, reason: "key revoked" };

  // Best-effort, non-blocking. Fire and forget.
  void sb.from("faretta_api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);

  return { ok: true, userId: data.user_id as string, keyId: data.id as string };
}

export async function revokeApiKey(userId: string, keyId: string): Promise<boolean> {
  const sb = getAdminClient();
  const { error, count } = await sb
    .from("faretta_api_keys")
    .update({ revoked_at: new Date().toISOString() }, { count: "exact" })
    .eq("id", keyId)
    .eq("user_id", userId)
    .is("revoked_at", null);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
