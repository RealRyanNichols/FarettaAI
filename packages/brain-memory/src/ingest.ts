import type { ContributeInput, ContributeResult } from "./types.js";
import { hashContent } from "./hash.js";
import { getHost, getProject } from "./config.js";

// Top-level ingest call. Everything that wants to contribute a memory
// funnels through here. Fire-and-forget by default — the user's UI
// should never block waiting for a Brain write.
export async function contributeMemory(
  input: ContributeInput,
): Promise<ContributeResult> {
  const { kind, content, tags = [], accessTier = "core" } = input;

  const host = getHost();
  const project = getProject();

  if (!host.isConfigured()) return { skipped: "backend-not-configured" };
  if (!content || content.length < 8) return { skipped: "too-short" };
  if (!host.isContributing()) return { skipped: "user-opted-out" };

  const user = await host.currentUser();
  const content_hash = await hashContent(content);
  const tier = host.getTier();

  const payload = {
    project,
    source_user_id: user?.id ?? null,
    source_tier: tier,
    kind,
    content,
    content_hash,
    tags,
    access_tier: accessTier,
  };

  const sb = await host.getSupabase();
  try {
    const { error } = await sb.functions.invoke("brain-ingest", { body: payload });
    if (error) return { skipped: "edge-function-error", error: error.message };
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { skipped: "network-error", error: message };
  }
}
