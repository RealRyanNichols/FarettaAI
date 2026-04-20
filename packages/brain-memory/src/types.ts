// Shared contracts for the brain_memory layer. Kept in one file so the
// Edge Functions can eventually consume the same types without pulling
// in runtime code.

export type Kind =
  | "tactic"
  | "script"
  | "story"
  | "question"
  | "answer"
  | "note";

export type AccessTier = "public" | "core" | "ultra" | "internal";

export type SourceTier = "free" | "core" | "ultra" | "internal";

export interface Memory {
  id: string;
  project: string;
  kind: Kind;
  content: string;
  summary: string | null;
  tags: string[];
  occurrences: number;
  access_tier: AccessTier;
  first_seen_at: string;
  last_seen_at: string;
}

export interface ContributeInput {
  kind: Kind;
  content: string;
  tags?: string[];
  accessTier?: AccessTier;
}

export interface ContributeResult {
  ok?: true;
  skipped?:
    | "backend-not-configured"
    | "too-short"
    | "user-opted-out"
    | "edge-function-error"
    | "network-error"
    | "project-not-set";
  error?: string;
}

export interface QueryInput {
  query?: string;
  tags?: string[];
  limit?: number;
  crossProject?: boolean;
}

export interface QueryMemory {
  id: string;
  kind: Kind;
  content: string;
  tags: string[];
  occurrences: number;
}

// The host app provides a Supabase client and whatever runtime signals
// (current user, plan tier, opt-in flag) we need at ingest/query time.
// Each product wires these up at init — see `setHost` in config.ts.
export interface Host {
  getSupabase: () => Promise<SupabaseLike>;
  currentUser: () => Promise<{ id: string | null } | null>;
  getTier: () => SourceTier;
  isContributing: () => boolean;
  isConfigured: () => boolean;
}

// Minimal shape we lean on — keeps us from taking a hard dep on the
// full @supabase/supabase-js client type here.
export interface SupabaseLike {
  functions: {
    invoke: (
      name: string,
      options: { body: unknown },
    ) => Promise<{ data: unknown; error: { message: string } | null }>;
  };
}
