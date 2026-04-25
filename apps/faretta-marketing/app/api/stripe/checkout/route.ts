// POST /api/stripe/checkout
//
// Creates a Stripe Checkout Session for the picked tier+cadence and
// returns a JSON body { url }. Client redirects window.location to it.
//
// Body: { tier: "patriot" | "liberty", cadence: "monthly" | "yearly" }
//
// Auth: requires a Supabase session — Stripe customers are linked to
// the Supabase user_id via metadata + customer_email so the webhook
// can write back to faretta_subscriptions.

import { NextResponse } from "next/server";
import { getStripe, priceFor, type Cadence, type Tier } from "@/lib/stripe";
import { getUserClient, getAdminClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { tier?: string; cadence?: string };

function isPaidTier(t: string): t is Exclude<Tier, "free"> {
  return t === "patriot" || t === "liberty";
}
function isCadence(c: string): c is Cadence {
  return c === "monthly" || c === "yearly";
}

async function findOrCreateCustomerId(userId: string, email: string): Promise<string> {
  const admin = getAdminClient();
  const { data: existing } = await admin
    .from("faretta_subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing?.stripe_customer_id) return existing.stripe_customer_id as string;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { faretta_user_id: userId },
  });
  // Insert a stub row so subsequent calls reuse the customer_id.
  await admin.from("faretta_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customer.id,
      tier: "free",
      status: "incomplete",
    },
    { onConflict: "user_id" },
  );
  return customer.id;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const tier = String(body.tier ?? "");
  const cadence = String(body.cadence ?? "monthly");
  if (!isPaidTier(tier) || !isCadence(cadence)) {
    return NextResponse.json({ error: "invalid tier or cadence" }, { status: 400 });
  }

  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user || !user.email) {
    // Send the visitor to /login first; preserve intent in the query string.
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("intent", "checkout");
    loginUrl.searchParams.set("tier", tier);
    loginUrl.searchParams.set("cadence", cadence);
    return NextResponse.json({ redirect: loginUrl.toString() }, { status: 401 });
  }

  const priceId = priceFor(tier, cadence);
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price not configured for ${tier}/${cadence}. Set STRIPE_PRICE_${tier.toUpperCase()}_${cadence.toUpperCase()} in env.` },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  const customerId = await findOrCreateCustomerId(user.id, user.email);

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    client_reference_id: user.id,
    subscription_data: {
      metadata: { faretta_user_id: user.id, tier, cadence },
    },
    metadata: { faretta_user_id: user.id, tier, cadence },
    success_url: `${origin}/dashboard?upgraded=${tier}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?cancelled=1`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "stripe did not return a url" }, { status: 500 });
  }
  return NextResponse.json({ url: session.url });
}
