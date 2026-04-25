import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/[0.08] bg-paper">
      <div className="max-w-f-content mx-auto px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-[320px]">
            <div className="flex items-center gap-2 mb-2 font-semibold tracking-wordmark uppercase text-[0.8125rem] text-ink">
              <img src="/brand/logo.svg" alt="" className="w-5 h-5" />
              <span>Faretta&nbsp;AI</span>
            </div>
            <p className="text-mute text-[0.875rem] leading-[1.55]">
              A voice for the voiceless. Pro se legal information for people standing up for themselves —
              with case law, in plain English, in your corner.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-2 text-[0.875rem]">
            <div className="flex flex-col gap-2">
              <span className="text-[0.6875rem] uppercase tracking-kicker text-mute font-semibold">Product</span>
              <Link href="/" className="text-ink-2 hover:text-liberty">Chat</Link>
              <Link href="/pricing" className="text-ink-2 hover:text-liberty">Pricing</Link>
              <Link href="/dashboard" className="text-ink-2 hover:text-liberty">Members</Link>
              <Link href="/embed" className="text-ink-2 hover:text-liberty">Embed</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[0.6875rem] uppercase tracking-kicker text-mute font-semibold">Company</span>
              <Link href="/about" className="text-ink-2 hover:text-liberty">About</Link>
              <Link href="/contact" className="text-ink-2 hover:text-liberty">Contact</Link>
              <Link href="/privacy" className="text-ink-2 hover:text-liberty">Privacy</Link>
            </div>
          </div>
        </div>

        <hr className="my-8 border-ink/[0.08]" />

        <p className="text-mute text-[0.75rem] leading-[1.6]">
          Faretta AI is not a law firm and does not provide legal advice. Information here is general
          legal information for educational purposes. Use of Faretta AI does not create an
          attorney-client relationship. For advice on your specific case, consult a licensed attorney
          in your jurisdiction.
        </p>
        <p className="mt-3 text-mute text-[0.75rem]">
          © {new Date().getFullYear()} Faretta AI · Built by Ryan Nichols. Named for{" "}
          <em>Faretta v. California</em>, 422 U.S. 806 (1975).
        </p>
      </div>
    </footer>
  );
}
