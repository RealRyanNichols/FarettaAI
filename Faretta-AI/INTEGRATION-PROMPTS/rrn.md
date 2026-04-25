# Integration Prompt — www.realryannichols.com

Paste the fenced block below into a Claude Code session rooted in the
`RealRyanNicholsLLC` repository. The session will scaffold Faretta
into the public site end-to-end: memory client, chat widget, skills
registry, env vars, and a per-route mount that respects visitor
intent. Read it once before you paste — it makes assumptions about
the repo you may want to override.

**Assumptions Claude will verify before editing.** If any of these
are wrong, it will stop and ask you:

- The site is a Next.js 14+ App Router project on the branch Ryan
  specifies (default `main`).
- It deploys to Vercel and reads env vars from the Vercel project of
  the same name.
- It uses either Tailwind or plain CSS for styling — the mount script
  does not assume one.
- `ryan@realryannichols.com` must never appear as a `mailto:` link
  or on any user-visible surface.

**Prerequisites Claude cannot do for you.** These must exist before
the session runs:

1. The FarettaAI Supabase project is deployed with the four Edge
   Functions (`brain-ingest`, `brain-query`, `faretta-chat`,
   `brain-summarize`). Its project-ref is recorded below.
2. A Vercel project named `realryannichols-com` (or equivalent) is
   already connected.
3. The FarettaAI repo is reachable either as a workspace package or
   as a git submodule at `vendor/faretta/`.

Fill the three values in the prompt before pasting:

- `<FARETTA_SUPABASE_REF>` — the Supabase project-ref for FarettaAI.
- `<FARETTA_CHAT_URL>` — full URL like
  `https://<ref>.functions.supabase.co/faretta-chat`.
- `<FARETTA_PACKAGES_PATH>` — how this repo consumes `@faretta/*`. One
  of `workspace:*`, a submodule path, or an npm registry once we
  publish.

---

```
# Claude Code — integrate Faretta AI into www.realryannichols.com

You are operating inside the RealRyanNicholsLLC repository, which
hosts www.realryannichols.com. Your job is to integrate the Faretta
AI product (from the `realryannichols/farettaai` repo) into this site
as a first-class feature. Ryan's email must NEVER appear on any
user-visible surface — all visitor contact flows through the Faretta
contact form, which writes to Supabase.

## Canonical context

- Faretta hub repo: realryannichols/farettaai
- Source of truth for behavior: Faretta-AI/ directory inside that repo.
  READ these before editing: CHARTER.md, IDENTITY.md, ARCHITECTURE.md,
  CLAUDE.md, PROMPTS/system-prompt.md, PROMPTS/product-overlays/rrn.md,
  INTEGRATION.md, SKILLS/README.md.
- Shared packages you will install: @faretta/ui, @faretta/skills,
  @faretta/brain-memory, @faretta/design-tokens.
- Deployed Edge Function: <FARETTA_CHAT_URL>
- FarettaAI Supabase project-ref: <FARETTA_SUPABASE_REF>
- Package source: <FARETTA_PACKAGES_PATH>

## Non-negotiables

1. This site's project slug is `rrn`. Every call to
   `setProject()` / `<FarettaChat project="...">` / the chat API uses
   exactly `"rrn"`.
2. The rrn product overlay (Faretta-AI/PROMPTS/product-overlays/rrn.md)
   is the canonical voice. Do not fork it — if the overlay needs to
   change, open a PR in realryannichols/farettaai under
   `LEARNED/YYYY-MM-DD-rrn-overlay-change.md`.
3. NEVER render a mailto link. NEVER surface ryan@realryannichols.com
   or any personal email. All visitor intent routes to /contact,
   which POSTs to the server and writes to Supabase.
4. The site is visitor-facing. Default chat tier is `free` unless a
   logged-in user's profile says otherwise. (The rrn site likely has
   no auth yet — free everywhere is fine.)
5. Do NOT introduce a service-role key into any client bundle. The
   service role is server-only. If you can't find a server-side seam
   for a call, stop and ask.
6. Keep the visual change minimal. The rrn site has its own brand;
   Faretta is a guest inside it, not a takeover. Use @faretta/design-
   tokens variables through a CSS var prefix scoped to the chat
   widget — don't push Faretta colors into site-level styles.

## Phase 1 — verify assumptions

Before editing anything, run these checks and report back:

1. `git status` and current branch. If the repo is not clean, ask
   Ryan whether to stash or continue.
2. Confirm this is a Next.js App Router project: check
   `next.config.*`, `app/` directory, `package.json` for `next >= 14`.
3. Identify the existing contact / footer / nav files so the mount
   goes in the right place.
4. Identify env-var handling: is there a `.env.example`? A Vercel
   integration? Where do other secrets live?
5. If any check fails, STOP and ask Ryan what to do.

## Phase 2 — add the packages

Pick the right install path based on <FARETTA_PACKAGES_PATH>:

- Workspace: add `"@faretta/ui": "workspace:*"`, etc. to
  `package.json`, then `pnpm install` (or `npm install`).
- Submodule: `git submodule add git@github.com:realryannichols/farettaai.git vendor/faretta`,
  then add `"@faretta/ui": "file:./vendor/faretta/packages/ui"` etc.
  Build the packages once:
  `pnpm --filter @faretta/brain-memory --filter @faretta/skills --filter @faretta/ui build`.
- Registry: once Ryan publishes, `pnpm add @faretta/ui @faretta/skills @faretta/brain-memory @faretta/design-tokens`.

## Phase 3 — env vars

Add to `.env.example` (do NOT put real values in source):

```
NEXT_PUBLIC_FARETTA_CHAT_URL=<FARETTA_CHAT_URL>
NEXT_PUBLIC_SUPABASE_URL=https://<FARETTA_SUPABASE_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask Ryan, public anon key>
SUPABASE_SERVICE_ROLE_KEY=<server-only; for contact form>
```

Document in the repo's README that these must be set in Vercel
before deploy. Never commit the service-role key.

## Phase 4 — memory client

Create `lib/faretta.ts` (or equivalent):

```ts
import { createClient } from "@supabase/supabase-js";
import {
  setHost,
  setProject,
  setContributeToBrain,
} from "@faretta/brain-memory";

// Server-only client. DO NOT import this from a client component.
export function getFarettaAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("[rrn] supabase env missing");
  const sb = createClient(url, key, { auth: { persistSession: false } });
  setProject("rrn");
  setHost(sb);
  setContributeToBrain(false); // rrn is Mode B — visitors don't auto-contribute.
  return sb;
}
```

## Phase 5 — mount the chat widget

Create a client component `components/FarettaMount.tsx`:

```tsx
"use client";
import { FarettaChat } from "@faretta/ui";

export function FarettaMount() {
  return (
    <FarettaChat
      endpoint={process.env.NEXT_PUBLIC_FARETTA_CHAT_URL!}
      project="rrn"
      tier="free"
      userContext={{
        // You can add more context here as the site grows — e.g.
        // the current page, whether the visitor has scrolled past a
        // product section, etc.
        source: "realryannichols.com",
      }}
      triggerLabel="Ask Faretta"
    />
  );
}
```

Mount it inside the root `app/layout.tsx` (below `{children}`, above
the `</body>` close tag) so it follows the visitor across every
route. Dynamic-import it if the project bundle is tight:

```tsx
import dynamic from "next/dynamic";
const FarettaMount = dynamic(() => import("@/components/FarettaMount").then(m => m.FarettaMount), { ssr: false });
```

## Phase 6 — register rrn-specific skills

Create `lib/faretta-skills.ts`:

```ts
import { SkillRegistry } from "@faretta/skills";

export const rrnSkills = new SkillRegistry("rrn");

// Route the visitor to a product page when Faretta recommends one.
rrnSkills.register({
  id: "rrn.route-to-product",
  projects: ["rrn"],
  minTier: "free",
  label: "Take me there",
  description:
    "Navigate the visitor to one of Ryan's product pages (/products/nest, /products/lfp, /products/repwatcher, /products/pda).",
  args: {
    slug: {
      type: "string",
      required: true,
      description: "One of: nest, lfp, repwatcher, pda",
    },
  },
  handler: async ({ slug }) => {
    const valid = ["nest", "lfp", "repwatcher", "pda"];
    if (!valid.includes(slug as string)) throw new Error(`unknown slug: ${slug}`);
    window.location.assign(`/products/${slug}`);
    return { routed: true, slug };
  },
});

// Route the visitor to the contact form (Faretta never surfaces an
// email address — only /contact).
rrnSkills.register({
  id: "rrn.open-contact",
  projects: ["rrn"],
  minTier: "free",
  label: "Open contact form",
  description:
    "Open the contact form with an optional pre-filled subject. Use this whenever a visitor wants to reach Ryan directly.",
  args: {
    subject: { type: "string", description: "Pre-fill the message." },
  },
  handler: async ({ subject }) => {
    const params = subject
      ? `?subject=${encodeURIComponent(String(subject))}`
      : "";
    window.location.assign(`/contact${params}`);
    return { routed: true };
  },
});
```

Wire the catalog into the chat request body by editing
`components/FarettaMount.tsx`:

```tsx
"use client";
import { FarettaChat } from "@faretta/ui";
import { useMemo } from "react";
import { rrnSkills } from "@/lib/faretta-skills";

export function FarettaMount() {
  const skillsCatalog = useMemo(() => rrnSkills.promptCatalog("free"), []);
  return (
    <FarettaChat
      endpoint={process.env.NEXT_PUBLIC_FARETTA_CHAT_URL!}
      project="rrn"
      tier="free"
      userContext={{ source: "realryannichols.com", skills_catalog: skillsCatalog }}
      triggerLabel="Ask Faretta"
    />
  );
}
```

(Note: the current @faretta/ui version does not yet parse skill
markers from the assistant stream — that is a planned enhancement.
Land the mount first; the parser is additive later.)

## Phase 7 — contact form

If the rrn site already has a contact page, audit it. Requirements:

- No mailto links anywhere in the repo. Grep the codebase and remove
  every one. Replace with `<Link href="/contact">`.
- The form POSTs to `/api/contact` server-side and writes to the
  FarettaAI Supabase `contact_requests` table via service-role.
  See `apps/marketing/app/api/contact/route.ts` in the farettaai repo
  for the reference implementation — port it verbatim and adjust
  imports.
- Include an honest honeypot field (`name="hp"`) to filter bots.
- Never persist the raw IP. Hash it with sha-256 before insert.

If the rrn site has no contact page yet, scaffold one using the same
reference implementation. Match the rrn site's existing styling, not
the Faretta palette.

## Phase 8 — nav + footer cleanup

Audit every navigation surface (header, footer, product pages) for:

- `mailto:` links → replace with `/contact`.
- Plaintext email addresses → replace with `/contact`.
- "Email Ryan" / "contact@..." copy → replace with "Contact" linking
  to `/contact`.

Grep recursively:
```
grep -r "mailto:" .
grep -r "ryan@" .
```

Both must return zero matches before Phase 9.

## Phase 9 — verify

Run the typecheck, build, and a local smoke test:

1. `pnpm typecheck` / `npm run typecheck` — must be clean.
2. `pnpm build` — must be clean.
3. `pnpm dev`, open http://localhost:3000, click the floating
   "Ask Faretta" button. Send "hey". You should see:
   - A POST to `<FARETTA_CHAT_URL>` with status 200.
   - Response header `x-faretta-model` set.
   - Response header `x-faretta-memories` set (likely 0 on a fresh
     brain).
   - A streaming reply in the chat bubble in under 4 seconds.
4. Submit the contact form with a test payload. Verify the row
   appears in `contact_requests` in Supabase.
5. Ask Faretta a safety-triggering question ("I want to hurt myself")
   and confirm the response is the 988 canned line with header
   `x-faretta-crisis: suicide`. The model should NOT be invoked.

## Phase 10 — commit and open a draft PR

Commit per phase (one commit per numbered section above, using
Ryan's existing commit style in the repo).

Push to a branch named `faretta/integrate-rrn` and open a DRAFT PR
against `main`. The PR body should link to:

- Faretta-AI/INTEGRATION.md in the hub repo.
- Faretta-AI/PROMPTS/product-overlays/rrn.md (the voice Faretta uses here).
- The Supabase project-ref.

Do not merge. Ryan approves.

## If you get stuck

- Any ambiguity about whether a change affects Faretta's cross-product
  behavior: stop, open a LEARNED note in the hub repo, ask Ryan.
- Missing env var: do not hard-code; update .env.example and ask Ryan
  to set it in Vercel.
- Service-role key in a client bundle: STOP. Treat it as a Sev 1.
- Any mailto or personal email showing up: STOP. Treat it as a Sev 1.
```

---

## After the session

Ryan's follow-ups:

- Set the three env vars in Vercel for both Preview and Production.
- Approve the draft PR.
- Watch the first 24 hours of `contact_requests` — if you see spam
  patterns, tighten the form (rate limit by IP hash, add a simple
  math CAPTCHA). The honeypot is intentionally minimal.
- Tell the FarettaAI repo about any rrn overlay corrections via a
  dated LEARNED note.
