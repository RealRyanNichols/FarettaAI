"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    model: "Claude Haiku 4.5",
    pitch: "A taste of the network. Enough to feel the voice.",
    includes: [
      "10 messages per day",
      "Public wisdom only",
      "All five products",
      "Web + mobile",
    ],
    excludes: [
      "Contributing to the brain",
      "Cross-product memory",
      "Skill invocations",
    ],
    cta: "Start free",
    ctaHref: "#get-started",
    emphasized: false,
  },
  {
    id: "core",
    name: "Core",
    price: "$19",
    cadence: "per month",
    model: "Claude Sonnet 4.6",
    pitch: "For operators running one of Ryan's products and getting serious.",
    includes: [
      "100 messages per day",
      "Core-tier wisdom from your product",
      "Contribute to the network",
      "Skill invocations (one-tap actions)",
      "4 hours of voice per day",
      "Faster model — less waiting",
    ],
    excludes: [
      "Cross-product memory",
      "Priority support",
    ],
    cta: "Go Core",
    ctaHref: "#get-started",
    emphasized: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$79",
    cadence: "per month",
    model: "Claude Opus 4.7",
    pitch: "For operators who want the whole network and the best model underneath.",
    includes: [
      "Unlimited messages",
      "Cross-product memory — the whole brain",
      "All Core features",
      "Adaptive deep thinking on hard questions",
      "Priority support from Ryan's team",
      "Early access to new products",
    ],
    excludes: [],
    cta: "Go Ultra",
    ctaHref: "#get-started",
    emphasized: false,
  },
];

const products = [
  {
    name: "The Nest",
    for: "Moms — any season, any story.",
    slug: "nest",
    lives: "A warm app for moms carrying everything. Pregnancy, postpartum, toddlers, teens.",
  },
  {
    name: "Lead Flow Pro",
    for: "Closers and solo agents.",
    slug: "lfp",
    lives: "Lead + pipeline tool. Pattern-breaker moves when a deal stalls.",
  },
  {
    name: "RepWatcher",
    for: "Local business owners.",
    slug: "repwatcher",
    lives: "Review monitoring + on-brand replies that never auto-post.",
  },
  {
    name: "Premier Dental Academy",
    for: "Dental practices.",
    slug: "pda",
    lives: "Training + operations. Business-first tool for clinicians.",
  },
  {
    name: "Faretta · Legal",
    for: "Operators without counsel.",
    slug: "faretta",
    lives: "Pro se drafting, jurisdiction-aware filings, deadline tracking. Cited authority, not vibes.",
  },
  {
    name: "realryannichols.com",
    for: "Founders evaluating Ryan.",
    slug: "rrn",
    lives: "Candid routing. No hype. Matches you to the right product.",
  },
];

const faqs = [
  {
    q: "Is this just ChatGPT in a jacket?",
    a: "No. Gideon runs on Claude today, but the model is commodity. What makes him Gideon is the shared memory layer — a network of real operators contributing tactics, stories, and scripts that get tagged, deduped, and served back with citation counts. The prompt, the memory, the voice, the UI — that's the product. The model underneath is swappable.",
  },
  {
    q: "What does \"evidence-tested\" actually mean?",
    a: "Every answer Gideon gives can be traced to memories in the network, tagged with how many operators have seen or tried them. When he cites [3], he means memory #3 in the injected context, which is a real contribution from a real user at a known tier. If he doesn't have evidence, he says so: \"Don't have data on this yet — here's what I'd try.\"",
  },
  {
    q: "Who owns my contributions?",
    a: "You do. When you contribute to the network, you license the content to Ryan Nichols's products for retrieval. You don't assign it. You can delete all your memories at any time from Settings. The model sees the content, not who said it — source user ids are stripped before retrieval.",
  },
  {
    q: "Why three tiers instead of one?",
    a: "Cost. Opus 4.7 is excellent and expensive; Haiku 4.5 is fast and cheap. The gradient matches the stakes — an operator running a dental practice on KPIs wants the deep model; a mom asking where to log groceries is fine on Haiku. Everyone gets the same Gideon. Only the thinking horsepower changes.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, at any time, from Settings. Paid tiers are billed monthly with no long-term commitment. If you cancel mid-cycle, you keep Core/Ultra access until the end of the period, then drop to Free.",
  },
  {
    q: "Is there a team plan?",
    a: "Not yet. If you're running a sales team on Lead Flow Pro or a practice on Premier Dental Academy and you want seat pricing, use the contact form and tell us the team size — we'll work it out.",
  },
];

export default function PricingPage() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 backdrop-blur-md bg-[linear-gradient(to_bottom,rgba(10,14,26,0.92),rgba(10,14,26,0.6)_70%,transparent)]">
        <Link
          href="/"
          className="flex items-center gap-[10px] font-display uppercase tracking-wordmark text-[0.875rem]"
        >
          <img src="/brand/logo.svg" alt="Gideon mark" className="w-7 h-7" />
          <span>Gideon</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/faretta-legal"
            className="hidden sm:inline-flex text-[0.8125rem] font-semibold text-mist hover:text-gold transition-colors"
          >
            Faretta · Legal
          </Link>
          <a
            href="#get-started"
            className="px-[18px] py-[9px] bg-gold text-night rounded-full text-[0.8125rem] font-semibold transition-transform duration-hover hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(212,168,85,0.3)]"
          >
            Get access
          </a>
        </div>
      </nav>

      <header className="relative pt-[140px] pb-20 px-6 max-w-g-desktop mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-[10px] text-[0.75rem] tracking-kicker uppercase text-gold font-semibold mb-6">
            <span
              className="w-[6px] h-[6px] rounded-full bg-flame shadow-[0_0_12px_#FF6B2C]"
              style={{ animation: "g-pulse 2.4s ease-in-out infinite" }}
            />
            <span>Pricing</span>
          </div>

          <h1 className="font-display font-display-weight leading-[0.98] tracking-[-0.03em] max-w-[900px] mb-6 text-[clamp(2.25rem,7vw,4.5rem)]">
            Pick how you meet
            <br />
            <span className="bg-g-wordmark bg-clip-text text-transparent">Gideon.</span>
          </h1>

          <p className="text-mist max-w-[640px] mb-4 leading-[1.5] text-[clamp(1.0625rem,2vw,1.25rem)]">
            Three tiers. Same Gideon in all of them — same voice, same evidence rule. What
            changes is how deep the model thinks and how much of the network you see.
          </p>
          <p className="text-mist-2 text-[0.875rem]">
            Cancel any time. Every tier works across The Nest, Lead Flow Pro, RepWatcher,
            Premier Dental Academy, Faretta · Legal, and realryannichols.com.
          </p>
        </motion.div>
      </header>

      <section className="pb-[100px] px-6 max-w-g-desktop mx-auto">
        <div className="grid grid-cols-3 gap-5 max-[880px]:grid-cols-1">
          {tiers.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={[
                "relative rounded-g-primary p-7 border",
                t.emphasized
                  ? "border-gold/60 bg-[linear-gradient(180deg,rgba(212,168,85,0.08),rgba(255,107,44,0.04))] shadow-[0_20px_60px_rgba(212,168,85,0.14)]"
                  : "border-ink/10 bg-[rgba(18,22,35,0.4)]",
              ].join(" ")}
            >
              {t.emphasized && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[0.6875rem] uppercase tracking-kicker font-semibold rounded-full bg-gold text-night">
                  Recommended
                </div>
              )}
              <div className="text-gold text-[0.75rem] tracking-kicker uppercase font-semibold mb-3">
                {t.model}
              </div>
              <h3 className="font-display font-display-weight text-[1.75rem] leading-none mb-2">
                {t.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display font-display-weight text-[2.5rem] leading-none">
                  {t.price}
                </span>
                <span className="text-mist-2 text-[0.875rem]">{t.cadence}</span>
              </div>
              <p className="text-mist text-[0.9375rem] leading-[1.5] mb-5 min-h-[3em]">
                {t.pitch}
              </p>
              <a
                href={t.ctaHref}
                className={[
                  "inline-flex items-center justify-center w-full px-5 py-3 rounded-full text-[0.9375rem] font-semibold mb-5 transition-transform duration-hover hover:-translate-y-[1px]",
                  t.emphasized
                    ? "bg-gold text-night shadow-[0_10px_30px_rgba(212,168,85,0.3)]"
                    : "border border-ink/20 text-ink hover:border-gold hover:text-gold",
                ].join(" ")}
              >
                {t.cta}
              </a>
              <ul className="space-y-2 text-[0.9375rem] leading-[1.4] mb-4">
                {t.includes.map((line) => (
                  <li key={line} className="flex gap-2 text-ink">
                    <span aria-hidden className="text-flame mt-[2px]">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {t.excludes.length > 0 && (
                <ul className="space-y-2 text-[0.875rem] leading-[1.4]">
                  {t.excludes.map((line) => (
                    <li key={line} className="flex gap-2 text-mist-2 line-through">
                      <span aria-hidden>–</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-[80px] px-6 max-w-g-desktop mx-auto border-t border-ink/[0.08]">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          Where Gideon lives
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-10 text-[clamp(1.75rem,4vw,2.75rem)]">
          One subscription. Six products. Same Gideon.
        </h2>
        <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
          {products.map((p) => (
            <div
              key={p.slug}
              className="rounded-g-secondary border border-ink/10 p-5 bg-[rgba(18,22,35,0.3)]"
            >
              <div className="flex items-start justify-between mb-2 gap-4">
                <h3 className="font-display font-display-weight text-[1.25rem] leading-tight">
                  {p.name}
                </h3>
                <span className="text-[0.6875rem] uppercase tracking-kicker text-gold font-semibold mt-1 whitespace-nowrap">
                  {p.for}
                </span>
              </div>
              <p className="text-mist text-[0.9375rem] leading-[1.5]">{p.lives}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-[80px] px-6 max-w-g-desktop mx-auto border-t border-ink/[0.08]">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          The story underneath
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-5 text-[clamp(1.75rem,4vw,2.75rem)]">
          Torches hidden in clay jars.
        </h2>
        <p className="text-mist text-[1.0625rem] max-w-[640px] leading-[1.6] mb-4">
          The first Gideon reduced his force from thirty-two thousand to three hundred,
          then struck at midnight with torches concealed in jars — so the noise of
          breaking clay and the sudden light together routed an army of a hundred and
          thirty-five thousand.
        </p>
        <p className="text-mist text-[1.0625rem] max-w-[640px] leading-[1.6]">
          This Gideon runs on the same principles: test the signal (every answer cites
          the network), keep the force small (short, direct, no hedging), and light the
          jar at exactly the moment it matters.
        </p>
      </section>

      <section id="faq" className="py-[80px] px-6 max-w-g-desktop mx-auto border-t border-ink/[0.08]">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          Straight answers
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-10 text-[clamp(1.75rem,4vw,2.75rem)]">
          What operators keep asking.
        </h2>
        <div className="space-y-4 max-w-[760px]">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-g-secondary border border-ink/10 bg-[rgba(18,22,35,0.3)] p-5 open:border-gold/40 transition-colors"
            >
              <summary className="cursor-pointer font-display-weight text-[1.0625rem] leading-snug list-none flex items-start justify-between gap-3">
                <span>{f.q}</span>
                <span aria-hidden className="text-gold mt-[2px]">+</span>
              </summary>
              <p className="mt-3 text-mist text-[0.9375rem] leading-[1.6]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        id="get-started"
        className="py-[100px] px-6 max-w-g-desktop mx-auto text-center border-t border-ink/[0.08]"
      >
        <h2 className="font-display font-display-weight leading-[1.02] tracking-[-0.02em] mb-6 text-[clamp(2rem,5vw,3.5rem)]">
          Break the jar.
        </h2>
        <p className="text-mist text-[1.0625rem] max-w-[560px] mx-auto mb-10 leading-[1.6]">
          Request access. We'll send you into whichever product matches your
          situation — or let you know if we're not ready for you yet.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(212,168,85,0.35)]"
          >
            Request access →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full border-[1.5px] border-ink/20 text-ink text-[0.9375rem] font-semibold transition-all duration-hover hover:border-gold hover:text-gold"
          >
            Back to the story
          </Link>
        </div>
      </section>

      <footer className="py-10 px-6 max-w-g-desktop mx-auto border-t border-ink/[0.08] flex flex-wrap items-center justify-between gap-4 text-mist-2 text-[0.8125rem]">
        <span>© Ryan Nichols</span>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-gold">Home</Link>
          <Link href="/faretta-legal" className="hover:text-gold">Faretta · Legal</Link>
          <Link href="/contact" className="hover:text-gold">Contact</Link>
        </div>
      </footer>
    </>
  );
}
