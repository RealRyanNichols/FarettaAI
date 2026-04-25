import Link from "next/link";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";

const SNIPPET = `<script
  src="https://faretta.ai/embed/faretta.js"
  data-faretta-key="frt_live_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  data-faretta-surface="repwatchr.com"
  defer
></script>`;

export const metadata = {
  title: "Embed Faretta — Faretta AI",
};

export default function EmbedPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-[88px] pb-20 px-6 max-w-f-prose mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>Embed</span>
        </div>

        <h1 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-5 text-[clamp(2rem,5vw,3.25rem)]">
          One script tag. Faretta on your site.
        </h1>

        <p className="text-ink-2 text-[1.0625rem] leading-[1.65] mb-8">
          Faretta runs as an embeddable chat widget on any site you operate. Drop the snippet
          below into your HTML, replace the API key with your own (issue one from the{" "}
          <Link href="/api-keys" className="text-liberty hover:underline">members area</Link>), and
          your visitors can talk to Faretta from a floating button in the corner.
        </p>

        <div className="rounded-f-card border border-ink/10 bg-paper overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-ink/[0.08] text-[0.6875rem] uppercase tracking-kicker text-mute font-semibold flex items-center justify-between">
            <span>HTML</span>
            <span>Drop in &lt;head&gt; or before &lt;/body&gt;</span>
          </div>
          <pre className="px-4 py-4 text-[0.8125rem] leading-[1.5] text-ink font-mono overflow-x-auto whitespace-pre">{SNIPPET}</pre>
        </div>

        <p className="text-ink-2 text-[0.9375rem] leading-[1.6] mb-8">
          The widget inherits your site's font and respects your CSS. It speaks in Faretta's
          voice, not yours — visitors know they're talking to a legal companion. Conversations
          show up in your members dashboard so you can see what your visitors are asking.
        </p>

        <h2 className="font-sans font-extrabold text-ink text-[1.25rem] mb-3 mt-10">What happens next</h2>
        <ol className="list-decimal list-inside space-y-2 text-ink-2 text-[0.9375rem] leading-[1.6] mb-8">
          <li>Sign up at <Link href="/login" className="text-liberty hover:underline">/login</Link>.</li>
          <li>Issue an API key from <Link href="/api-keys" className="text-liberty hover:underline">/api-keys</Link>. Copy it once — we don't store the plaintext.</li>
          <li>Drop the snippet on your site. Test in private browsing.</li>
          <li>Watch conversations come in from your dashboard.</li>
        </ol>

        <p className="text-mute text-[0.8125rem] leading-[1.5]">
          Embed is a Liberty-tier feature ($20/mo). The first 100 conversations from each new
          embed are free so you can verify the integration before committing.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/api-keys"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-liberty text-paper text-[0.9375rem] font-semibold shadow-f-cta hover:-translate-y-[1px] transition-all duration-hover hover:bg-liberty-deep"
          >
            Issue an API key →
          </Link>
          <Link
            href="/contact?topic=embed"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink text-[0.9375rem] font-semibold hover:border-liberty hover:text-liberty transition-colors"
          >
            Talk to us about embedding
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
