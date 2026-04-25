// POST /api/keys/[id]/revoke — revoke an API key the user owns.
// Form-style POST so a plain <form> in the keys table can submit
// without JS. Redirects back to /api-keys on success.

import { NextResponse } from "next/server";
import { getUserClient } from "@/lib/supabase-server";
import { revokeApiKey } from "@/lib/api-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const ok = await revokeApiKey(user.id, id);
  if (!ok) return NextResponse.json({ error: "not found or already revoked" }, { status: 404 });

  return NextResponse.redirect(new URL("/api-keys", _req.url), { status: 303 });
}
