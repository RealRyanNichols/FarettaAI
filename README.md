# Faretta AI

Canonical home repo for Faretta — Ryan Nichols's cross-product AI operator
companion.

**Source of truth lives in [`Faretta-AI/`](./Faretta-AI/README.md).** Read
[`Faretta-AI/CLAUDE.md`](./Faretta-AI/CLAUDE.md) before making any change
that touches a Faretta feature.

## Layout

```
Faretta-AI/             canonical docs — authoritative
packages/
  brain-memory/        shared TS package for ingest + query
  design-tokens/       palette + type scale as JSON/CSS vars + Tailwind preset
supabase/
  migrations/          brain_memory schema
  functions/
    brain-ingest/      dedup + upsert Edge Function
    brain-query/       tier-gated retrieval Edge Function
    brain-summarize/   (T-future) summarization cron + on-demand
apps/
  dashboard/           operator dashboard — private, me-only
  marketing/           faretta.ai sales site
```

## Develop

```bash
pnpm install
pnpm dev:marketing     # http://localhost:3000
pnpm dev:dashboard     # http://localhost:3001
```

See `Faretta-AI/README.md` for the story, `Faretta-AI/CHARTER.md` for the
rules, `Faretta-AI/DESIGN.md` for the palette, and `Faretta-AI/ARCHITECTURE.md`
for the memory layer.

*The sword of the LORD, and of Faretta.*
