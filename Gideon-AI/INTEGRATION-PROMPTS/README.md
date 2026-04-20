# Gideon — Integration Prompts

One copy-paste prompt per product. Each prompt is a self-contained
Claude Code instruction you drop into a session rooted in the target
repo. Claude reads it and walks the integration end to end, asking
Ryan when it hits anything ambiguous.

## Current prompts

| Product | Slug | Target repo | Prompt |
|---------|------|-------------|--------|
| realryannichols.com | `rrn` | `RealRyanNicholsLLC` | [`rrn.md`](./rrn.md) |
| The Nest | `nest` | TBD | (coming) |
| Lead Flow Pro | `lfp` | TBD | (coming) |
| RepWatcher | `repwatcher` | TBD | (coming) |
| Premier Dental Academy | `pda` | TBD | (coming) |

## How to use

1. Open Claude Code in the target product's repo.
2. Open the matching prompt in this directory.
3. Fill in the three placeholders at the top:
   - Supabase project-ref
   - Deployed `gideon-chat` URL
   - Package consumption path (workspace / submodule / registry)
4. Paste the fenced code block (not the framing notes) into the
   session and hit enter.
5. Let Claude Code run Phase 1 first. If anything in the repo
   violates its assumptions, it will stop and ask.

## Writing a new prompt

Copy `rrn.md` and adjust:

- The product slug — every `setProject()`, every `<GideonChat project="...">`,
  every request uses this exact string.
- The overlay reference — `PROMPTS/product-overlays/<slug>.md` is the
  canonical voice for this product.
- The default tier — rrn is `free`; logged-in products like Nest and
  Lead Flow Pro should compute tier from the user's subscription.
- Skills — each product has its own set. List them in Phase 6.
- Contact surface — whether the product already has auth + profile
  changes how the contact flow is wired.

Commit the prompt with the rest of that product's canonical docs in
the `Gideon-AI/` tree. Any prompt edit is a LEARNED-worthy change:
mirror the reason in `LEARNED/YYYY-MM-DD-<topic>.md`.
