import type {
  SkillContext,
  SkillDefinition,
  SkillInvocation,
  SkillResult,
  SkillTier,
} from "./types";

const TIER_RANK: Record<SkillTier, number> = {
  free: 0, core: 1, ultra: 2, internal: 3,
};

// Runtime registry — one per host app. Not a singleton on purpose;
// products with multiple surfaces (web + worker) should each instantiate.
export class SkillRegistry {
  private readonly skills = new Map<string, SkillDefinition>();

  constructor(private readonly project: string) {}

  register(def: SkillDefinition): void {
    if (!def.projects.includes(this.project)) {
      throw new Error(
        `[faretta/skills] skill '${def.id}' is not declared for project '${this.project}'`,
      );
    }
    if (this.skills.has(def.id)) {
      throw new Error(`[faretta/skills] skill '${def.id}' already registered`);
    }
    this.skills.set(def.id, def);
  }

  list(tier: SkillTier): SkillDefinition[] {
    const rank = TIER_RANK[tier] ?? 0;
    return [...this.skills.values()].filter(
      (s) => (TIER_RANK[s.minTier] ?? 0) <= rank,
    );
  }

  get(id: string): SkillDefinition | undefined {
    return this.skills.get(id);
  }

  /**
   * Render the registered skills into a prompt-friendly catalog the
   * faretta-chat Edge Function can append to the system block. Faretta
   * is instructed to emit `<<skill id="..." args='...'>>` markers when
   * he wants to invoke one; the client parses those out of the final
   * assistant message.
   */
  promptCatalog(tier: SkillTier): string {
    const available = this.list(tier);
    if (!available.length) return "No skills available for this tier.";
    const lines = available.map((s) => {
      const argList = s.args
        ? Object.entries(s.args)
            .map(([k, v]) => `${k}${v.required ? "" : "?"}: ${v.type}`)
            .join(", ")
        : "";
      return `- ${s.id}(${argList}) — ${s.description}`;
    });
    return `AVAILABLE SKILLS\n${lines.join("\n")}`;
  }

  async invoke<T = unknown>(
    call: SkillInvocation,
    tier: SkillTier,
    ctx: SkillContext,
  ): Promise<SkillResult<T>> {
    const def = this.skills.get(call.skillId);
    if (!def) {
      return { ok: false, skillId: call.skillId, error: "unknown skill" };
    }
    if ((TIER_RANK[def.minTier] ?? 0) > (TIER_RANK[tier] ?? 0)) {
      return { ok: false, skillId: call.skillId, error: "tier insufficient" };
    }
    try {
      const result = (await def.handler(call.args, ctx)) as T;
      return { ok: true, skillId: call.skillId, result };
    } catch (err: any) {
      return { ok: false, skillId: call.skillId, error: err?.message ?? String(err) };
    }
  }
}

/**
 * Parse `<<skill id="..." args='{...}'>>` markers out of an assistant
 * message. Returns the invocations Faretta wants to run, plus the text
 * with the markers stripped so the UI can render it cleanly.
 */
export function parseSkillInvocations(text: string): {
  clean: string;
  calls: SkillInvocation[];
} {
  const pattern = /<<skill\s+id="([^"]+)"(?:\s+args='([^']*)')?\s*>>/g;
  const calls: SkillInvocation[] = [];
  const clean = text.replace(pattern, (_match, id, rawArgs) => {
    let args: Record<string, unknown> = {};
    if (rawArgs) {
      try { args = JSON.parse(rawArgs); }
      catch { /* swallow — leave args empty if the model emits junk */ }
    }
    calls.push({ skillId: id, args });
    return "";
  }).trim();
  return { clean, calls };
}
