// A Skill is a named contract between Faretta's prompt surface and a
// host product. Faretta doesn't execute code — he names the skill and
// the args. The host app's registry runs the handler and returns
// the result to Faretta for the follow-up turn.

export type SkillTier = "free" | "core" | "ultra" | "internal";

export interface SkillDefinition<Args = any, Result = any> {
  /** Stable identifier. Kebab-case. Used in prompts + UI. */
  id: string;
  /** Short human label surfaced on the one-tap button. */
  label: string;
  /** One sentence Faretta sees describing when to use this skill. */
  description: string;
  /** The product slugs this skill is available in. */
  projects: string[];
  /** Minimum tier required to invoke. */
  minTier: SkillTier;
  /**
   * JSON-schema-ish shape of the handler args. The runtime doesn't
   * validate by default — the host can wrap with Zod or equivalent.
   */
  args?: Record<string, { type: string; description: string; required?: boolean }>;
  /** Async function the host provides. */
  handler: (args: Args, ctx: SkillContext) => Promise<Result>;
}

export interface SkillContext {
  /** Current user id, if available. */
  userId?: string;
  /** Product-supplied context (tab, tier, anything else). */
  context: Record<string, unknown>;
}

export type SkillInvocation = {
  skillId: string;
  args: Record<string, unknown>;
};

export type SkillResult<T = unknown> =
  | { ok: true; skillId: string; result: T }
  | { ok: false; skillId: string; error: string };
