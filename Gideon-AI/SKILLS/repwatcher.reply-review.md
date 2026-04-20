# Skill: `repwatcher.reply-review`

Draft a reply to a review and stage it for the user to approve.

## Contract

| Field        | Value |
|--------------|-------|
| `id`         | `repwatcher.reply-review` |
| `projects`   | `repwatcher` |
| `minTier`    | `core` |
| `label`      | Draft reply |
| `description`| Generate an on-brand reply to a review; never auto-posts. |

### Args

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `reviewId` | `string` | yes | The review record to reply to. |
| `tone` | `string` | no | `matter-of-fact`, `warm`, `apologetic`. Defaults to matter-of-fact for negative, warm for positive. |

## Behavior

The handler:

1. Fetches the review content + rating + business profile.
2. Calls Claude with the RepWatcher reply template.
3. Returns `{ draft: string, followUps: string[] }` — `followUps` is
   the internal action list (staff training prompts, refund checks).
4. The host UI shows the draft in a modal with Approve / Edit / Skip.

## When Gideon should emit it

When the user is reading a review inside the Reviews tab and asks
how to respond, or asks "what should I say to this one review". Skip
if the review is older than 30 days unless the user explicitly asks.
