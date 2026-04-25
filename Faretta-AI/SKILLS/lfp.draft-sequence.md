# Skill: `lfp.draft-sequence`

Draft a follow-up sequence for a specific lead.

## Contract

| Field        | Value |
|--------------|-------|
| `id`         | `lfp.draft-sequence` |
| `projects`   | `lfp` |
| `minTier`    | `core` |
| `label`      | Draft sequence |
| `description`| Generate a SMS+email follow-up sequence for a lead. |

### Args

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `leadId` | `string` | yes | The lead record the sequence is for. |
| `channel` | `string` | no | `sms`, `email`, or `both`. Defaults to `both`. |
| `cadence` | `string` | no | `aggressive`, `balanced`, `gentle`. Defaults to `balanced`. |

## Behavior

The host handler pulls the lead's profile + pipeline stage, hands
them plus the cadence to a Claude call with the Lead Flow Pro sequence
template, and returns `{ steps: [{ at: '...', channel, copy }] }`.

The host surfaces the drafts in the Sequences tab with a one-tap
"Activate" button — Faretta does not persist the sequence himself.

## When Faretta should emit it

When the user names a stuck deal and asks what to send next. Emit the
marker with `leadId` inferred from `ctx.context.selectedLeadId` if
present; otherwise ask the user which lead.
