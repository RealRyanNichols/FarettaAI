// Shared types for the Gideon UI package. Kept thin on purpose — the
// server (gideon-chat Edge Function) is the source of truth for the
// conversation contract.

export type GideonProject = "nest" | "lfp" | "repwatcher" | "pda" | "rrn" | "faretta";
export type GideonTier = "free" | "core" | "ultra" | "internal";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  // Wall-clock timestamp the UI renders next to the message bubble.
  // Set by the caller; the server never relies on it.
  at?: number;
}

export interface GideonChatProps {
  /**
   * The URL of the gideon-chat Edge Function. Required — there is no
   * default because every product embeds its own Supabase project URL.
   */
  endpoint: string;

  /** Product slug so the server can load the right overlay. */
  project: GideonProject;

  /** Subscription tier — drives model routing and memory access. */
  tier: GideonTier;

  /** User-facing name. Injected into the system prompt when present. */
  userName?: string;

  /**
   * Opaque per-user context the product wants Gideon to see — current
   * tab, roles, Heart status, etc. Rendered into the system prompt as
   * "key: value" lines.
   */
  userContext?: Record<string, unknown>;

  /** Seed conversation, e.g. restored from localStorage on mount. */
  initialHistory?: ChatMessage[];

  /** Called on every completed turn so the host can persist history. */
  onTurnComplete?: (history: ChatMessage[]) => void;

  /**
   * Whether the widget is open on first render. Defaults to false —
   * Gideon should be invited in, not pushed.
   */
  defaultOpen?: boolean;

  /** Override the trigger label ("Ask Gideon" by default). */
  triggerLabel?: string;
}
