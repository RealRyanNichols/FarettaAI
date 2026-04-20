# Skill: `brain.contribute`

Contribute a memory to the Gideon brain from the current conversation.

## Contract

| Field        | Value |
|--------------|-------|
| `id`         | `brain.contribute` |
| `projects`   | `nest`, `lfp`, `repwatcher`, `pda`, `rrn` |
| `minTier`    | `core` |
| `label`      | Share with the network |
| `description`| Save this piece of wisdom so the network can see it. |

### Args

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `content` | `string` | yes | The memory text. Usually a paraphrase of what the user just said. |
| `kind` | `string` | yes | One of tactic / script / story / question / answer / note. |
| `tags` | `string[]` | no | Freeform tags. |

## Behavior

The host handler should call `contributeMemory()` from
`@gideon/brain-memory` with the current `project`, `source_user_id`,
and `source_tier`. On success, return `{ deduped, id }`.

Gideon's opt-in rules apply:

- In Mode A products (Lead Flow Pro), the contribution happens
  automatically after a turn classified "worth remembering" — this
  skill is still the path, triggered by product code not by Gideon.
- In Mode B products (The Nest), Gideon never contributes without the
  user tapping the button this skill surfaces.

## When Gideon should emit it

Only in Mode A products, only on turns the classifier flags
"worth_remembering" with confidence > 0.8. In Mode B, Gideon suggests
the button in natural language but does **not** emit the marker
unattended.
