import Link from "next/link";
import { SiteNav } from "./_components/site-nav";
import { SiteFooter } from "./_components/site-footer";
import { FarettaChat } from "./_components/faretta-chat";
import { ShareButtons } from "./_components/share-buttons";

const PRINCIPLES = [
  {
    n: "01",
    h: "Stand up for yourself",
    p: "Faretta v. California (1975) said you have the right to represent yourself. We help you exercise it without going in blind.",
  },
  {
    n: "02",
    h: "Backed by case law",
    p: "Every answer points to a real case, statute, or rule. We say where the law lives. We don't make it up.",
  },
  {
    n: "03",
    h: "Voice for the voiceless",
    p: "When you have nobody, you have us. Hopeful, plain English, and a path forward — no matter how many doors have closed.",
  },
];

const CASE_LAW = [
  {
    title: "Faretta v. California",
    cite: "422 U.S. 806 (1975)",
    holding: "The Sixth Amendment guarantees a defendant the right to represent themselves in a criminal proceeding.",
  },
  {
    title: "Gideon v. Wainwright",
    cite: "372 U.S. 335 (1963)",
    holding: "The right to counsel applies in state criminal prosecutions for those who cannot afford an attorney.",
  },
  {
    title: "Miranda v. Arizona",
    cite: "384 U.S. 436 (1966)",
    holding: "Police must inform suspects of their rights to remain silent and to counsel before custodial interrogation.",
  },
  {
    title: "Brady v. Maryland",
    cite: "373 U.S. 83 (1963)",
    holding: "Prosecutors must turn over evidence favorable to the defense if it's material to guilt or punishment.",
  },
  {
    title: "Mapp v. Ohio",
    cite: "367 U.S. 643 (1961)",
    holding: "Evidence obtained in violation of the Fourth Amendment is inadmissible in state courts.",
  },
  {
    title: "Marbury v. Madison",
    cite: "5 U.S. 137 (1803)",
    holding: "The judiciary has the power to declare laws unconstitutional. The foundation of judicial review.",
  },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main className="pt-[88px]">
        {/* Hero with chat front-and-center */}
        <section className="relative px-6 py-10 md:py-14">
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(800px_500px_at_85%_10%,rgba(30,58,138,0.06),transparent_60%),radial-gradient(700px_400px_at_5%_5%,rgba(185,28,28,0.04),transparent_60%)]" />

          <div className="max-w-f-content mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-flag" />
                <span>A voice for the voiceless</span>
              </div>

              <h1 className="font-sans font-extrabold leading-[1.02] tracking-display text-ink mb-6 text-[clamp(2.25rem,6vw,4.25rem)]">
                Stand up for yourself.{" "}
                <span className="bg-f-wordmark bg-clip-text text-transparent">Pro&nbsp;se.</span>
              </h1>
              <div className="f-stripes max-w-[280px] mb-7" />

              <p className="text-ink-2 text-[clamp(1.0625rem,1.7vw,1.25rem)] leading-[1.55] max-w-[560px] mb-7">
                Your rights have been violated. You're down to the last straw. You need somebody — and the
                only somebody you have is you. <strong className="text-ink">Faretta AI is in your corner.</strong>{" "}
                Free legal information, case law in plain English, and the right next step.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover hover:bg-liberty-deep"
                >
                  Why "Faretta"? →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-[0.9375rem] font-semibold hover:border-liberty hover:text-liberty transition-colors duration-hover"
                >
                  See pricing
                </Link>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[0.75rem] uppercase tracking-kicker text-mute font-semibold">Share with someone who needs it</span>
                <ShareButtons compact />
              </div>
            </div>

            <div className="lg:sticky lg:top-[100px]">
              <FarettaChat />
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-ink/[0.08] bg-paper">
          <div className="max-w-f-content mx-auto px-6 py-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[0.75rem] uppercase tracking-kicker text-mute font-semibold">
            <span className="text-liberty">⚖ Pro se by right</span>
            <span>·</span>
            <span>Case law cited</span>
            <span>·</span>
            <span>Plain English</span>
            <span>·</span>
            <span className="text-flag">★ American</span>
            <span>·</span>
            <span>Faith-built</span>
          </div>
        </section>

        {/* Three principles */}
        <section className="px-6 py-20 md:py-24">
          <div className="max-w-f-content mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">What we believe</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.875rem,4vw,2.875rem)] max-w-[760px]">
              God first, family second, country next — and{" "}
              <span className="text-liberty">justice backed by truth.</span>
            </h2>
            <p className="text-ink-2 text-[1.0625rem] max-w-[680px] leading-[1.6] mb-10">
              Faretta AI was built for the person whose case got too small for a lawyer and too big to ignore.
              We're a chat-first companion that points you at the law, in your language, with the conviction
              that ordinary people can use the Constitution to defend themselves.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRINCIPLES.map((f) => (
                <div
                  key={f.n}
                  className="bg-paper border border-ink/10 rounded-f-card p-6 hover:border-liberty/40 hover:shadow-f-card transition-all"
                >
                  <div className="w-10 h-10 rounded-f-secondary bg-liberty-soft text-liberty grid place-items-center font-bold text-[0.875rem] mb-4">
                    {f.n}
                  </div>
                  <h3 className="text-[1.125rem] font-bold mb-2 text-ink tracking-tight">{f.h}</h3>
                  <p className="text-ink-2 text-[0.9375rem] leading-[1.55]">{f.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case law abundantly placed */}
        <section className="px-6 py-20 md:py-24 bg-paper border-y border-ink/[0.08]">
          <div className="max-w-f-content mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">The law in your corner</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.875rem,4vw,2.875rem)] max-w-[760px]">
              These are the cases we lean on.
            </h2>
            <p className="text-ink-2 text-[1.0625rem] max-w-[680px] leading-[1.6] mb-10">
              When you ask Faretta a question, you don't get vibes — you get a case, a statute, or a rule.
              Below is a starter set every American should know. There are thousands more inside the chat.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CASE_LAW.map((c) => (
                <article
                  key={c.title}
                  className="rounded-f-card border border-ink/10 bg-parchment p-5 hover:border-liberty/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <h3 className="font-serif italic text-ink text-[1.0625rem] leading-tight">{c.title}</h3>
                    <span className="font-mono text-[0.75rem] text-eagle whitespace-nowrap">{c.cite}</span>
                  </div>
                  <p className="text-ink-2 text-[0.9375rem] leading-[1.5]">{c.holding}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* What Faretta does */}
        <section className="px-6 py-20 md:py-24">
          <div className="max-w-f-content mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 items-start">
            <div>
              <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">How Faretta helps</span>
              <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                You ask. We point. You decide.
              </h2>
              <p className="text-ink-2 text-[1rem] leading-[1.6]">
                Faretta gives you the law and the next step. The decision still belongs to you — and we'll
                always tell you when it's time to find a licensed attorney to file under their signature.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                ["Read the rule",   "Faretta explains statutes, federal rules, and state procedure in plain language."],
                ["Cite the case",   "Real Supreme Court holdings, real federal circuit splits — never invented citations."],
                ["Map the steps",   "What to file, where to file, when it's due. Court self-help links by state."],
                ["Connect counsel", "When your matter is real, Faretta routes you to a licensed attorney — no charge for the intro."],
                ["Hold your story", "Timeline, witnesses, documents. We help you organize the facts before you walk in."],
                ["Crisis-aware",    "If you're in danger, the conversation stops and we surface 988, 911, and the DV hotline."],
              ].map(([h, p]) => (
                <li key={h} className="flex gap-3 p-4 rounded-f-card border border-ink/10 bg-paper">
                  <span aria-hidden className="text-liberty text-[1.125rem]">⚖</span>
                  <div>
                    <h3 className="text-ink font-bold text-[0.9375rem] mb-0.5">{h}</h3>
                    <p className="text-ink-2 text-[0.875rem] leading-[1.55]">{p}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Witness tip line */}
        <section className="px-6 py-16 md:py-20 bg-f-liberty text-paper">
          <div className="max-w-f-prose mx-auto text-center">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-gold-soft font-semibold mb-3">Solve cases, together</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display mb-5 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Did you witness something?
            </h2>
            <p className="text-paper/85 text-[1.0625rem] leading-[1.6] mb-6">
              If you saw something that matters to a public case, you can leave a tip without leaving your name.
              Real witnesses break cases open. We protect your story.
            </p>
            <Link
              href="/contact?topic=witness"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-paper text-liberty text-[0.9375rem] font-semibold hover:-translate-y-[1px] transition-transform duration-hover"
            >
              Leave an anonymous tip →
            </Link>
          </div>
        </section>

        {/* Where Faretta lives */}
        <section className="px-6 py-20 md:py-24 bg-paper border-y border-ink/[0.08]">
          <div className="max-w-f-content mx-auto">
            <span className="inline-block text-[0.75rem] uppercase tracking-kicker text-flag font-semibold mb-3">Embedded everywhere</span>
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(1.75rem,3.5vw,2.5rem)] max-w-[760px]">
              One Faretta. Many surfaces.
            </h2>
            <p className="text-ink-2 text-[1.0625rem] max-w-[680px] leading-[1.6] mb-8">
              Faretta lives at <strong>Faretta.AI</strong>, and ships as an embeddable chat that drops into other
              Ryan Nichols sites. Same brain. Same voice. Wherever you find people who need it.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Faretta.Legal", role: "Pro se hub" },
                { name: "RepWatchr.com", role: "Reputation" },
                { name: "TheLeadFlowPro.com", role: "Sales operators" },
                { name: "And more →", role: "Coming soon" },
              ].map((s) => (
                <div key={s.name} className="rounded-f-card border border-ink/10 p-4 bg-parchment">
                  <div className="text-[0.6875rem] uppercase tracking-kicker text-mute font-semibold mb-1">{s.role}</div>
                  <div className="text-ink font-bold text-[0.9375rem]">{s.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/embed"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-liberty text-liberty text-[0.875rem] font-semibold hover:bg-liberty hover:text-paper transition-colors duration-hover"
              >
                Embed Faretta on your site →
              </Link>
            </div>
          </div>
        </section>

        {/* Final share / CTA */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-f-prose mx-auto text-center">
            <h2 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(2rem,4.5vw,3rem)]">
              Tell someone who needs this.
            </h2>
            <p className="text-ink-2 text-[1.0625rem] max-w-[560px] mx-auto leading-[1.6] mb-8">
              Most people who need Faretta will never search for it. They'll hear about it from you.
            </p>
            <div className="flex justify-center mb-8">
              <ShareButtons />
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-flag text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover"
            >
              Talk to a person →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
