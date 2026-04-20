# Gideon — Skills Catalog

A **skill** is a named action Gideon can ask a product to perform on
behalf of the user. Gideon never runs code. He recommends a skill, the
product's `SkillRegistry` runs the handler, and the result flows back
into the next turn.

This directory holds the canonical catalog — one Markdown file per
skill. The runtime registry (`@gideon/skills`) pulls the contract from
the host app, not from these files; the files are what keeps the
catalog honest across products.

## Invocation protocol

Gideon emits skill calls as inline markers in his assistant message:

```
<<skill id="nest.open-tab" args='{"tab":"Income"}'>>
```

The client (via `parseSkillInvocations` from `@gideon/skills`)
strips the markers before rendering, collects the calls, and invokes
them against its `SkillRegistry`. Results are appended to the chat
history for the next turn.

## Writing a new skill

1. Add a file here: `Gideon-AI/SKILLS/<slug>.md`.
2. Fill in:
   - `id` — kebab-case, namespaced by product (`nest.open-tab`, `lfp.draft-sequence`).
   - `projects` — which products expose this skill.
   - `minTier` — lowest tier allowed to invoke.
   - `args` — JSON-schema-ish description.
   - `behavior` — what the host handler should actually do.
3. Implement the handler in the host app and register via:

   ```ts
   import { SkillRegistry } from "@gideon/skills";
   const skills = new SkillRegistry("nest");
   skills.register({
     id: "nest.open-tab",
     projects: ["nest"],
     minTier: "free",
     label: "Open tab",
     description: "Navigate the user to a Nest tab.",
     args: { tab: { type: "string", required: true, description: "Tab id." } },
     handler: async ({ tab }, ctx) => { /* ... */ },
   });
   ```

4. Pass `skills.promptCatalog(tier)` into the chat request body so the
   server appends it to Gideon's system prompt.
