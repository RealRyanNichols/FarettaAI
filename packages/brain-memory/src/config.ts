import type { Host } from "./types.js";

// Per-app configuration. Every product app that imports this package
// MUST call `setProject` and `setHost` at boot — otherwise ingest/query
// throw a clear error instead of silently writing under the wrong name.

let project: string | null = null;
let host: Host | null = null;
let contributing = false;

export function setProject(name: string): void {
  if (!name || typeof name !== "string") {
    throw new Error("[@gideon/brain-memory] setProject requires a non-empty string");
  }
  project = name;
}

export function getProject(): string {
  if (!project) {
    throw new Error(
      "[@gideon/brain-memory] setProject(...) must be called before ingest/query. " +
        "Each product app registers its own project name at boot.",
    );
  }
  return project;
}

export function setHost(h: Host): void {
  host = h;
}

export function getHost(): Host {
  if (!host) {
    throw new Error(
      "[@gideon/brain-memory] setHost(...) must be called before ingest/query. " +
        "Pass a Host that provides getSupabase, currentUser, getTier, isContributing, isConfigured.",
    );
  }
  return host;
}

export function setContributeToBrain(enabled: boolean): void {
  contributing = !!enabled;
}

export function isContributingLocal(): boolean {
  return contributing;
}
