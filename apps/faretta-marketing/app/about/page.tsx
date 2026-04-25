import Link from "next/link";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";
import { ShareButtons } from "../_components/share-buttons";

const PRINCIPLES = [
  "We are not a law firm. We do not give legal advice. We give legal information — clearly.",
  "We cite the law. Real cases, real statutes, real rules. Never invented citations.",
  "You sign every filing. Faretta never signs. The decision in your case is yours.",
  "We say 'I don't know' when we don't. Hedging dressed as confidence costs people their cases.",
  "We protect crisis. Suicide, domestic violence, child harm — we stop and surface help first.",
  "Your story makes the brain smarter for the next person. Your name is kept separate. You can delete anything.",
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />

      <main className="pt-[88px]">
        {/* Hero */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-f-prose mx-auto">
            <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-flag" />
              <span>Why "Faretta"</span>
            </div>

            <h1 className="font-sans font-extrabold leading-[1.02] tracking-display text-ink mb-6 text-[clamp(2.25rem,6vw,4rem)]">
              The right to{" "}
              <span className="bg-f-wordmark bg-clip-text text-transparent">stand for yourself.</span>
            </h1>
            <div className="f-stripes max-w-[240px] mb-8" />

            <p className="text-ink-2 text-[1.125rem] leading-[1.65] mb-6">
              In 1975, a man named Anthony Faretta asked a California trial court to let him represent
              himself in a criminal case. The judge said no. The Supreme Court of the United States
              said yes — and reversed the judgment.
            </p>

            <blockquote className="font-serif italic text-ink text-[1.25rem] leading-[1.5] border-l-[3px] border-liberty pl-6 my-8">
              "The right to defend is personal. The defendant, and not his lawyer or the State, will bear
              the personal consequences of a conviction. It is the defendant, therefore, who must be free
              personally to decide whether in his particular case counsel is to his advantage."
              <cite className="block mt-3 text-[0.875rem] font-sans not-italic text-eagle uppercase tracking-kicker">
                — <em className="font-serif">Faretta v. California</em>, 422 U.S. 806, 834 (1975)
              </cite>
            </blockquote>

            <p className="text-ink-2 text-[1.0625rem] leading-[1.65] mb-4">
              The Sixth Amendment, the Court held, "grants to the accused personally the right to make
              his defense." A judge cannot force a lawyer on a competent defendant who knowingly and
              intelligently chooses to waive counsel. That right is the foundation this product is
              named after, and the foundation it stands on.
            </p>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65]">
              Most people don't choose pro se because it's wise. They choose it because the alternative
              is silence. Because a lawyer cost more than they had. Because a lawyer turned them down.
              Because the matter was "too small." Because they ran out of time. Faretta AI is for those
              people. It will not replace a lawyer — but it will not let you walk in unarmed.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-6 py-16 md:py-20 bg-paper border-y border-ink/[0.08]">
          <div className="max-w-f-prose mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">Our mission</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Justice belongs to the ordinary person.
            </h2>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65] mb-4">
              Faretta AI was built by an operator who believes in <strong className="text-ink">God first,
              family second, country next</strong>, and justice backed by truth, transparency, and faith
              in the law. That conviction shapes how the product works — but not who it works for.
              Anyone is welcome here. Believer, non-believer, every background, every party, every
              corner of this country.
            </p>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65]">
              The Constitution didn't get written for people who already had lawyers. It got written
              for everyone — including the person reading this on a phone, in a parking lot, after
              they've been told no for the fourth time. That person is who we built this for.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-f-prose mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">How we work</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-8 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Six things we will not break.
            </h2>
            <ol className="space-y-4">
              {PRINCIPLES.map((p, i) => (
                <li
                  key={i}
                  className="flex gap-4 p-5 rounded-f-card border border-ink/10 bg-paper"
                >
                  <span className="font-mono text-[0.875rem] text-liberty font-bold shrink-0 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-ink-2 text-[1rem] leading-[1.6]">{p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The Brain */}
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-f-prose mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">The Brain</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Faretta gets smarter every day.
            </h2>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65] mb-4">
              Behind the chat is a Brain — a deduplicated, tagged corpus of every conversation Faretta has
              ever had. When you ask a question, Faretta doesn't just lean on the model; it pulls in the
              real-world experience of everyone who has stood where you're standing. The more people use
              Faretta, the sharper Faretta gets — for you, and for the next person.
            </p>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65] mb-6">
              That growth is the strategy. Free, Patriot, and Liberty all feed the same Brain. Partner
              sites that embed Faretta — RepWatchr.com, Faretta.Legal, TheLeadFlowPro.com, others —
              feed the same Brain. The corpus is the moat.
            </p>

            <ol className="space-y-3 mb-6">
              {[
                ["Gather", "Every chat turn, every contribution, every witness tip, every attorney lead — they all become Brain rows."],
                ["Hold",   "Supabase persists the corpus. Names and contact info live on separate tables and are never joined into training context."],
                ["Grow",   "Retrieval gets sharper as the corpus grows. Summarization compresses repetition. Tier gating rewards the people who contribute most."],
                ["Serve",  "Every next user gets answers backed by what the Brain has learned. Aggregate, anonymized insights help researchers and legal-tech partners. Individual conversations are not for sale, ever."],
              ].map(([h, p], i) => (
                <li key={h} className="flex gap-4 p-4 rounded-f-card border border-ink/10 bg-paper">
                  <span className="font-mono text-[0.875rem] text-liberty font-bold shrink-0 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink text-[0.9375rem] mb-0.5">{h}</h3>
                    <p className="text-ink-2 text-[0.9375rem] leading-[1.55]">{p}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-mute text-[0.875rem] leading-[1.55]">
              Your name and direct contact information are kept separate from the substance the Brain
              learns from. You can delete everything from your account at any time. The full picture is
              on the <Link href="/privacy" className="text-liberty hover:underline">privacy page</Link>.
            </p>
          </div>
        </section>

        {/* Founder */}
        <section className="px-6 py-16 md:py-20 bg-paper border-y border-ink/[0.08]">
          <div className="max-w-f-prose mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">Who builds this</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Built by Ryan Nichols.
            </h2>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65] mb-4">
              Faretta AI is one of several products under Ryan Nichols's umbrella. The chat widget
              you're talking to here also embeds on{" "}
              <a href="https://repwatchr.com" className="text-liberty hover:underline">RepWatchr.com</a>,{" "}
              <a href="https://faretta.legal" className="text-liberty hover:underline">Faretta.Legal</a>,{" "}
              <a href="https://theleadflowpro.com" className="text-liberty hover:underline">TheLeadFlowPro.com</a>,
              and more. Same brain. Same voice. The brain learns across all of them.
            </p>
            <p className="text-ink-2 text-[1.0625rem] leading-[1.65]">
              The goal is simple — make legal information so cheap and so accessible that nobody who
              has been wronged in this country has to walk into court alone again.
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="px-6 py-20 md:py-24">
          <div className="max-w-f-prose mx-auto text-center">
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.75rem,4vw,2.5rem)]">
              Tell someone who needs to hear this.
            </h2>
            <p className="text-ink-2 text-[1rem] leading-[1.6] max-w-[520px] mx-auto mb-8">
              The people who need Faretta most won't go searching for it. They'll hear about it from you.
            </p>
            <div className="flex justify-center mb-8">
              <ShareButtons />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover"
              >
                Try the chat →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-[0.9375rem] font-semibold hover:border-liberty hover:text-liberty transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
