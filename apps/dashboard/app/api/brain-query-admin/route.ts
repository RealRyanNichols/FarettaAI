import { NextResponse } from "next/server";
import { getAdminClient, requireOperator } from "@/lib/supabase-server";

// Operator-only admin query — full-access read over brain_memory.
// The public `brain-query` Edge Function stays tier-gated; this route
// exists so I (Ryan) can inspect everything without tier filtering.
export async function GET(req: Request) {
  try {
    await requireOperator();
  } catch (err) {
    if (err instanceof Response) return err;
    throw err;
  }

  const url = new URL(req.url);
  const project = url.searchParams.get("project");
  const kind = url.searchParams.get("kind");
  const tag = url.searchParams.get("tag");
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500);
  const orderBy = url.searchParams.get("order") || "occurrences";

  const sb = getAdminClient();
  let q = sb.from("brain_memory").select("*");
  if (project) q = q.eq("project", project);
  if (kind) q = q.eq("kind", kind);
  if (tag) q = q.contains("tags", [tag]);

  q = q.order(orderBy === "last_seen_at" ? "last_seen_at" : "occurrences", {
    ascending: false,
  });
  q = q.limit(limit);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ memories: data ?? [] });
}

export async function POST(req: Request) {
  try {
    await requireOperator();
  } catch (err) {
    if (err instanceof Response) return err;
    throw err;
  }

  const body = await req.json();
  const { action, id, patch, insert } = body as {
    action: "update" | "insert" | "soft-delete";
    id?: string;
    patch?: Record<string, unknown>;
    insert?: Record<string, unknown>;
  };

  const sb = getAdminClient();

  if (action === "insert" && insert) {
    const { data, error } = await sb.from("brain_memory").insert(insert).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, memory: data });
  }

  if (action === "update" && id && patch) {
    const { data, error } = await sb
      .from("brain_memory")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, memory: data });
  }

  return NextResponse.json({ error: "unsupported action" }, { status: 400 });
}
