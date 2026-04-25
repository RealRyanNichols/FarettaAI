// Shared types for the Faretta UI package. Kept thin on purpose — the
// server (faretta-chat Edge Function) is the source of truth for the
// conversation contract.

export type FarettaProject = "nest" | "lfp" | "repwatcher" | "pda" | "rrn";
export type FarettaTier = "free" | "core" | "ultra" | "internal";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  // Wall-clock timestamp the UI renders next to the message bubble.
  // Set by the caller; the server never relies on it.
  at?: number;
}

export interface FarettaChatProps {
  /**
   * The URL of the faretta-chat Edge Function. Required — there is no
   * default because every product embeds its own Supabase project URL.
   */
  endpoint: string;

  /** Product slug so the server can load the right overlay. */
  project: FarettaProject;

  /** Subscription tier — drives model routing and memory access. */
  tier: FarettaTier;

  /** User-facing name. Injected into the system prompt when present. */
  userName?: string;

  /**
   * Opaque per-user context the product wants Faretta to see — current
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
   * Faretta should be invited in, not pushed.
   */
  defaultOpen?: boolean;

  /** Override the trigger label ("Ask Faretta" by default). */
  triggerLabel?: string;
}
