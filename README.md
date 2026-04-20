# Gideon AI

Canonical home repo for Gideon — Ryan Nichols's cross-product AI operator
companion.

**Source of truth lives in [`Gideon-AI/`](./Gideon-AI/README.md).** Read
[`Gideon-AI/CLAUDE.md`](./Gideon-AI/CLAUDE.md) before making any change
that touches a Gideon feature.

## Layout

```
Gideon-AI/             canonical docs — authoritative
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
  marketing/           gideon.ai sales site
```

## Develop

```bash
pnpm install
pnpm dev:marketing     # http://localhost:3000
pnpm dev:dashboard     # http://localhost:3001
```

See `Gideon-AI/README.md` for the story, `Gideon-AI/CHARTER.md` for the
rules, `Gideon-AI/DESIGN.md` for the palette, and `Gideon-AI/ARCHITECTURE.md`
for the memory layer.

*The sword of the LORD, and of Gideon.*
