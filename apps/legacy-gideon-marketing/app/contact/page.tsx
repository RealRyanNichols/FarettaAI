"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "ok" }
  | { status: "error"; message: string };

const products = [
  { value: "", label: "What are you here about?" },
  { value: "nest", label: "The Nest — for moms" },
  { value: "lfp", label: "Lead Flow Pro — sales pipelines" },
  { value: "repwatcher", label: "RepWatcher — reviews + reputation" },
  { value: "pda", label: "Premier Dental Academy" },
  { value: "faretta", label: "Faretta — the AI itself" },
  { value: "other", label: "Something else" },
];

const tiers = [
  { value: "", label: "Tier (optional)" },
  { value: "free", label: "Free" },
  { value: "core", label: "Core" },
  { value: "ultra", label: "Ultra" },
  { value: "team", label: "Team / custom" },
];

export default function ContactPage() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `Submit failed (${res.status})`);
      }
      setState({ status: "ok" });
      form.reset();
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 backdrop-blur-md bg-[linear-gradient(to_bottom,rgba(10,14,26,0.92),rgba(10,14,26,0.6)_70%,transparent)]">
        <Link
          href="/"
          className="flex items-center gap-[10px] font-display uppercase tracking-wordmark text-[0.875rem]"
        >
          <img src="/brand/logo.svg" alt="Faretta mark" className="w-7 h-7" />
          <span>Faretta</span>
        </Link>
        <Link
          href="/pricing"
          className="text-[0.8125rem] font-semibold text-mist hover:text-gold transition-colors"
        >
          Pricing
        </Link>
      </nav>

      <main className="relative pt-[140px] pb-20 px-6 max-w-[760px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-[10px] text-[0.75rem] tracking-kicker uppercase text-gold font-semibold mb-6">
            <span
              className="w-[6px] h-[6px] rounded-full bg-flame shadow-[0_0_12px_#FF6B2C]"
              style={{ animation: "f-pulse 2.4s ease-in-out infinite" }}
            />
            <span>Contact</span>
          </div>

          <h1 className="font-display font-display-weight leading-[0.98] tracking-[-0.03em] mb-5 text-[clamp(2rem,6vw,3.5rem)]">
            Tell us what you&apos;re
            <br />
            <span className="bg-f-wordmark bg-clip-text text-transparent">trying to build.</span>
          </h1>

          <p className="text-mist max-w-[620px] mb-10 leading-[1.6] text-[clamp(1rem,2vw,1.125rem)]">
            We read every message. If you are a fit for one of Ryan&apos;s products,
            we&apos;ll route you. If you aren&apos;t, we&apos;ll tell you that too.
          </p>
        </motion.div>

        {state.status === "ok" ? (
          <div className="rounded-f-primary border border-gold/40 bg-[linear-gradient(180deg,rgba(212,168,85,0.08),rgba(255,107,44,0.04))] p-8">
            <h2 className="font-display font-display-weight text-[1.5rem] leading-tight mb-3">
              Got it.
            </h2>
            <p className="text-mist text-[1rem] leading-[1.6] mb-6">
              Your message is in the queue. We&apos;ll come back to you from a real
              inbox — usually within a couple of business days.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-[1.5px] border-ink/20 text-ink text-[0.9375rem] font-semibold transition-all duration-hover hover:border-gold hover:text-gold"
              >
                Back to the story
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[1px]"
              >
                See the tiers
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {/* honeypot — hidden from humans, attractive to bots */}
            <input
              type="text"
              name="hp"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
              <label className="block">
                <span className="block text-[0.75rem] tracking-kicker uppercase text-mist-2 mb-2 font-semibold">
                  Your name
                </span>
                <input
                  required
                  name="name"
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-f-secondary bg-[rgba(18,22,35,0.6)] border border-ink/10 text-ink text-[0.9375rem] outline-none focus:border-gold transition-colors"
                  placeholder="First and last"
                />
              </label>
              <label className="block">
                <span className="block text-[0.75rem] tracking-kicker uppercase text-mist-2 mb-2 font-semibold">
                  Email
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-f-secondary bg-[rgba(18,22,35,0.6)] border border-ink/10 text-ink text-[0.9375rem] outline-none focus:border-gold transition-colors"
                  placeholder="you@work.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-[0.75rem] tracking-kicker uppercase text-mist-2 mb-2 font-semibold">
                Company <span className="text-mist-2 normal-case tracking-normal">(optional)</span>
              </span>
              <input
                name="company"
                maxLength={200}
                className="w-full px-4 py-3 rounded-f-secondary bg-[rgba(18,22,35,0.6)] border border-ink/10 text-ink text-[0.9375rem] outline-none focus:border-gold transition-colors"
                placeholder="Where you work, if it matters"
              />
            </label>

            <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
              <label className="block">
                <span className="block text-[0.75rem] tracking-kicker uppercase text-mist-2 mb-2 font-semibold">
                  Interested in
                </span>
                <select
                  name="product"
                  className="w-full px-4 py-3 rounded-f-secondary bg-[rgba(18,22,35,0.6)] border border-ink/10 text-ink text-[0.9375rem] outline-none focus:border-gold transition-colors"
                  defaultValue=""
                >
                  {products.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[0.75rem] tracking-kicker uppercase text-mist-2 mb-2 font-semibold">
                  Tier
                </span>
                <select
                  name="tier"
                  className="w-full px-4 py-3 rounded-f-secondary bg-[rgba(18,22,35,0.6)] border border-ink/10 text-ink text-[0.9375rem] outline-none focus:border-gold transition-colors"
                  defaultValue=""
                >
                  {tiers.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="block text-[0.75rem] tracking-kicker uppercase text-mist-2 mb-2 font-semibold">
                What are you trying to build? <span className="text-flame">*</span>
              </span>
              <textarea
                required
                name="message"
                minLength={10}
                maxLength={4000}
                rows={6}
                className="w-full px-4 py-3 rounded-f-secondary bg-[rgba(18,22,35,0.6)] border border-ink/10 text-ink text-[0.9375rem] outline-none focus:border-gold transition-colors resize-y"
                placeholder="Tell us what situation you are in, what you want Faretta to help with, or what you need from Ryan."
              />
            </label>

            {state.status === "error" && (
              <div className="text-ember text-[0.875rem]">{state.message}</div>
            )}

            <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
              <p className="text-mist-2 text-[0.8125rem]">
                We do not sell your email. Ever.
              </p>
              <button
                type="submit"
                disabled={state.status === "submitting"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.status === "submitting" ? "Sending…" : "Send →"}
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="py-10 px-6 max-w-f-desktop mx-auto border-t border-ink/[0.08] flex flex-wrap items-center justify-between gap-4 text-mist-2 text-[0.8125rem]">
        <span>© Ryan Nichols</span>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-gold">Home</Link>
          <Link href="/pricing" className="hover:text-gold">Pricing</Link>
        </div>
      </footer>
    </>
  );
}
