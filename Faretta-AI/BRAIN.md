# Faretta — The Brain Profile

The Brain is not a feature of Faretta. The Brain *is* Faretta. Every
other surface — the chat at faretta.ai, the embed on partner sites,
the API we license to attorneys, the operator dashboard — is a
read/write port into the same Brain.

This document is the canonical statement of what the Brain is, why
it exists, and how it grows into the asset Ryan is building.

## The four-stage cycle

```
   GATHER  →  HOLD  →  GROW  →  MONETIZE
     │         │        │           │
     │         │        │           └─ License aggregate insight to
     │         │        │              partners + serve as the
     │         │        │              acquisition story.
     │         │        │
     │         │        └─ Use the corpus to make every next answer
     │         │           sharper for every next user. The product
     │         │           gets better the more it is used.
     │         │
     │         └─ Persist conversations + contributions + tips +
     │            leads in `brain_memory` and `faretta_chat_messages`.
     │            Dedup. Tag. Tier-gate.
     │
     └─ Every chat turn, every embed conversation, every contact
        form, every witness tip, every attorney lead, every API
        call from a partner site.
```

Each stage is a hard product requirement. A surface that doesn't
feed the Brain doesn't ship.

## 1. GATHER — every surface is an intake

Sources of Brain content, in priority order:

1. **`/api/chat` turns.** The largest input by volume. Every user
   message and every assistant reply is logged to
   `faretta_chat_messages` keyed on `surface` (faretta.ai vs.
   repwatchr.com vs. theleadflowpro.com vs. etc.) and `visitor_id`
   (anon localStorage UUID, upgraded to `user_id` on sign-in).
2. **`/api/v1/chat` turns.** Same wire shape, authenticated by
   `frt_live_*` partner API key. Tagged with `key_id` for partner
   attribution.
3. **`brain_memory` entries.** Member contributions written through
   `brain-ingest`. Deduplicated on `(project, kind, content_hash)`.
   Tagged with tier and source user.
4. **Lead capture.** `faretta_attorney_leads` rows from the
   "connect me with a lawyer" flow. PII separated; the matter
   summary is the substantive payload.
5. **Witness tips.** `faretta_witness_tips`. Anonymous by default.
   Tied to a hashed IP for abuse triage.
6. **Contact form.** `faretta_contact_requests`. Lower-signal but
   useful for triage and cohort tracking.

The directional rule: **default to capture.** It is cheaper to throw
data away later than to fail to capture it now. Storage is not the
constraint. Compute on retrieval is.

## 2. HOLD — Supabase as the substrate

Tables (see `supabase/migrations/`):

| Table                          | Purpose                                                        |
|--------------------------------|----------------------------------------------------------------|
| `brain_memory`                 | Deduplicated, tagged, tier-gated long-term memory corpus       |
| `faretta_chat_messages`        | Raw chat-turn log (every surface)                              |
| `faretta_attorney_leads`       | Hot leads for attorney referral monetization                   |
| `faretta_witness_tips`         | Anonymous tip line                                             |
| `faretta_contact_requests`     | Inbound contact form submissions                               |
| `faretta_api_keys`             | Partner API authentication                                     |
| `faretta_subscriptions`        | Stripe-mirrored subscription state per user                    |

PII separation rule: name, email, phone, exact address are stored on
the table that needs them for routing (leads, contact, subscriptions),
but **not joined into training context** for the LLM. The LLM sees
chat content and Brain memories. It does not see a user's email.

## 3. GROW — every interaction makes the next one sharper

Three feedback loops:

1. **Retrieval improves with corpus size.** Every new memory is
   another candidate row for the BM25/vector pull on the next chat
   turn. The same question asked next month gets a better answer
   because the answer is no longer just the model's prior — it's the
   model's prior plus the network's verified experience.
2. **Summarization compresses repetition.** When a memory hits
   `occurrences >= 3` and `len(content) > 500`, Claude summarizes it.
   Storage cost stays bounded; signal density rises.
3. **Tier gating creates leverage.** Free users see public wisdom
   only. Paid users see deeper layers. The paid users contribute the
   highest-signal memories (they have skin in the game), and they
   also receive the most. The economics align.

The endgame: the Brain is large enough, deep enough, and
domain-specific enough that it cannot be replicated by a competitor
spinning up the same model. The model is commodity. The corpus is
not.

## 4. MONETIZE — three revenue surfaces, one acquisition story

### Direct subscription (Patriot $5/mo, Liberty $20/mo)
The on-ramp. Free tier exists to acquire conversation volume; paid
tiers contribute the highest-signal memories and unlock the better
model. Stripe handles billing.

### Attorney lead routing
When a chat surfaces a real matter ("my landlord locked me out,
what do I do"), Faretta offers an attorney intro. The captured lead
is routed to a vetted attorney in the relevant jurisdiction; the
attorney pays for the intro. Lead quality rises with Brain quality
because Faretta gets sharper at recognizing real matters vs. casual
questions.

### Aggregate insight licensing
The Brain corpus, anonymized and aggregated, has commercial value
in three buyer categories:

1. **Legal-tech and big-law buyers** want pattern-of-question data
   for product roadmap and intake automation.
2. **Civic / political buyers** (PACs, campaigns, advocacy orgs)
   want regional pattern-of-grievance data for issue identification
   and message testing.
3. **Acquirer buyers** want all of the above as a defensible asset
   the acquired company brings into the deal.

Aggregate licensing follows hard rules:

- **Aggregation, not individual records.** Buyers receive cohort
  statistics ("X% of pro se rights-violation questions in Y region
  reference Z statute"), never individual conversations.
- **De-identified, k-anonymous.** Cohorts below a minimum threshold
  are dropped or coarsened.
- **Consented.** The user-facing privacy policy describes aggregate
  licensing in plain terms. Users can opt out from Settings.
- **Audited.** Every aggregate export is logged.

### Acquisition pathway
The strategic endgame Ryan named explicitly: build the Brain into a
corpus that a big-tech or big-law acquirer wants more than they want
to build it themselves, and sell the company. The product, the team,
the brand, the user base — all of those matter in an acquisition.
But the corpus is what is irreplaceable.

The Brain is the floor under the valuation.

## What changes if Faretta is acquired

The acquirer inherits:
- The corpus (subject to user opt-outs honored on the asset transfer)
- The tier-gated retrieval architecture
- The partner-embed footprint (RepWatchr.com, TheLeadFlowPro.com,
  Faretta.Legal, others)
- The brand
- The team

User commitments that survive any transfer:
- Right to delete all data
- Right to export
- Aggregate-only licensing rules above
- The stated privacy posture at faretta.ai/privacy

These are the floor. They are not negotiable in a sale.

## What this document is not

This is the **strategy** document. It does not replace:

- `ARCHITECTURE.md` — the technical schema and retrieval mechanics
- `CHARTER.md` — the brand and voice rules
- `IDENTITY.md` — Faretta's voice
- `apps/faretta-marketing/app/privacy/page.tsx` — the user-facing
  privacy policy

If those drift from this, this is the source of intent. The others
are downstream.
