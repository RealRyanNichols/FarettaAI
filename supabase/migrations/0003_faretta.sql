-- 0003_faretta.sql
-- Faretta AI: contact requests, attorney leads, witness tips, API keys,
-- and the chat-message log that feeds Faretta's brain.
--
-- Same Supabase project as Gideon. All tables prefixed `faretta_*` so
-- they cannot collide with Gideon's `brain_memory` (0001) or
-- `contact_requests` (0002). RLS is on for everything; writes for
-- public surfaces happen via service-role from Next.js routes.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Contact form submissions
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.faretta_contact_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  jurisdiction    text,
  topic           text,                     -- pro-se | family | attorney | embed | press | witness | other
  tier_of_interest text,                    -- free | pro | liberty
  message         text not null,
  source_page     text,
  user_agent      text,
  ip_hash         text,                     -- sha-256 hex of client IP (privacy)
  status          text not null default 'new',   -- new | triaged | replied | closed
  handled_at      timestamptz,
  handled_by      text
);
create index if not exists faretta_contact_requests_created_idx
  on public.faretta_contact_requests (created_at desc);
create index if not exists faretta_contact_requests_status_idx
  on public.faretta_contact_requests (status, created_at desc);
alter table public.faretta_contact_requests enable row level security;
-- No policies: only service-role inserts/reads.


-- ─────────────────────────────────────────────────────────────────────
-- 2. Attorney leads — hot leads the chat surfaced for referral.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.faretta_attorney_leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  jurisdiction    text not null,            -- e.g. "Texas", "9th Circuit"
  practice_area   text,                     -- civil rights, family, criminal, etc.
  situation       text not null,            -- summary of the matter
  source          text not null default 'faretta.ai', -- which surface routed it
  user_agent      text,
  status          text not null default 'new', -- new | matched | introduced | closed
  matched_attorney_id uuid,                  -- nullable; set when we route
  introduced_at   timestamptz,
  notes           text
);
create index if not exists faretta_attorney_leads_created_idx
  on public.faretta_attorney_leads (created_at desc);
create index if not exists faretta_attorney_leads_status_idx
  on public.faretta_attorney_leads (status, created_at desc);
create index if not exists faretta_attorney_leads_jurisdiction_idx
  on public.faretta_attorney_leads (jurisdiction);
alter table public.faretta_attorney_leads enable row level security;


-- ─────────────────────────────────────────────────────────────────────
-- 3. Witness tips — anonymous evidence-line submissions.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.faretta_witness_tips (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  matter          text,                     -- the case / topic the tip relates to
  story           text not null,            -- the tip itself
  contact         text,                     -- optional — if they want a callback
  user_agent      text,
  ip_hash         text,                     -- abuse triage only; never displayed
  status          text not null default 'new', -- new | reviewing | actioned | discarded
  reviewed_at     timestamptz,
  reviewer_notes  text
);
create index if not exists faretta_witness_tips_created_idx
  on public.faretta_witness_tips (created_at desc);
alter table public.faretta_witness_tips enable row level security;


-- ─────────────────────────────────────────────────────────────────────
-- 4. API keys — partner sites embedding the Faretta chat widget.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.faretta_api_keys (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  prefix        text not null,              -- 'frt_live_<8 chars>' (cleartext, displayed)
  hashed_key    text not null unique,       -- sha256 hex of full plaintext key
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz
);
create index if not exists faretta_api_keys_user_idx
  on public.faretta_api_keys (user_id, created_at desc);
create index if not exists faretta_api_keys_hash_idx
  on public.faretta_api_keys (hashed_key) where revoked_at is null;
alter table public.faretta_api_keys enable row level security;
-- Owners can SELECT their own rows. INSERT/UPDATE happens via the
-- service-role API routes (so we can hash and audit before storing).
create policy faretta_api_keys_owner_select
  on public.faretta_api_keys for select
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────
-- 5. Chat messages — every turn that flows through /api/chat. This is
--    the substrate Faretta's brain learns from over time. PII is not
--    extracted; we deliberately store raw text so we can iterate on
--    summarization and embedding strategies later.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.faretta_chat_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  surface       text not null default 'faretta.ai', -- which host site
  visitor_id    text,                         -- anon localStorage id; null when not provided
  user_id       uuid references auth.users(id) on delete set null, -- when signed in
  role          text not null check (role in ('user','assistant')),
  content       text not null,
  tier          text not null default 'free'
);
create index if not exists faretta_chat_messages_created_idx
  on public.faretta_chat_messages (created_at desc);
create index if not exists faretta_chat_messages_visitor_idx
  on public.faretta_chat_messages (visitor_id, created_at desc)
  where visitor_id is not null;
create index if not exists faretta_chat_messages_user_idx
  on public.faretta_chat_messages (user_id, created_at desc)
  where user_id is not null;
alter table public.faretta_chat_messages enable row level security;
-- No public policies. Reads happen via service-role from the operator
-- dashboard; the host /api/chat handler writes via service-role.
