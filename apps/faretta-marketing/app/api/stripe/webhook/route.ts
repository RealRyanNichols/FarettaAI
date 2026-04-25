// POST /api/stripe/webhook
//
// Stripe → Faretta. Verifies the signature with STRIPE_WEBHOOK_SECRET,
// then updates faretta_subscriptions on subscription lifecycle events.
//
// Subscribed events:
//   checkout.session.completed
//   customer.subscription.created
//   customer.subscription.updated
//   customer.subscription.deleted
//   invoice.paid              — refresh status after a renewal
//   invoice.payment_failed    — flip to past_due
//
// Tier is computed from the active subscription's first item price ID,
// not from the metadata, so a subscription that gets swapped to a
// different price (upgrade/downgrade) is reflected immediately.

import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe, statusGrantsAccess, tierForPrice, type Tier } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function upsertSubscription(sub: Stripe.Subscription): Promise<void> {
  const admin = getAdminClient();
  const userId =
    (sub.metadata && sub.metadata.faretta_user_id) ||
    null;

  // If we don't have a user id on the subscription, try the customer record.
  let resolvedUserId = userId;
  if (!resolvedUserId && typeof sub.customer === "string") {
    const stripe = getStripe();
    const cust = await stripe.customers.retrieve(sub.customer);
    if (cust && !cust.deleted) {
      resolvedUserId = cust.metadata?.faretta_user_id ?? null;
    }
  }

  if (!resolvedUserId) {
    console.warn("[faretta/stripe-webhook] subscription has no faretta_user_id", sub.id);
    return;
  }

  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? null;
  const grant = statusGrantsAccess(sub.status);
  const tier: Tier = grant ? tierForPrice(priceId) : "free";

  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const periodEnd =
    typeof (sub as unknown as { current_period_end?: number }).current_period_end === "number"
      ? new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
      : null;

  await admin.from("faretta_subscriptions").upsert(
    {
      user_id: resolvedUserId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      tier,
      status: sub.status,
      cancel_at_period_end: sub.cancel_at_period_end,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }

  const raw = await req.text();
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "bad signature";
    console.error("[faretta/stripe-webhook] verify failed:", msg);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await upsertSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const subRef = (inv as unknown as { subscription?: string | { id: string } }).subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sub);
        }
        break;
      }
      default:
        // ignore everything else for v1
        break;
    }
  } catch (e) {
    console.error("[faretta/stripe-webhook] handler failed:", e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
