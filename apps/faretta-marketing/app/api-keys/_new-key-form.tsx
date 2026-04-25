"use client";

import { useState } from "react";

type Issued = { id: string; name: string; prefix: string; key: string };

export function NewKeyForm() {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed (${res.status})`);
      }
      const body = (await res.json()) as Issued;
      setIssued(body);
      setName("");
      // Soft refresh so the table picks up the new row.
      setTimeout(() => window.location.reload(), 60_000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyKey() {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  if (issued) {
    return (
      <div className="rounded-f-primary border border-verdict/40 bg-paper p-6">
        <h3 className="font-sans font-bold text-ink text-[1.125rem] mb-2">Key created — copy it now.</h3>
        <p className="text-ink-2 text-[0.875rem] leading-[1.5] mb-4">
          This is the only time you'll see the full key. We store it hashed. If you lose it, just
          revoke it and issue a new one.
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <code className="px-3 py-2 bg-parchment border border-ink/10 rounded-f-secondary font-mono text-[0.8125rem] text-ink break-all">
            {issued.key}
          </code>
          <button
            onClick={copyKey}
            className="px-4 py-2 rounded-full bg-liberty text-paper text-[0.8125rem] font-semibold hover:bg-liberty-deep transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          onClick={() => {
            setIssued(null);
            window.location.reload();
          }}
          className="px-4 py-2 rounded-full border border-ink/20 text-ink-2 text-[0.8125rem] font-semibold hover:border-liberty hover:text-liberty transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-f-primary border border-ink/10 bg-paper p-6">
      <label className="block mb-3">
        <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute font-semibold mb-2">
          Key name
        </span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder="e.g. RepWatchr embed"
          className="w-full px-4 py-2.5 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors"
        />
      </label>
      {error && <p className="text-objection text-[0.8125rem] mb-3">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="px-5 py-2.5 rounded-full bg-liberty text-paper text-[0.875rem] font-semibold shadow-f-cta hover:bg-liberty-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Issuing…" : "Issue new key"}
      </button>
    </form>
  );
}
