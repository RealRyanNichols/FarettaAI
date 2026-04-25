"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";
import { getBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const sb = getBrowserClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Check your inbox for a magic link.");
  }

  return (
    <>
      <SiteNav />
      <main className="pt-[88px] pb-20 px-6 max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>Members</span>
        </div>
        <h1 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-3 text-[clamp(1.875rem,4vw,2.5rem)]">
          Sign in or sign up.
        </h1>
        <p className="text-ink-2 text-[0.9375rem] leading-[1.6] mb-8">
          Magic link only. Open signup. We email you a one-time link, you click it, and you're in.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="px-4 py-3 rounded-f-secondary bg-paper border border-ink/15 text-ink outline-none focus:border-liberty transition-colors"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-5 py-3 rounded-full bg-liberty text-paper font-semibold shadow-f-cta hover:bg-liberty-deep disabled:opacity-50 transition-colors"
          >
            {status === "sending" ? "Sending…" : "Send magic link"}
          </button>
          {message ? (
            <p className={status === "error" ? "text-objection text-[0.875rem]" : "text-verdict text-[0.875rem]"}>
              {message}
            </p>
          ) : null}
        </form>

        <p className="mt-8 text-mute text-[0.8125rem]">
          New here? You'll create your account automatically when you click the link.{" "}
          <Link href="/privacy" className="text-liberty hover:underline">Privacy</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
