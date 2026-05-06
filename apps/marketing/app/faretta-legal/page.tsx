"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const pillars = [
  {
    n: "01",
    h: "Cites the rule, names the case",
    p: "Every legal claim Faretta makes is anchored to a real authority — a statute, a rule, an opinion. Pin-cited. If the authority does not exist, Faretta does not invent one. He says so and stops.",
  },
  {
    n: "02",
    h: "Drafts in your jurisdiction",
    p: "Tell Faretta the court and he writes to its rules. Federal pleadings cite the FRCP. State filings name the state. Local rules surface before you file. No generic boilerplate that gets you bounced at the clerk's window.",
  },
  {
    n: "03",
    h: "Counts your deadlines",
    p: "Statutes of limitations. Response windows. Discovery cutoffs. Appeal clocks. Faretta runs the calendar from the moment a case opens and tells you what is due, when, and what filing answers it.",
  },
];

const useCases = [
  {
    label: "Pro se civil litigant",
    body: "You were sued, or you have to sue, and you cannot afford counsel. Faretta drafts your answer, runs the discovery clock, and turns opposing counsel's motion into a response that names the standard.",
  },
  {
    label: "Small business owner",
    body: "Vendor breach. Lease dispute. A demand letter on the desk. Faretta reads the contract, finds the operative clause, and drafts the letter that goes back — with the cause of action named, not implied.",
  },
  {
    label: "Tenant or landlord",
    body: "Rent statutes are local and unforgiving. Faretta knows the notice periods in your jurisdiction, the cure-or-quit windows, and what a habitability claim actually requires to survive a motion to dismiss.",
  },
  {
    label: "Founder reading a term sheet",
    body: "SAFE versus convertible. Pro rata. Drag-along. Faretta translates the clause, names what is market, and flags what would cost you the company in three years if you sign as written.",
  },
  {
    label: "Worker filing a claim",
    body: "Unemployment appeal. EEOC charge. Wage-and-hour. Faretta knows what the agency wants on the form and what doctrine applies to your facts. He will not promise an outcome. He will prepare the filing.",
  },
  {
    label: "Anyone with a court date",
    body: "If you have to appear and you do not have a lawyer, Faretta builds the binder: the rule cited, the facts ordered, the questions for the witness, the relief requested in plain language.",
  },
];

const refusals = [
  {
    h: "Faretta is not your lawyer.",
    p: "He does not form an attorney-client relationship. Nothing he produces is privileged. If your matter has stakes you cannot afford to lose, hire counsel — Faretta will help you find one.",
  },
  {
    h: "Faretta will not predict outcomes.",
    p: "He tells you what the rule says, what cases on point have held, and where your facts sit. He will not tell you that you will win. No honest lawyer would.",
  },
  {
    h: "Faretta refuses criminal defense work.",
    p: "If the state is prosecuting you, you have a Sixth Amendment right to counsel under Gideon v. Wainwright. Demand it. Faretta will help you draft the request and find the public defender's office.",
  },
  {
    h: "Faretta will not invent authority.",
    p: "If a case or statute does not exist, he says so. He will not paper a brief with hallucinated citations. The network has seen what that costs and refuses to repeat it.",
  },
];

const tierDeltas = [
  {
    tier: "Free",
    sub: "Claude Haiku 4.5",
    line: "10 messages/day. Definitions, rule lookups, statute summaries. No drafted filings. Faretta will tell you what a motion to dismiss is. He will not write yours.",
  },
  {
    tier: "Core",
    sub: "Claude Sonnet 4.6",
    line: "Jurisdiction-aware drafts. Deadline calendar. Pleading templates the network has used and refined. The everyday tier for an operator running their own matter.",
    emphasized: true,
  },
  {
    tier: "Ultra",
    sub: "Claude Opus 4.7",
    line: "Cross-jurisdictional research. Multi-document drafting (complaint plus exhibits plus proposed order). Adaptive deep thinking on hard issues. The tier for the matter you cannot afford to mishandle.",
  },
];

export default function FarettaLegalPage() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 backdrop-blur-md bg-[linear-gradient(to_bottom,rgba(10,14,26,0.92),rgba(10,14,26,0.6)_70%,transparent)]">
        <Link
          href="/"
          className="flex items-center gap-[10px] font-display uppercase tracking-wordmark text-[0.875rem]"
        >
          <img src="/brand/logo.svg" alt="Gideon mark" className="w-7 h-7" />
          <span>Gideon</span>
          <span aria-hidden className="text-mist-2">·</span>
          <span className="text-gold">Faretta</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="hidden sm:inline-flex text-[0.8125rem] font-semibold text-mist hover:text-gold transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="px-[18px] py-[9px] bg-gold text-night rounded-full text-[0.8125rem] font-semibold transition-transform duration-hover hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(212,168,85,0.3)]"
          >
            Request access
          </Link>
        </div>
      </nav>

      <header className="relative min-h-[100svh] flex flex-col justify-center pt-[140px] pb-24 px-6 max-w-g-desktop mx-auto">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(700px 460px at 18% 28%, rgba(212,168,85,0.10), transparent 60%), radial-gradient(900px 540px at 88% 14%, rgba(255,107,44,0.06), transparent 60%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-[10px] text-[0.75rem] tracking-kicker uppercase text-gold font-semibold mb-6">
            <span
              className="w-[6px] h-[6px] rounded-full bg-flame shadow-[0_0_12px_#FF6B2C]"
              style={{ animation: "g-pulse 2.4s ease-in-out infinite" }}
            />
            <span>Faretta · the legal overlay for Gideon</span>
          </div>

          <h1 className="font-display font-display-weight leading-[0.96] tracking-[-0.03em] max-w-[960px] mb-7 text-[clamp(2.5rem,8vw,5.5rem)]">
            Represent yourself.
            <br />
            <span className="bg-g-wordmark bg-clip-text text-transparent">With receipts.</span>
          </h1>

          <p className="text-mist max-w-[680px] mb-6 leading-[1.55] text-[clamp(1.0625rem,2vw,1.3125rem)]">
            Faretta is Gideon&apos;s legal mode. Built for the operator without
            counsel — the pro se litigant, the founder reading the term sheet,
            the small business owner staring down a demand letter. Every claim
            cites the rule. Every draft names the jurisdiction. Every deadline
            counts down on its own clock.
          </p>

          <p className="text-mist-2 max-w-[680px] mb-10 leading-[1.6] text-[0.9375rem]">
            Named for{" "}
            <em className="text-ink not-italic font-semibold">
              Faretta v. California
            </em>
            , 422 U.S. 806 (1975) — the Supreme Court case that recognized your
            Sixth Amendment right to be your own lawyer when you choose. Gideon
            is named for the case that gave you the right to counsel.{" "}
            <em className="text-ink not-italic font-semibold">
              Faretta gave you the right to do it yourself.
            </em>
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-[14px] rounded-full border-[1.5px] border-transparent bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(212,168,85,0.35)]"
            >
              Request access →
            </Link>
            <a
              href="#sample"
              className="inline-flex items-center gap-2 px-6 py-[14px] rounded-full border-[1.5px] border-ink/20 text-ink text-[0.9375rem] font-semibold transition-all duration-hover hover:border-gold hover:text-gold"
            >
              See a sample memo
            </a>
          </div>
        </motion.div>
      </header>

      <div className="border-t border-b border-ink/[0.08] max-w-g-desktop mx-auto py-7 px-6 flex flex-wrap justify-center gap-x-12 gap-y-6 text-mist-2 text-[0.8125rem] tracking-[0.05em] uppercase">
        <span>Cited authority, not vibes</span>
        <span>•</span>
        <span>Jurisdiction-aware drafting</span>
        <span>•</span>
        <span>Refuses to invent caselaw</span>
      </div>

      <section className="py-[110px] px-6 max-w-g-desktop mx-auto max-[720px]:py-[72px] max-[720px]:px-5">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          What Faretta does
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[820px] mb-5 text-[clamp(1.875rem,4.5vw,3rem)]">
          A legal AI that acts like a senior associate, not a search engine with manners.
        </h2>
        <p className="text-mist text-[1.0625rem] max-w-[680px] leading-[1.6]">
          The basic legal chatbot summarizes a Wikipedia article and tells you to
          consult an attorney. Faretta does the work an attorney would have
          billed you four hours for — then tells you what is left for you to
          decide.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-14 max-[880px]:grid-cols-1 max-[880px]:gap-4">
          {pillars.map((f) => (
            <motion.div
              key={f.n}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="p-7 bg-midnight border border-ink/[0.06] rounded-g-primary hover:border-gold/25"
            >
              <div className="w-10 h-10 rounded-[12px] bg-g-flame grid place-items-center text-night font-display mb-5">
                {f.n}
              </div>
              <h3 className="text-[1.125rem] font-semibold mb-2 tracking-[-0.01em]">{f.h}</h3>
              <p className="text-mist text-[0.9375rem] leading-[1.55]">{f.p}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="sample"
        className="border-t border-b border-ink/[0.06] px-6 py-[110px]"
        style={{ background: "linear-gradient(180deg, #0A0E1A 0%, #131826 100%)" }}
      >
        <div className="max-w-g-desktop mx-auto">
          <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
            How an answer looks
          </span>
          <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[820px] mb-10 text-[clamp(1.75rem,4vw,2.75rem)]">
            A memo, not a monologue.
          </h2>

          <div className="grid grid-cols-[1fr_1.2fr] gap-8 max-[960px]:grid-cols-1">
            <div className="rounded-g-secondary border border-ink/10 bg-[rgba(18,22,35,0.55)] p-6">
              <div className="text-[0.6875rem] uppercase tracking-kicker text-gold font-semibold mb-3">
                Question from operator
              </div>
              <p className="font-serif text-ink leading-[1.5] text-[1.0625rem]">
                &ldquo;My landlord served me a 3-day notice to pay or quit on
                Monday. I paid the back rent on Wednesday. He filed for eviction
                anyway. California, Los Angeles County. What do I file?&rdquo;
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="px-2.5 py-1 rounded-full bg-night/60 border border-ink/10 text-mist text-[0.75rem]">
                  Tenant defense
                </span>
                <span className="px-2.5 py-1 rounded-full bg-night/60 border border-ink/10 text-mist text-[0.75rem]">
                  CA · LA County
                </span>
                <span className="px-2.5 py-1 rounded-full bg-night/60 border border-ink/10 text-mist text-[0.75rem]">
                  Time-sensitive
                </span>
              </div>
            </div>

            <div className="rounded-g-secondary border border-gold/30 bg-[linear-gradient(180deg,rgba(212,168,85,0.06),rgba(255,107,44,0.02))] p-6 shadow-[0_20px_60px_rgba(212,168,85,0.08)]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[0.6875rem] uppercase tracking-kicker text-gold font-semibold">
                  Faretta · draft memo
                </div>
                <div className="text-[0.6875rem] text-mist-2 font-mono">
                  v.1 · 4 citations
                </div>
              </div>
              <p className="text-ink leading-[1.6] text-[0.9375rem] mb-4">
                File an{" "}
                <strong className="text-gold">
                  Answer to Unlawful Detainer (Form UD-105)
                </strong>{" "}
                within five days of being served the Summons. You have an
                affirmative defense: payment within the cure period.
              </p>
              <ol className="space-y-3 text-mist text-[0.9375rem] leading-[1.55] list-decimal pl-5 mb-5">
                <li>
                  The 3-day notice under{" "}
                  <span className="text-ink">CCP § 1161(2)</span> is a cure-or-quit
                  notice. Payment within those three days defeats the unlawful
                  detainer.<sup className="text-gold">[1]</sup>
                </li>
                <li>
                  You paid Wednesday. Notice served Monday counts day one as
                  Tuesday — you cured on day two. Within the window.
                  <sup className="text-gold">[2]</sup>
                </li>
                <li>
                  Plead the cure as an affirmative defense on UD-105 §3 and
                  attach proof of payment as Exhibit A.
                  <sup className="text-gold">[3]</sup>
                </li>
                <li>
                  Demand jury trial in §4d if you want one. LA County Superior
                  Court fee waiver: Form FW-001 if you qualify.
                  <sup className="text-gold">[4]</sup>
                </li>
              </ol>
              <div className="border-t border-ink/10 pt-4 space-y-1.5 text-[0.75rem] text-mist-2 font-mono leading-[1.45]">
                <div>
                  [1] Cal. Code Civ. Proc. § 1161(2) — three-day notice; cure
                  by payment defeats UD.
                </div>
                <div>
                  [2] Cal. Code Civ. Proc. § 12 — day of service excluded from
                  computation.
                </div>
                <div>
                  [3] Judicial Council Form UD-105, §3(j) — defense: tender of
                  payment.
                </div>
                <div>
                  [4] L.A. Super. Ct. Local Rule 3.4 — jury demand procedure.
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[0.75rem] text-mist-2">
                  Deadlines added to your calendar
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-flame/15 border border-flame/30 text-flame text-[0.75rem] font-semibold">
                    Answer due in 5 days
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-warn/10 border border-warn/30 text-warn text-[0.75rem] font-semibold">
                    Trial set within 20 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-mist-2 text-[0.8125rem] mt-6 max-w-[820px] leading-[1.55]">
            Sample for illustration. Faretta will not file for you, will not
            appear for you, and will not promise this defense wins your case.
            He will, however, hand you a memo a paralegal would have spent
            ninety minutes on, with every citation pinned to its source.
          </p>
        </div>
      </section>

      <section className="py-[110px] px-6 max-w-g-desktop mx-auto">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          Who Faretta is for
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[820px] mb-12 text-[clamp(1.75rem,4vw,2.75rem)]">
          The work that used to mean an attorney you could not afford or a Google
          search you could not trust.
        </h2>

        <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
          {useCases.map((u) => (
            <motion.div
              key={u.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="rounded-g-secondary border border-ink/10 p-5 bg-[rgba(18,22,35,0.4)] hover:border-gold/30"
            >
              <div className="text-[0.6875rem] uppercase tracking-kicker text-gold font-semibold mb-2">
                {u.label}
              </div>
              <p className="text-mist text-[0.9375rem] leading-[1.55]">{u.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        className="border-t border-b border-ink/[0.06] px-6 py-[110px]"
        style={{ background: "linear-gradient(180deg, #0A0E1A 0%, #131826 100%)" }}
      >
        <div className="max-w-[860px] mx-auto">
          <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
            What Faretta refuses
          </span>
          <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] mb-5 text-[clamp(1.75rem,4vw,2.75rem)]">
            The four lines Faretta will not cross.
          </h2>
          <p className="text-mist text-[1.0625rem] leading-[1.6] mb-12 max-w-[680px]">
            A legal AI that promises everything is the one that will burn you.
            Faretta names what he will not do up front, so the work he does do
            is trustworthy.
          </p>

          <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
            {refusals.map((r) => (
              <div
                key={r.h}
                className="rounded-g-secondary border border-warn/25 bg-[rgba(245,199,122,0.04)] p-5"
              >
                <h3 className="text-ink font-semibold text-[1rem] mb-2 tracking-[-0.01em]">
                  {r.h}
                </h3>
                <p className="text-mist text-[0.9375rem] leading-[1.55]">{r.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[110px] px-6 max-w-g-desktop mx-auto">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          The story underneath
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[820px] mb-6 text-[clamp(1.75rem,4vw,2.75rem)]">
          Two cases. Two halves of the same right.
        </h2>

        <div className="grid grid-cols-2 gap-6 max-[720px]:grid-cols-1">
          <div className="rounded-g-primary border border-ink/10 p-7 bg-[rgba(18,22,35,0.4)]">
            <div className="text-[0.6875rem] uppercase tracking-kicker text-gold font-semibold mb-3">
              Gideon v. Wainwright · 1963
            </div>
            <h3 className="font-display font-display-weight text-[1.5rem] leading-tight mb-3">
              The right to counsel.
            </h3>
            <blockquote className="font-serif my-4 pl-4 border-l-2 border-gold text-ink leading-[1.4] text-[1.0625rem]">
              &ldquo;The right of one charged with crime to counsel may not be
              deemed fundamental and essential to fair trials in some
              countries, but it is in ours.&rdquo;
              <cite className="block mt-2 text-mist-2 text-[0.75rem] tracking-[0.1em] uppercase not-italic font-sans">
                372 U.S. 335, 344
              </cite>
            </blockquote>
            <p className="text-mist text-[0.9375rem] leading-[1.55]">
              Clarence Earl Gideon wrote his appeal on prison stationery. The
              Court agreed unanimously. That case named our umbrella product.
            </p>
          </div>

          <div className="rounded-g-primary border border-gold/30 p-7 bg-[linear-gradient(180deg,rgba(212,168,85,0.06),rgba(255,107,44,0.02))]">
            <div className="text-[0.6875rem] uppercase tracking-kicker text-gold font-semibold mb-3">
              Faretta v. California · 1975
            </div>
            <h3 className="font-display font-display-weight text-[1.5rem] leading-tight mb-3">
              The right to refuse it.
            </h3>
            <blockquote className="font-serif my-4 pl-4 border-l-2 border-gold text-ink leading-[1.4] text-[1.0625rem]">
              &ldquo;The right to defend is personal. The defendant, and not
              his lawyer or the State, will bear the personal consequences of
              a conviction.&rdquo;
              <cite className="block mt-2 text-mist-2 text-[0.75rem] tracking-[0.1em] uppercase not-italic font-sans">
                422 U.S. 806, 834
              </cite>
            </blockquote>
            <p className="text-mist text-[0.9375rem] leading-[1.55]">
              Anthony Faretta wanted to defend himself. The Court said he
              could. That case named this product, because the operator who
              chooses to do it themselves still deserves the tools.
            </p>
          </div>
        </div>

        <p className="text-mist text-[1.0625rem] max-w-[680px] leading-[1.6] mt-10">
          One subscription. Same Gideon underneath. When you switch into
          Faretta mode, the voice stays — direct, evidence-first, no hedging —
          and the domain shifts. Statutes instead of scriptures. Pin-cites
          instead of testimonials. Every sentence still has to earn its place.
        </p>
      </section>

      <section className="border-t border-ink/[0.06] py-[110px] px-6 max-w-g-desktop mx-auto">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          Pricing
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[820px] mb-10 text-[clamp(1.75rem,4vw,2.75rem)]">
          Same three tiers. What changes is how much legal weight Faretta will carry.
        </h2>

        <div className="grid grid-cols-3 gap-5 max-[880px]:grid-cols-1">
          {tierDeltas.map((t) => (
            <div
              key={t.tier}
              className={[
                "rounded-g-primary p-6 border",
                t.emphasized
                  ? "border-gold/60 bg-[linear-gradient(180deg,rgba(212,168,85,0.08),rgba(255,107,44,0.04))]"
                  : "border-ink/10 bg-[rgba(18,22,35,0.4)]",
              ].join(" ")}
            >
              <div className="text-gold text-[0.6875rem] tracking-kicker uppercase font-semibold mb-2">
                {t.sub}
              </div>
              <h3 className="font-display font-display-weight text-[1.5rem] leading-none mb-3">
                {t.tier}
              </h3>
              <p className="text-mist text-[0.9375rem] leading-[1.55]">{t.line}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-gold text-[0.9375rem] font-semibold hover:text-flame transition-colors"
          >
            See full pricing across all six products →
          </Link>
        </div>
      </section>

      <section
        id="access"
        className="text-center py-[140px] px-6 max-w-[760px] mx-auto"
      >
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          Access
        </span>
        <h2 className="font-display font-display-weight leading-[1.04] tracking-[-0.02em] mx-auto mb-6 text-[clamp(2rem,5vw,3.5rem)]">
          Bring your own case. Faretta brings the binder.
        </h2>
        <p className="text-mist text-[1.0625rem] max-w-[620px] mx-auto mb-10 leading-[1.6]">
          Faretta is in private beta. If you have a real matter — a filing due,
          a contract on the desk, a hearing on the calendar — request access
          and tell us what you are facing. We are letting in operators who will
          stress-test the network.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(212,168,85,0.35)]"
          >
            Request access →
          </Link>
          <a
            href="https://cal.com/realryannichols"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full border-[1.5px] border-gold/50 text-gold text-[0.9375rem] font-semibold transition-all duration-hover hover:-translate-y-[2px] hover:border-gold hover:bg-gold/5"
          >
            Book a call on cal.com
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full border-[1.5px] border-ink/20 text-ink text-[0.9375rem] font-semibold transition-all duration-hover hover:border-gold hover:text-gold"
          >
            Back to Gideon
          </Link>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-g-desktop mx-auto rounded-g-secondary border border-warn/30 bg-[rgba(245,199,122,0.04)] p-6">
          <div className="text-[0.6875rem] uppercase tracking-kicker text-warn font-semibold mb-2">
            Important — read this once
          </div>
          <p className="text-mist text-[0.875rem] leading-[1.6]">
            Faretta is a legal-research and drafting tool, not a law firm.
            Using Faretta does not create an attorney-client relationship, and
            nothing produced by Faretta is privileged or confidential against
            third parties. Faretta&apos;s output is general information, not
            legal advice on your specific facts. For matters with serious
            consequences — criminal charges, immigration, custody, anything
            you cannot afford to lose — hire a licensed attorney in your
            jurisdiction. Bar referral services are linked from the in-app
            help.
          </p>
        </div>
      </section>

      <footer className="border-t border-ink/[0.06] py-10 px-6 text-center text-mist-2 text-[0.8125rem]">
        <p>
          Faretta is part of{" "}
          <Link href="/" className="text-mist hover:text-gold">
            Gideon
          </Link>
          , built by{" "}
          <a href="https://realryannichols.com" rel="noopener" className="text-mist hover:text-gold">
            Ryan Nichols
          </a>
          .
        </p>
        <p className="mt-3 opacity-70 text-[0.75rem] tracking-[0.1em] uppercase">
          The right to counsel. The right to do it yourself. Both honored here.
        </p>
      </footer>
    </>
  );
}
