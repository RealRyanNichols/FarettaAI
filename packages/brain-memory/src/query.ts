import type { QueryInput, QueryMemory } from "./types.js";
import { getHost, getProject } from "./config.js";

// Retrieval side. Hits `brain-query` Edge Function, which returns the
// top N memories relevant to a query, scoped by the caller's tier.
export async function queryBrainMemory(
  input: QueryInput = {},
): Promise<QueryMemory[]> {
  const { query, tags = [], limit = 5, crossProject = false } = input;

  const host = getHost();
  if (!host.isConfigured()) return [];

  const sb = await host.getSupabase();
  const tier = host.getTier();

  try {
    const { data, error } = await sb.functions.invoke("brain-query", {
      body: {
        project: crossProject ? null : getProject(),
        query,
        tags,
        limit,
        requester_tier: tier,
      },
    });
    if (error) return [];
    const payload = data as { memories?: QueryMemory[] } | null;
    return Array.isArray(payload?.memories) ? payload.memories : [];
  } catch {
    return [];
  }
}
