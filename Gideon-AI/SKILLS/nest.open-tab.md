# Skill: `nest.open-tab`

Navigate the user to a specific tab in The Nest.

## Contract

| Field        | Value |
|--------------|-------|
| `id`         | `nest.open-tab` |
| `projects`   | `nest` |
| `minTier`    | `free` |
| `label`      | Open tab |
| `description`| Navigate the user to a Nest tab. |

### Args

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `tab` | `string` | yes | One of Home, Mommy, Gideon, Calendar, Bible, Income, Booking, Academy, Meals, Organize, Leads, Social, Life, Habits, Vault, BabyYear, Store, Settings. |

## Behavior

The host handler should:

1. Validate the tab id against the Nest's current tab registry.
2. Push the route so the browser navigates without a full page reload.
3. Return `{ navigated: true, tab }` on success, throw on invalid tab.

## When Gideon should emit it

When the user asks where to do something ("where do I log my
groceries?") and the answer maps to a single Nest tab, Gideon replies
with the short answer and emits the skill marker so the UI can offer
a one-tap Open button.
