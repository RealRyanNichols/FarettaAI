// One-shot seed script. Run with your secret key — never commit it,
// never paste it into chat.
//
//   STRIPE_SECRET_KEY=sk_live_... pnpm -F @faretta/marketing stripe:seed
//   # or test mode:
//   STRIPE_SECRET_KEY=sk_test_... pnpm -F @faretta/marketing stripe:seed
//
// Output is the four env-var lines you should paste into Vercel:
//   STRIPE_PRICE_PATRIOT_MONTHLY=price_xxx
//   STRIPE_PRICE_PATRIOT_YEARLY=price_xxx
//   STRIPE_PRICE_LIBERTY_MONTHLY=price_xxx
//   STRIPE_PRICE_LIBERTY_YEARLY=price_xxx
//
// Idempotent: if a Faretta product already exists (lookup_key match),
// we re-use it. Same for prices — we look up by lookup_key first.

import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("STRIPE_SECRET_KEY is required. Run with:");
  console.error("  STRIPE_SECRET_KEY=sk_live_... pnpm -F @faretta/marketing stripe:seed");
  process.exit(1);
}

const stripe = new Stripe(secret, { apiVersion: "2025-02-24.acacia" });

type PriceSpec = {
  envVar: string;
  productLookup: string;
  productName: string;
  productDescription: string;
  lookupKey: string;
  unitAmount: number; // in cents
  interval: "month" | "year";
};

const SPECS: PriceSpec[] = [
  {
    envVar: "STRIPE_PRICE_PATRIOT_MONTHLY",
    productLookup: "faretta-patriot",
    productName: "Faretta — Patriot",
    productDescription: "Saved chat history, Sonnet model, attorney intros, document timeline.",
    lookupKey: "faretta-patriot-monthly",
    unitAmount: 500,
    interval: "month",
  },
  {
    envVar: "STRIPE_PRICE_PATRIOT_YEARLY",
    productLookup: "faretta-patriot",
    productName: "Faretta — Patriot",
    productDescription: "Saved chat history, Sonnet model, attorney intros, document timeline.",
    lookupKey: "faretta-patriot-yearly",
    unitAmount: 5000,
    interval: "year",
  },
  {
    envVar: "STRIPE_PRICE_LIBERTY_MONTHLY",
    productLookup: "faretta-liberty",
    productName: "Faretta — Liberty",
    productDescription: "Opus model, API access for embedding Faretta on partner sites, forensics preview.",
    lookupKey: "faretta-liberty-monthly",
    unitAmount: 2000,
    interval: "month",
  },
  {
    envVar: "STRIPE_PRICE_LIBERTY_YEARLY",
    productLookup: "faretta-liberty",
    productName: "Faretta — Liberty",
    productDescription: "Opus model, API access for embedding Faretta on partner sites, forensics preview.",
    lookupKey: "faretta-liberty-yearly",
    unitAmount: 20000,
    interval: "year",
  },
];

async function ensureProduct(lookup: string, name: string, description: string): Promise<string> {
  const existing = await stripe.products.search({
    query: `metadata['lookup']:'${lookup}'`,
    limit: 1,
  });
  if (existing.data.length > 0 && existing.data[0]) {
    return existing.data[0].id;
  }
  const created = await stripe.products.create({
    name,
    description,
    metadata: { lookup },
  });
  return created.id;
}

async function ensurePrice(
  productId: string,
  lookupKey: string,
  unitAmount: number,
  interval: "month" | "year",
): Promise<string> {
  const existing = await stripe.prices.search({
    query: `lookup_key:'${lookupKey}' AND active:'true'`,
    limit: 1,
  });
  if (existing.data.length > 0 && existing.data[0]) {
    return existing.data[0].id;
  }
  const created = await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency: "usd",
    recurring: { interval },
    lookup_key: lookupKey,
    nickname: lookupKey,
  });
  return created.id;
}

async function main() {
  console.log("Faretta Stripe seed — mode:", secret!.startsWith("sk_live_") ? "LIVE" : "test");
  console.log("");

  const env: Record<string, string> = {};
  for (const spec of SPECS) {
    process.stdout.write(`• ${spec.lookupKey}… `);
    const productId = await ensureProduct(spec.productLookup, spec.productName, spec.productDescription);
    const priceId = await ensurePrice(productId, spec.lookupKey, spec.unitAmount, spec.interval);
    env[spec.envVar] = priceId;
    console.log("ok");
  }

  console.log("");
  console.log("Paste these into Vercel (Project → Settings → Environment Variables):");
  console.log("");
  for (const [k, v] of Object.entries(env)) {
    console.log(`${k}=${v}`);
  }
  console.log("");
  console.log("Also paste these (one-time):");
  console.log("STRIPE_SECRET_KEY=<your sk_live_…>");
  console.log("STRIPE_WEBHOOK_SECRET=<whsec_… from dashboard.stripe.com/webhooks>");
  console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your pk_live_…>");
}

main().catch((e: unknown) => {
  console.error("seed failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
