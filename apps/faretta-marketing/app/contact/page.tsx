"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "ok" }
  | { status: "error"; message: string };

const TOPICS = [
  { value: "", label: "What are you here about?" },
  { value: "pro-se", label: "I'm representing myself" },
  { value: "family", label: "A family member needs help" },
  { value: "attorney", label: "I'm an attorney — partner with you" },
  { value: "embed", label: "I want to embed Faretta on my site" },
  { value: "press", label: "Press / interview" },
  { value: "witness", label: "I have an anonymous tip" },
  { value: "other", label: "Something else" },
];

const TIERS = [
  { value: "", label: "Tier (optional)" },
  { value: "free", label: "Free" },
  { value: "pro", label: "Patriot ($5/mo)" },
  { value: "liberty", label: "Liberty ($20/mo)" },
];

export default function ContactPage() {
  const [state, setState] = useState<State>({ status: "idle" });

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
      <SiteNav />

      <main className="pt-[88px] pb-20 px-6 max-w-[760px] mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>Contact</span>
        </div>

        <h1 className="font-sans font-extrabold leading-[1.02] tracking-display text-ink mb-5 text-[clamp(2rem,6vw,3.5rem)]">
          Tell us what you're up against.
        </h1>

        <p className="text-ink-2 text-[1.0625rem] leading-[1.6] max-w-[600px] mb-10">
          We read every message. If you have a clear matter, we'll route you to a licensed attorney
          for the intro. If you're a partner, press, or want to embed Faretta on your site — we'll
          come back to you from a real inbox, usually within a couple of business days.
        </p>

        {state.status === "ok" ? (
          <div className="rounded-f-primary border border-verdict/40 bg-[linear-gradient(180deg,rgba(16,185,129,0.06),rgba(59,130,246,0.04))] p-8">
            <h2 className="font-sans font-extrabold text-[1.5rem] text-ink leading-tight mb-3">
              Got it.
            </h2>
            <p className="text-ink-2 text-[1rem] leading-[1.6] mb-6">
              Your message is in the queue. We'll come back to you from a real inbox.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover"
              >
                Back to the chat
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ink/20 text-ink text-[0.9375rem] font-semibold hover:border-liberty hover:text-liberty transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
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
                <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute mb-2 font-semibold">
                  Your name
                </span>
                <input
                  required
                  name="name"
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors"
                  placeholder="First and last"
                />
              </label>
              <label className="block">
                <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute mb-2 font-semibold">
                  Email
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute mb-2 font-semibold">
                State / jurisdiction <span className="text-mute normal-case tracking-normal">(optional but helpful)</span>
              </span>
              <input
                name="jurisdiction"
                maxLength={80}
                className="w-full px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors"
                placeholder="e.g. Texas, California, federal court"
              />
            </label>

            <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
              <label className="block">
                <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute mb-2 font-semibold">
                  About
                </span>
                <select
                  name="topic"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors"
                >
                  {TOPICS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute mb-2 font-semibold">
                  Tier
                </span>
                <select
                  name="tier"
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors"
                >
                  {TIERS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="block text-[0.6875rem] tracking-kicker uppercase text-mute mb-2 font-semibold">
                What's going on? <span className="text-flag">*</span>
              </span>
              <textarea
                required
                name="message"
                minLength={10}
                maxLength={4000}
                rows={6}
                className="w-full px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink text-[0.9375rem] outline-none focus:border-liberty transition-colors resize-y"
                placeholder="Tell us what you're up against. The more specific, the better we can help."
              />
            </label>

            {state.status === "error" && (
              <div className="text-objection text-[0.875rem]">{state.message}</div>
            )}

            <div className="flex items-center justify-between pt-2 gap-3 flex-wrap">
              <p className="text-mute text-[0.75rem] max-w-[360px] leading-[1.45]">
                We do not sell your email. Faretta AI is not a law firm; submitting this form does
                not create an attorney-client relationship.
              </p>
              <button
                type="submit"
                disabled={state.status === "submitting"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover hover:bg-liberty-deep disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.status === "submitting" ? "Sending…" : "Send →"}
              </button>
            </div>
          </form>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
