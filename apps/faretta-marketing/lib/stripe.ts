// Faretta — Stripe server-side helpers.
//
// Tier mapping is driven by env vars holding the four Price IDs:
//   STRIPE_PRICE_PATRIOT_MONTHLY
//   STRIPE_PRICE_PATRIOT_YEARLY
//   STRIPE_PRICE_LIBERTY_MONTHLY
//   STRIPE_PRICE_LIBERTY_YEARLY
//
// We never hard-code price IDs in source — that way the same code runs
// against test mode and live mode just by swapping env values.
//
// The publishable key is exposed to the browser via NEXT_PUBLIC_…;
// the secret key is server-only.

import Stripe from "stripe";

export type Tier = "free" | "patriot" | "liberty";
export type Cadence = "monthly" | "yearly";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("[faretta/stripe] STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });
  return _stripe;
}

export function priceFor(tier: Exclude<Tier, "free">, cadence: Cadence): string | null {
  const key =
    tier === "patriot"
      ? cadence === "monthly"
        ? "STRIPE_PRICE_PATRIOT_MONTHLY"
        : "STRIPE_PRICE_PATRIOT_YEARLY"
      : cadence === "monthly"
        ? "STRIPE_PRICE_LIBERTY_MONTHLY"
        : "STRIPE_PRICE_LIBERTY_YEARLY";
  return process.env[key] ?? null;
}

// Reverse-map a Stripe Price ID to the tier it belongs to. Returns null
// if the price isn't one of ours (e.g. an old price, a one-off invoice).
export function tierForPrice(priceId: string | null | undefined): Tier {
  if (!priceId) return "free";
  if (
    priceId === process.env.STRIPE_PRICE_PATRIOT_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_PATRIOT_YEARLY
  ) {
    return "patriot";
  }
  if (
    priceId === process.env.STRIPE_PRICE_LIBERTY_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_LIBERTY_YEARLY
  ) {
    return "liberty";
  }
  return "free";
}

// Whether a Stripe subscription status grants paid access. trialing +
// active count; everything else (canceled, past_due, unpaid) drops to free
// once the period ends.
export function statusGrantsAccess(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

// Map an internal tier name to the Anthropic model used by /api/chat.
// Patriot bumps to Sonnet; Liberty bumps to Opus.
export function modelForTier(tier: Tier): string {
  switch (tier) {
    case "liberty":
      return "claude-opus-4-7";
    case "patriot":
      return "claude-sonnet-4-6";
    default:
      return "claude-haiku-4-5";
  }
}
