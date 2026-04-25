import { redirect } from "next/navigation";
import { getUserClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const sb = await getUserClient();
  await sb.auth.signOut();
  redirect("/");
}
