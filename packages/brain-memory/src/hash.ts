// Normalize text so semantically identical content produces the same
// hash. Lowercase, strip punctuation, collapse whitespace. Deliberately
// aggressive — we'd rather over-dedupe small variations than store 20
// near-copies of "hey, just a reminder :)".
export function normalizeForHash(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Cheap, non-crypto hash — SHA-1 via Web Crypto. 40 hex chars. Plenty
// for dedup; collision probability is astronomically low at our scale.
export async function hashContent(text: string): Promise<string> {
  const enc = new TextEncoder().encode(normalizeForHash(text));
  const buf = await crypto.subtle.digest("SHA-1", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
