"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";

type Cadence = "monthly" | "yearly";

type Tier = {
  id: string;
  name: string;
  blurb: string;
  monthly: number;
  yearly: number;
  yearlyNote: string;
  model: string;
  cta: string;
  ctaHref: string;
  emphasized: boolean;
  includes: string[];
  excludes: string[];
};

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    blurb: "Open the page, start typing. No card, no signup, no excuses.",
    monthly: 0,
    yearly: 0,
    yearlyNote: "Always free",
    model: "Claude Haiku 4.5",
    cta: "Start chatting",
    ctaHref: "/",
    emphasized: false,
    includes: [
      "Unlimited starter conversations",
      "Case-law citations in plain English",
      "Crisis filter + hotline routing",
      "Voice input (click-to-talk)",
      "Share buttons everywhere",
    ],
    excludes: [
      "Saved conversation history",
      "Attorney-routing intros",
      "API access",
    ],
  },
  {
    id: "pro",
    name: "Patriot",
    blurb: "Most people who actually have a matter need this. Affordable on purpose.",
    monthly: 5,
    yearly: 50,
    yearlyNote: "$50/yr · save $10",
    model: "Claude Sonnet 4.6",
    cta: "Go Patriot",
    ctaHref: "/contact?tier=pro",
    emphasized: true,
    includes: [
      "Everything in Free",
      "Saved chat history across devices",
      "Smarter model — less hedging",
      "Attorney-routing intros (no charge)",
      "Document timeline + witness organizer",
      "Email support",
    ],
    excludes: [
      "API access",
      "Forensics document analysis",
    ],
  },
  {
    id: "liberty",
    name: "Liberty",
    blurb: "For people in deep — long-running matters, multiple cases, or partner sites.",
    monthly: 20,
    yearly: 200,
    yearlyNote: "$200/yr · save $40",
    model: "Claude Opus 4.7",
    cta: "Go Liberty",
    ctaHref: "/contact?tier=liberty",
    emphasized: false,
    includes: [
      "Everything in Patriot",
      "Deepest model — Opus 4.7",
      "API access (embed Faretta on your site)",
      "Forensics document analysis (preview)",
      "Priority attorney routing",
      "Direct line to Ryan's team",
    ],
    excludes: [],
  },
];

const FAQS = [
  {
    q: "Is Faretta a law firm?",
    a: "No. Faretta AI is not a law firm and does not provide legal advice. We provide legal information — the law as it is written and as it has been decided — in plain English. For advice on your specific case, talk to a licensed attorney in your jurisdiction. We will help you find one.",
  },
  {
    q: "Does Faretta replace a lawyer?",
    a: "No, and we won't pretend otherwise. Self-representation is your right under Faretta v. California, 422 U.S. 806 (1975) — but a licensed attorney who knows your jurisdiction is almost always better than going it alone. Faretta is for the moments before, during, and around that conversation: when you can't afford one, can't reach one, or need to understand what one will tell you.",
  },
  {
    q: "Why so cheap?",
    a: "Because justice should not be priced like a luxury good. The product is expensive to run — top-tier AI models cost real money — but we built it cheap so the people who need it most can use it. Free is real and forever. Patriot at $5/mo is the price of a coffee.",
  },
  {
    q: "What does API access actually do?",
    a: "If you run a site and your visitors have legal questions, you can embed the Faretta chat widget with one script tag. Your visitors talk to Faretta; the conversation goes into your account; you keep the relationship. Liberty tier includes API access; Patriot tier does not.",
  },
  {
    q: "What happens to my conversations?",
    a: "Your chat helps the brain get smarter for the next person. Substantive content is used to improve responses. Your name, email, and direct contact info are stored separately and are not used for training. You can delete everything from Settings at any time. We do not sell your individual conversations or PII.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, anytime, from Settings. Paid tiers are billed monthly or annually with no long-term commitment. If you cancel mid-cycle, you keep your tier through the end of the period and then drop to Free.",
  },
  {
    q: "Crisis lines?",
    a: "If a chat surfaces immediate danger — suicidal ideation, domestic violence, harm to a child — Faretta stops and surfaces 988 (Suicide & Crisis Lifeline), 1-800-799-7233 (Domestic Violence Hotline), or 1-800-422-4453 (Childhelp). Always free, always available, even on Free tier.",
  },
];

export default function PricingPage() {
  const [cadence, setCadence] = useState<Cadence>("monthly");

  return (
    <>
      <SiteNav />

      <main className="pt-[88px]">
        {/* Hero */}
        <section className="px-6 py-14 md:py-20">
          <div className="max-w-f-content mx-auto">
            <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-flag" />
              <span>Pricing</span>
            </div>
            <h1 className="font-sans font-extrabold leading-[1.02] tracking-display text-ink mb-5 text-[clamp(2.25rem,6vw,4rem)]">
              Affordable, on purpose.
            </h1>
            <p className="text-ink-2 text-[1.125rem] leading-[1.6] max-w-[640px] mb-8">
              Free does the job for most people. Five dollars a month gets you a sharper model, your
              chat history, and an intro to a real attorney. Twenty dollars opens the API and the
              deepest model. Cancel any time.
            </p>

            {/* Cadence toggle */}
            <div className="inline-flex rounded-full border border-ink/15 bg-paper p-1">
              <button
                onClick={() => setCadence("monthly")}
                className={`px-4 py-1.5 rounded-full text-[0.8125rem] font-semibold transition-colors ${
                  cadence === "monthly" ? "bg-liberty text-paper" : "text-ink-2 hover:text-liberty"
                }`}
                type="button"
              >
                Monthly
              </button>
              <button
                onClick={() => setCadence("yearly")}
                className={`px-4 py-1.5 rounded-full text-[0.8125rem] font-semibold transition-colors ${
                  cadence === "yearly" ? "bg-liberty text-paper" : "text-ink-2 hover:text-liberty"
                }`}
                type="button"
              >
                Yearly · save up to 17%
              </button>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="px-6 pb-16 md:pb-24">
          <div className="max-w-f-content mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t) => {
              const price = cadence === "monthly" ? t.monthly : Math.round(t.yearly / 12);
              const note = cadence === "monthly"
                ? t.id === "free" ? "Always free" : "/mo · billed monthly"
                : t.yearlyNote;
              return (
                <div
                  key={t.id}
                  className={[
                    "relative rounded-f-primary p-7 border bg-paper",
                    t.emphasized
                      ? "border-liberty shadow-f-cta"
                      : "border-ink/10 hover:border-liberty/40 hover:shadow-f-card transition-all",
                  ].join(" ")}
                >
                  {t.emphasized && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[0.6875rem] uppercase tracking-kicker font-bold rounded-full bg-flag text-paper">
                      Most popular
                    </div>
                  )}
                  <div className="text-liberty text-[0.6875rem] uppercase tracking-kicker font-semibold mb-2">{t.model}</div>
                  <h3 className="font-sans font-extrabold text-[1.75rem] text-ink leading-none mb-2">{t.name}</h3>
                  <p className="text-ink-2 text-[0.9375rem] leading-[1.5] mb-5 min-h-[3em]">{t.blurb}</p>

                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="font-sans font-extrabold text-[2.75rem] leading-none text-ink">
                      {t.monthly === 0 ? "Free" : `$${price}`}
                    </span>
                    <span className="text-mute text-[0.8125rem]">{t.monthly === 0 ? "" : note}</span>
                  </div>

                  <Link
                    href={t.ctaHref}
                    className={[
                      "inline-flex items-center justify-center w-full px-5 py-3 rounded-full text-[0.9375rem] font-semibold mb-6 transition-all duration-hover hover:-translate-y-[1px]",
                      t.emphasized
                        ? "bg-flag text-paper shadow-f-cta hover:bg-flag-deep"
                        : "border border-ink/20 text-ink hover:border-liberty hover:text-liberty",
                    ].join(" ")}
                  >
                    {t.cta}
                  </Link>

                  <ul className="space-y-2 text-[0.9375rem] leading-[1.4] mb-3">
                    {t.includes.map((line) => (
                      <li key={line} className="flex gap-2 text-ink-2">
                        <span aria-hidden className="text-verdict mt-[2px]">✓</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {t.excludes.length > 0 && (
                    <ul className="space-y-2 text-[0.875rem] leading-[1.4]">
                      {t.excludes.map((line) => (
                        <li key={line} className="flex gap-2 text-mute">
                          <span aria-hidden>—</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16 md:py-20 bg-paper border-y border-ink/[0.08]">
          <div className="max-w-f-prose mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">Straight answers</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-8 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              What people keep asking.
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="rounded-f-card border border-ink/10 bg-parchment p-5 open:border-liberty/40 transition-colors"
                >
                  <summary className="cursor-pointer font-bold text-[1rem] text-ink list-none flex items-start justify-between gap-3">
                    <span>{f.q}</span>
                    <span aria-hidden className="text-liberty">+</span>
                  </summary>
                  <p className="mt-3 text-ink-2 text-[0.9375rem] leading-[1.6]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 py-20 md:py-24">
          <div className="max-w-f-prose mx-auto text-center">
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.875rem,4.5vw,3rem)]">
              Free is real. Start there.
            </h2>
            <p className="text-ink-2 text-[1rem] leading-[1.6] max-w-[520px] mx-auto mb-8">
              No card, no signup, no friction. Open the chat and ask. Upgrade only if you need to.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover hover:bg-liberty-deep"
              >
                Open the chat →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-ink/20 text-ink text-[0.9375rem] font-semibold hover:border-liberty hover:text-liberty transition-colors"
              >
                Talk to a person
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
