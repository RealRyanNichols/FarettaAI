# 2026-04-20 — Decision Log (AM session)

Ryan delegated six open questions with "do all of that in the way that
Ryan Nichols…would want. If you have questions, ask, otherwise use
your decisiveness." Decisions taken and written down.

## 1. Voice eval harness

**Decision:** Defer. Not worth the complexity before we have 20+ real
turns of traffic to anchor the goldens. When we do, build a small Deno
script that POSTs a fixed list of `(project, tier, message)` tuples
against gideon-chat and diffs the assistant text against a stored
baseline file — fail the CI job on diff, pass on match.

**Revisit:** After first real-user cohort ships.

## 2. Overlays for lfp / repwatcher / pda / rrn

**Decision:** Draft v0s in-voice, land them, let Ryan redline in
subsequent LEARNED notes.

**Done:** `Gideon-AI/PROMPTS/product-overlays/` gets canonical files;
`supabase/functions/gideon-chat/index.ts` `PRODUCT_OVERLAYS` map
mirrored. `INTEGRATION.md` flags that the two locations must stay in
sync — CI should enforce this eventually.

## 3. Skill invocation wire format

**Decision:** Keep inline `<<skill id="..." args='...'>>` markers.

**Why not native Anthropic tool use:** (a) tool schemas tax every turn
with catalog tokens even when no skill is used, (b) tool-use + SSE
streaming is a more fragile state machine to parse on the client, (c)
markers are a 20-line parser in `@gideon/skills`. When we have a real
need for typed-arg validation (JSON-schema enforcement server-side),
migrate; not before.

## 4. Tier → model routing

**Decision:** Keep the architecture doc's routing —
`free → claude-haiku-4-5`, `core → claude-sonnet-4-6`,
`ultra → claude-opus-4-7`.

**Tension:** Free on Haiku may feel thin. The pricing page's recommended
tier is Core for this reason.

**Revisit:** After we have 30 days of retention data for the free tier.
If free-to-core conversion lags because first-impression quality is too
thin, bump free to Sonnet for the first N turns of a new user's lifetime
(N=5 is my starting guess). Document as a LEARNED when we flip.

## 5. Ingestion mode per product

**Decision:**

| Product | Mode | Why |
|---------|------|-----|
| The Nest | B (explicit tap) | Respect for the mom audience. Nothing contributed without a conscious tap. |
| Lead Flow Pro | A (auto with consent) | Transactional operators. Faster growth serves them. |
| RepWatcher | A (auto with consent) | Business data; reviews are already public. |
| PDA | A (auto with consent) | Clinical professionals; high-value aggregation. |
| realryannichols.com | B (explicit tap) | Ryan's personal site. Visitors are evaluating him, not contributing wisdom. |

Documented in ARCHITECTURE.md section "Ingestion — when does a memory
enter the base?" for Nest/LFP already; extended here.

## 6. Crisis handling

**Decision:** Deterministic pre-filter inside `gideon-chat` runs before
any Claude call. Regex patterns for suicide/self-harm, domestic
violence, and harm-to-others return a canned safety response with
988 / 1-800-799-7233 / Childhelp 1-800-422-4453.

**Why pre-filter instead of trusting the prompt:** a system prompt is a
floor that can be undermined by a sufficiently creative user turn or a
model off-day. The pre-filter is a deterministic second floor below
that. It intentionally over-triggers — false positives are cheap
(a user briefly sees a hotline), false negatives are not.

**Future:** When we have moderation API access, layer Anthropic's
content filter on top. Don't remove the regex — it stays as the
backstop.

## 7. Sales page

**Decision:** Built `/pricing` at
`apps/marketing/app/pricing/page.tsx`. Three-tier grid with Core
recommended. Pricing numbers ($19 core / $79 ultra) are placeholders
pending Ryan's confirmation. FAQ includes an honest "is this just
ChatGPT in a jacket" objection-handler.

**Revisit:** Ryan to confirm or override pricing before public launch.
Contact email hard-coded to `ryan@realryannichols.com` — swap if the
address is different.
