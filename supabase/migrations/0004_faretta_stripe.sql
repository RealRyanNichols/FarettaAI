-- 0004_faretta_stripe.sql
-- Faretta subscription state — one row per user, mirrored from Stripe
-- via the /api/stripe/webhook handler. RLS on; reads via service-role
-- only (the dashboard page reads through getAdminClient).
--
-- The user's effective tier is computed from `tier` + `status` in the
-- chat route — only `active` and `trialing` grant the paid model.

create table if not exists public.faretta_subscriptions (
  user_id                 uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id      text not null,
  stripe_subscription_id  text,
  stripe_price_id         text,
  tier                    text not null default 'free',          -- free | patriot | liberty
  status                  text not null default 'incomplete',    -- mirrors Stripe Subscription.status
  cancel_at_period_end    boolean not null default false,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create unique index if not exists faretta_subscriptions_customer_idx
  on public.faretta_subscriptions (stripe_customer_id);
create index if not exists faretta_subscriptions_status_idx
  on public.faretta_subscriptions (status);

alter table public.faretta_subscriptions enable row level security;
-- Owners can SELECT their own row (e.g. server components rendering
-- the dashboard with the anon-key client).
create policy faretta_subscriptions_owner_select
  on public.faretta_subscriptions for select
  using (auth.uid() = user_id);
-- No INSERT/UPDATE/DELETE policies: writes go through service-role
-- routes (checkout, webhook, portal) so the Stripe state stays the
-- source of truth.
