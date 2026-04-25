"use client";

import { useState } from "react";

export function BillingButton({ hasCustomer }: { hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) throw new Error(body.error || `Portal failed (${res.status})`);
      window.location.href = body.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setLoading(false);
    }
  }

  if (!hasCustomer) {
    return (
      <a
        href="/pricing"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-liberty text-liberty text-[0.8125rem] font-semibold hover:bg-liberty hover:text-paper transition-colors"
      >
        See plans →
      </a>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-liberty text-liberty text-[0.8125rem] font-semibold hover:bg-liberty hover:text-paper transition-colors disabled:opacity-60"
      >
        {loading ? "Opening…" : "Manage billing"}
      </button>
      {error && <span className="text-objection text-[0.75rem]">{error}</span>}
    </div>
  );
}
