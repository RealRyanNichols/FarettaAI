-- contact_requests: inbound leads from /contact on the marketing site.
-- Never surface Ryan's email on any public page. This is the table
-- the form writes to; the operator dashboard reads from it.
--
-- All writes happen via the /api/contact route (service-role client
-- under the marketing app). RLS is on with no user policies — only
-- the service role can touch it.

create table if not exists contact_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  -- What the visitor gave us.
  name            text not null,
  email           text not null,
  company         text,
  -- Product they are interested in or came from. Optional — use
  -- "nest" | "lfp" | "repwatcher" | "pda" | "rrn" | "faretta".
  product         text,
  -- Tier they want, if they picked one. "free" | "core" | "ultra" | "team".
  tier_of_interest text,
  -- Freeform message / what they want to build.
  message         text not null,
  -- Captured for triage, not displayed.
  source_page     text,                       -- e.g. '/pricing' or '/'
  referrer        text,
  user_agent      text,
  ip_hash         text,                       -- sha-256 hex of client IP (privacy)
  -- Status Ryan's team sets from the dashboard.
  status          text not null default 'new',   -- new | triaged | replied | closed
  handled_at      timestamptz,
  handled_by      text
);

create index if not exists contact_requests_created_idx
  on contact_requests (created_at desc);
create index if not exists contact_requests_status_idx
  on contact_requests (status, created_at desc);
create index if not exists contact_requests_product_idx
  on contact_requests (product);

alter table contact_requests enable row level security;
-- Intentionally no policies: only service-role callers (the
-- marketing /api/contact route and the dashboard) can read/write.
