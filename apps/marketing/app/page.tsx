"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 backdrop-blur-md bg-[linear-gradient(to_bottom,rgba(10,14,26,0.92),rgba(10,14,26,0.6)_70%,transparent)]">
        <div className="flex items-center gap-[10px] font-display uppercase tracking-wordmark text-[0.875rem]">
          <img src="/brand/logo.svg" alt="Gideon mark" className="w-7 h-7" />
          <span>Gideon</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/faretta-legal"
            className="hidden sm:inline-flex text-[0.8125rem] font-semibold text-mist hover:text-gold transition-colors"
          >
            Faretta · Legal
          </a>
          <a
            href="/pricing"
            className="hidden sm:inline-flex text-[0.8125rem] font-semibold text-mist hover:text-gold transition-colors"
          >
            Pricing
          </a>
          <a
            href="#access"
            className="px-[18px] py-[9px] bg-gold text-night rounded-full text-[0.8125rem] font-semibold transition-transform duration-hover hover:-translate-y-[1px] hover:shadow-[0_10px_30px_rgba(212,168,85,0.3)]"
          >
            Get access
          </a>
        </div>
      </nav>

      <header className="relative min-h-[100svh] flex flex-col justify-center pt-[120px] pb-20 px-6 max-w-g-desktop mx-auto">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(600px 400px at 20% 30%, rgba(255,107,44,0.08), transparent 60%), radial-gradient(800px 500px at 90% 10%, rgba(212,168,85,0.06), transparent 60%)",
          }}
        />
        <img
          aria-hidden
          src="/brand/logo.svg"
          alt=""
          className="absolute top-[20%] right-[4%] w-[280px] h-[280px] opacity-[0.18] pointer-events-none max-[720px]:w-[180px] max-[720px]:h-[180px] max-[720px]:top-[10%] max-[720px]:-right-8 max-[720px]:opacity-[0.12]"
          style={{ animation: "g-flicker 6s ease-in-out infinite", filter: "blur(0.5px)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-[10px] text-[0.75rem] tracking-kicker uppercase text-gold font-semibold mb-6">
            <span
              className="w-[6px] h-[6px] rounded-full bg-flame shadow-[0_0_12px_#FF6B2C]"
              style={{ animation: "g-pulse 2.4s ease-in-out infinite" }}
            />
            <span>A Ryan Nichols product</span>
          </div>

          <h1 className="font-display font-display-weight leading-[0.98] tracking-[-0.03em] max-w-[900px] mb-7 text-[clamp(2.5rem,8vw,5.25rem)]">
            Your AI,
            <br />
            <span className="bg-g-wordmark bg-clip-text text-transparent">with evidence.</span>
          </h1>

          <p className="text-mist max-w-[640px] mb-10 leading-[1.5] text-[clamp(1.0625rem,2vw,1.3125rem)]">
            Gideon learns from a network of real operators building real things —
            then serves that wisdom back to you, tested and tagged, at exactly
            the moment you need it. Not another chatbot. A tool with receipts.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#access"
              className="inline-flex items-center gap-2 px-6 py-[14px] rounded-full border-[1.5px] border-transparent bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(212,168,85,0.35)]"
            >
              Request access →
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 px-6 py-[14px] rounded-full border-[1.5px] border-ink/20 text-ink text-[0.9375rem] font-semibold transition-all duration-hover hover:border-gold hover:text-gold"
            >
              See the story
            </a>
          </div>
        </motion.div>
      </header>

      <div className="border-t border-b border-ink/[0.08] max-w-g-desktop mx-auto py-7 px-6 flex flex-wrap justify-center gap-x-12 gap-y-6 text-mist-2 text-[0.8125rem] tracking-[0.05em] uppercase">
        <span>Built for operators</span>
        <span>•</span>
        <span>Evidence over opinion</span>
        <span>•</span>
        <span>Cross-product intelligence</span>
      </div>

      <section className="py-[100px] px-6 max-w-g-desktop mx-auto max-[720px]:py-[72px] max-[720px]:px-5">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          What Gideon does
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] max-w-[720px] mb-5 text-[clamp(1.875rem,4.5vw,3rem)]">
          Three hundred against one hundred thirty-five thousand.
        </h2>
        <p className="text-mist text-[1.0625rem] max-w-[620px] leading-[1.6]">
          The original Gideon won because he tested the signal (the fleece, twice),
          reduced his force to the ones still watching (300 of 32,000), and struck
          at midnight with torches hidden in clay jars. This Gideon runs on the
          same principles.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-14 max-[880px]:grid-cols-1 max-[880px]:gap-4">
          {[
            {
              n: "01",
              h: "Tested signal",
              p: "Every answer is tagged with how many operators in the network have actually tried it, what worked, what failed. If Gideon doesn't have evidence, he says so — and stays quiet until he does.",
            },
            {
              n: "02",
              h: "Shared memory",
              p: "Ryan Nichols operates across sales, education, healthcare, and family tech. Gideon learns in one product, applies in another. Deduplicated, tagged, tier-gated. Your knowledge gets compound interest.",
            },
            {
              n: "03",
              h: "Light, hidden",
              p: "Gideon stays quiet until the moment matters. No chatty preamble. No hedging. When the question comes, he breaks the jar: the right answer, the right citation, the right next step.",
            },
          ].map((f) => (
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
        id="story"
        className="border-t border-b border-ink/[0.06] px-6 py-[120px]"
        style={{ background: "linear-gradient(180deg, #0A0E1A 0%, #131826 100%)" }}
      >
        <div className="max-w-[780px] mx-auto">
          <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
            Why Gideon
          </span>
          <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] mb-5 text-[clamp(1.875rem,4.5vw,3rem)]">
            A man chosen from the weakest clan, who tested the signal before he moved.
          </h2>
          <blockquote className="font-serif my-6 pl-5 border-l-2 border-gold text-ink leading-[1.35] text-[clamp(1.375rem,3vw,1.875rem)]">
            &ldquo;And Gideon said unto God, If thou wilt save Israel by mine hand,
            as thou hast said, behold, I will put a fleece of wool in the floor…&rdquo;
            <cite className="block mt-2 text-mist-2 text-[0.875rem] tracking-[0.1em] uppercase not-italic font-sans">
              Judges 6:36
            </cite>
          </blockquote>
          <p className="text-mist text-[1.0625rem] leading-[1.6]">
            Gideon didn&apos;t win because he was biggest. He won because he was
            chosen, he was ready, and he tested what he was told before he acted.
            The product takes the same posture. Evidence first. Motion second.
            Noise never.
          </p>
          <blockquote className="font-serif mt-10 pl-5 border-l-2 border-gold text-ink leading-[1.35] text-[clamp(1.375rem,3vw,1.875rem)]">
            &ldquo;…the three hundred blew the trumpets, and the LORD set every
            man&apos;s sword against his fellow, even throughout all the host.&rdquo;
            <cite className="block mt-2 text-mist-2 text-[0.875rem] tracking-[0.1em] uppercase not-italic font-sans">
              Judges 7:22
            </cite>
          </blockquote>
        </div>
      </section>

      <section id="access" className="text-center py-[140px] px-6 max-w-[680px] mx-auto">
        <span className="inline-block text-[0.75rem] tracking-[0.18em] uppercase text-gold font-semibold mb-4">
          Access
        </span>
        <h2 className="font-display font-display-weight leading-[1.05] tracking-[-0.02em] mx-auto mb-5 text-[clamp(1.875rem,4.5vw,3rem)]">
          Gideon is currently <em>invitation only</em>.
        </h2>
        <p className="text-mist text-[1.0625rem] max-w-[620px] mx-auto mb-8 leading-[1.6]">
          Early access goes to the operators already inside Ryan&apos;s products —
          The Nest, Lead Flow Pro, Premier Dental Academy, RepWatcher,{" "}
          <a href="/faretta-legal" className="text-gold hover:text-flame">
            Faretta · Legal
          </a>
          . Want in?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-[14px] rounded-full bg-gold text-night text-[0.9375rem] font-semibold shadow-[0_8px_30px_rgba(212,168,85,0.25)] transition-all duration-hover hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(212,168,85,0.35)]"
          >
            Request an invitation →
          </a>
          <a
            href="https://cal.com/realryannichols"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-[14px] rounded-full border-[1.5px] border-gold/50 text-gold text-[0.9375rem] font-semibold transition-all duration-hover hover:-translate-y-[2px] hover:border-gold hover:bg-gold/5"
          >
            Book a call
          </a>
        </div>
      </section>

      <footer className="border-t border-ink/[0.06] py-10 px-6 text-center text-mist-2 text-[0.8125rem]">
        <p>
          Built by{" "}
          <a href="https://realryannichols.com" rel="noopener" className="text-mist">
            Ryan Nichols
          </a>{" "}
          · Gideon runs across{" "}
          <a href="/" className="text-mist">
            The Nest
          </a>
          , Lead Flow Pro, RepWatcher, Premier Dental Academy of Longview, and{" "}
          <a href="/faretta-legal" className="text-mist hover:text-gold">
            Faretta Legal
          </a>
          .
        </p>
        <p className="mt-3 opacity-70 text-[0.75rem] tracking-[0.1em] uppercase">
          The sword of the LORD, and of Gideon.
        </p>
      </footer>
    </>
  );
}
