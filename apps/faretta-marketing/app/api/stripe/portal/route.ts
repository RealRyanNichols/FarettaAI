// POST /api/stripe/portal
//
// Creates a Stripe Billing Portal session for the signed-in user. The
// portal lets them update card, switch plans, cancel, and download
// invoices — all hosted by Stripe, no UI on our side.

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getUserClient, getAdminClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = getAdminClient();
  const { data: row } = await admin
    .from("faretta_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row?.stripe_customer_id) {
    return NextResponse.json({ error: "no Stripe customer for this user yet" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = new URL(req.url).origin;
  const session = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer_id as string,
    return_url: `${origin}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
