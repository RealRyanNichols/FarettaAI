# Gideon — Integration Runbook

How to light up Gideon inside a Ryan Nichols product (The Nest, Lead
Flow Pro, RepWatcher, Premier Dental Academy, realryannichols.com).

This is the copy-paste playbook. Every product follows the same
shape; only the product slug, overlay, and registered skills differ.

---

## 0. What the product needs

| Dependency | Where |
|------------|-------|
| Supabase project | Shared — the GideonAI Supabase project (or a product-local one pointing at the same `brain_memory`). |
| `brain_memory` table | Created by `supabase/migrations/0001_brain_memory.sql` in this repo. |
| Edge Functions | `brain-ingest`, `brain-query`, `gideon-chat`, `brain-summarize` — deployed once, called by every product. |
| Anthropic API key | Stored as Supabase function secret `ANTHROPIC_API_KEY`. Never ships to the client. |
| Service role key | Stored as Supabase function secret `SUPABASE_SERVICE_ROLE_KEY`. Never ships to the client. |

---

## 1. Install the shared packages

If the product is a sibling of this repo under a pnpm workspace, add
them as workspace deps:

```json
// product-app/package.json
{
  "dependencies": {
    "@gideon/brain-memory": "workspace:*",
    "@gideon/skills": "workspace:*",
    "@gideon/ui": "workspace:*",
    "@gideon/design-tokens": "workspace:*"
  }
}
```

If the product is a separate repo (the common case today), vendor them
by adding `gideonai` as a git submodule under `vendor/gideon/` and
pointing the tsconfig `paths` at `vendor/gideon/packages/*/src`. See
the Nest's current wiring for the reference setup.

Either way, build the packages once before the host typechecks:

```bash
pnpm -F @gideon/brain-memory build
pnpm -F @gideon/skills build
pnpm -F @gideon/ui build
```

---

## 2. Wire the memory client

Every product initializes `@gideon/brain-memory` exactly once at
startup, on the server side (API route, edge handler, or service
worker — **never** in a client component that ships the host URL to
the browser):

```ts
// product-app/lib/gideon-memory.ts
import { createClient } from "@supabase/supabase-js";
import {
  setHost,
  setProject,
  setContributeToBrain,
} from "@gideon/brain-memory";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

setProject("nest");              // "nest" | "lfp" | "repwatcher" | "pda" | "rrn"
setHost(supabase);
setContributeToBrain(true);      // Mode A products; Mode B leaves this false
                                 // and gates contribution behind the UI skill.
```

Products that want cross-repo deployment without sharing a
service-role key should proxy the ingest + query calls through their
own Edge Function rather than giving the host server the key
directly.

---

## 3. Embed the chat widget

`@gideon/ui` exports `<GideonChat />`. Mount it once in the app
shell. For Next.js App Router, client component:

```tsx
// product-app/app/_components/GideonMount.tsx
"use client";
import { GideonChat } from "@gideon/ui";

export function GideonMount({ user }: { user: { id: string; name: string; tier: "free" | "core" | "ultra" } }) {
  return (
    <GideonChat
      endpoint={process.env.NEXT_PUBLIC_GIDEON_CHAT_URL!}
      project="nest"
      tier={user.tier}
      userName={user.name}
      userContext={{ userId: user.id, tab: "Home" }}
      onTurnComplete={(history) => {
        // Persist per-user history to Supabase / localStorage here.
      }}
    />
  );
}
```

`NEXT_PUBLIC_GIDEON_CHAT_URL` points at the deployed
`gideon-chat` Edge Function — e.g.
`https://<ref>.functions.supabase.co/gideon-chat`.

The palette auto-themes if the host has loaded
`@gideon/design-tokens`' CSS. If it hasn't, the widget falls back to
the inline Gideon hex values so it looks right out of the box.

---

## 4. Register product skills

For every product-specific action Gideon can invoke, declare it in
`Gideon-AI/SKILLS/<slug>.md` **and** register the handler in the host:

```ts
// product-app/lib/gideon-skills.ts
import { SkillRegistry } from "@gideon/skills";

export const skills = new SkillRegistry("nest");

skills.register({
  id: "nest.open-tab",
  projects: ["nest"],
  minTier: "free",
  label: "Open tab",
  description: "Navigate the user to a Nest tab.",
  args: {
    tab: { type: "string", required: true, description: "Tab id." },
  },
  handler: async ({ tab }) => {
    // product-specific router push
    window.location.hash = `#/${tab}`;
    return { navigated: true, tab };
  },
});
```

Pass `skills.promptCatalog(user.tier)` into the chat endpoint's
request body (under a new `skills_catalog` key) when you're ready to
let Gideon emit skill markers — the client can parse them with
`parseSkillInvocations` and call `skills.invoke(...)`.

---

## 5. Deploy the Supabase side (one time per environment)

```bash
# From this repo.
supabase link --project-ref <gideonai-supabase-ref>

# DB
supabase db push

# Function secrets
supabase secrets set \
  ANTHROPIC_API_KEY=<sk-ant-...> \
  SUPABASE_URL=<same as NEXT_PUBLIC_SUPABASE_URL> \
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Functions
supabase functions deploy brain-ingest    --project-ref <ref>
supabase functions deploy brain-query     --project-ref <ref>
supabase functions deploy gideon-chat     --project-ref <ref>
supabase functions deploy brain-summarize --project-ref <ref>

# (Optional) Schedule brain-summarize nightly via pg_cron:
#   select cron.schedule('brain-summarize-nightly', '0 5 * * *',
#     $$ select net.http_post('https://<ref>.functions.supabase.co/brain-summarize',
#        '{"limit":50}'::jsonb, headers := '{"Authorization":"Bearer <service-role>"}') $$);
```

---

## 6. Smoke test before shipping

1. Open a product page → click the Ask Gideon button → send "hey".
2. Watch the network tab for a POST to `gideon-chat` with status 200
   and `content-type: text/event-stream`.
3. Response headers should include `x-gideon-model` and
   `x-gideon-memories`. First request: memories=0. Ingest a few
   memories, reload, confirm the number climbs.
4. Ask a question you've seeded the brain with. The reply should cite
   `[1]` or similar, matching the memory numbers in the system
   prompt.
5. Check the Supabase Logs for the function — a normal turn is
   ~400-1200 ms on Sonnet, ~1000-4000 ms on Opus with adaptive
   thinking.

---

## 7. When you find a bug or a new rule

1. Write it into `LEARNED/YYYY-MM-DD-<topic>.md` in this repo.
2. If the rule changes canonical behavior, update the overlay in
   `PROMPTS/product-overlays/<product>.md` **and** the mirrored
   `PRODUCT_OVERLAYS` constant inside
   `supabase/functions/gideon-chat/index.ts`. These two places must
   stay in sync; CI will eventually enforce it.
3. Redeploy `gideon-chat`.

---

## 8. Product-by-product status

| Product | Slug | Overlay | Embed | Skills |
|---------|------|---------|-------|--------|
| The Nest | `nest` | ✅ | pending host wire-in | `nest.open-tab`, `brain.contribute` |
| Lead Flow Pro | `lfp` | stub | pending | `lfp.draft-sequence`, `brain.contribute` |
| RepWatcher | `repwatcher` | stub | pending | `repwatcher.reply-review`, `brain.contribute` |
| Premier Dental Academy | `pda` | stub | pending | TBD |
| realryannichols.com | `rrn` | stub | pending | TBD |

Replace each "stub" overlay with the canonical one as Ryan lands it
in `Gideon-AI/PROMPTS/product-overlays/`. Each landing is a LEARNED
note.
