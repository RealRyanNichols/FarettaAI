# 2026-05-06 — Faretta legal overlay + cal.com canonical URL

Two things landed today.

## 1. Faretta is now a Gideon product

Ryan asked for a full overhaul of the Faretta Legal page on the
marketing site. We took it as an instruction to formalize Faretta as
the **legal/pro-se overlay** of Gideon, not just a microsite.

**Brand spine.** The umbrella product is named for *Gideon v.
Wainwright*, 372 U.S. 335 (1963) — the right to counsel. The legal
product is named for *Faretta v. California*, 422 U.S. 806 (1975) —
the right to self-representation. The two cases are the doctrinal
opposites of the Sixth Amendment counsel clause, which is why they
pair. Use that framing in copy: "Gideon stood for the right to
counsel. Faretta gave you the right to do it yourself."

**Who Faretta is for.** Pro se civil litigants, small business owners
reading contracts, tenants/landlords on local rent statutes, founders
on term sheets, workers filing agency claims, anyone with a court
date and no attorney. Not criminal defendants — Faretta routes those
to the public defender, citing Gideon v. Wainwright.

**Non-negotiables that landed in the overlay** (`Gideon-AI/PROMPTS/product-overlays/faretta.md`):

- Cite real authority only. Never invent caselaw, statutes, rules,
  or holdings. If the network does not have it, say so.
- Always name the jurisdiction before drafting.
- Never claim attorney-client privilege over Faretta output. State
  that plainly.
- Never predict outcomes. Describe strength on the merits; refuse
  to project a win.
- Refuse criminal defense past triage. Refuse deportability-affecting
  immigration advice past triage.
- Compute deadlines from named events. If ≤72h, deadline beats
  analysis in the response.

**What shipped on the marketing site** (`apps/marketing/app/faretta-legal/page.tsx`):

- Hero with the Faretta v. California citation and the spine line.
- Three pillars: cited authority, jurisdiction-aware drafting,
  deadline tracking.
- Sample-memo block illustrating a CA unlawful-detainer answer with
  pin-cited authorities and the deadline chips. Marked clearly as
  illustrative.
- Six-segment use-case grid (pro se litigant, small business, tenant,
  founder, worker, anyone with a court date).
- "What Faretta refuses" panel listing the four firm lines.
- Two-cases-two-halves panel pairing Gideon v. Wainwright with
  Faretta v. California.
- Pricing deltas keyed to the existing tiers (no separate billing).
- Disclaimer wall above the footer — Faretta is not a law firm,
  no attorney-client relationship, no privilege, hire counsel for
  matters with serious consequences.

**Wiring updates:**

- Top nav of `/` and `/pricing` now links to `/faretta-legal`.
- Pricing page lists Faretta as the sixth product; copy updated from
  "five products" to "six products".
- Contact form adds Faretta as a product option.
- Home footer mentions Faretta Legal.

**Cross-product neutrality check:** Faretta only runs when the user
chooses legal mode. The same Gideon voice rules apply. Memory model
is unchanged — Faretta memories ride the same `brain_memory` table
with `access_tier` enforcement.

## 2. cal.com/realryannichols is the canonical scheduling URL

Ryan changed his calendar username. From now on:

**Canonical:** `https://cal.com/realryannichols`

Use this anywhere a "book a call" or scheduling link is appropriate.
Do not fall back to email-only, do not invent a Calendly link, do not
use a personal calendar URL. If a future product needs scheduling,
this is the URL.

**Where it landed today:**

- Faretta Legal access section — "Book a call on cal.com" CTA next
  to "Request access".
- Home access section — "Book a call" CTA next to "Request an
  invitation".
- Contact page — "Prefer to talk? Book a call on cal.com" link
  above the form.

**Revisit triggers:**

- If Ryan moves off cal.com, update the LEARNED note (do not delete
  this one) and grep the marketing app for `cal.com/realryannichols`.
- If we add a team scheduling tool, this stays the founder/intro URL
  unless explicitly replaced.

## 3. vercel.json: scope the deploy to the marketing app

The Vercel project `faretta-ai` was failing builds with
`Module not found: Can't resolve '@gideon/brain-memory'` while building
the dashboard. Two compounding issues:

- The Vercel project root is the repo root, and the root `build`
  script is `pnpm -r build` — which builds **everything**, including
  the dashboard. The dashboard imports `@gideon/brain-memory`.
- pnpm's default workspace concurrency fired the dashboard's
  `next build` in parallel with — or before — `brain-memory`'s
  `tsc`, so the dashboard webpack pass couldn't resolve the
  unbuilt package.

**Fix:** added `vercel.json` at the repo root. It scopes the build to
the marketing app and its workspace dependency graph, with serial
ordering to defeat the concurrency race:

```json
{
  "buildCommand": "pnpm -r --workspace-concurrency=1 --filter @gideon/marketing... run build",
  "outputDirectory": "apps/marketing/.next"
}
```

Why this is correct, not just expedient:

- The `faretta-ai` Vercel project is for the public marketing site.
  The dashboard is private and described as "me-only" — it should
  not deploy to this Vercel project at all.
- The marketing app does not depend on `@gideon/brain-memory`, only
  on `@gideon/design-tokens`. Filtering to `@gideon/marketing...`
  builds exactly what is needed and skips the dashboard entirely.
- `--workspace-concurrency=1` enforces topological order. Without it,
  pnpm 9.12.3 in CI environments has been observed firing app builds
  before package builds finish.

**Revisit if** the dashboard ever needs to deploy on Vercel — at that
point spin up a separate Vercel project for it with its own root
directory and build command, do not merge them into this one.
