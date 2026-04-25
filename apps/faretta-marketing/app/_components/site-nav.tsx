import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[linear-gradient(to_bottom,rgba(251,247,238,0.95),rgba(251,247,238,0.75)_70%,transparent)] border-b border-ink/[0.06]">
      <Link href="/" className="flex items-center gap-2.5 text-ink">
        <img src="/brand/logo.svg" alt="Faretta mark" className="w-8 h-8" />
        <span className="font-serif text-[1.375rem] leading-none tracking-tight">Faretta</span>
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/about" className="hidden sm:inline text-[0.8125rem] font-semibold text-ink-2 hover:text-liberty transition-colors">
          About
        </Link>
        <Link href="/pricing" className="hidden sm:inline text-[0.8125rem] font-semibold text-ink-2 hover:text-liberty transition-colors">
          Pricing
        </Link>
        <Link href="/dashboard" className="hidden sm:inline text-[0.8125rem] font-semibold text-ink-2 hover:text-liberty transition-colors">
          Members
        </Link>
        <Link
          href="/contact"
          className="px-4 py-2 bg-liberty text-paper rounded-full text-[0.8125rem] font-semibold transition-all duration-hover hover:-translate-y-[1px] hover:bg-liberty-deep shadow-f-cta"
        >
          Get access
        </Link>
      </div>
    </nav>
  );
}
