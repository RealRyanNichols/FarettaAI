import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faretta — Operator",
  description: "Private dashboard. phpMyAdmin for the wisdom layer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-ink/[0.08] px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-display uppercase tracking-wordmark text-[0.875rem] text-gold"
          >
            Faretta · Operator
          </Link>
          <nav className="flex gap-5 text-[0.8125rem] text-mist">
            <Link href="/memories" className="hover:text-ink">Memories</Link>
            <Link href="/compose" className="hover:text-ink">Compose</Link>
            <Link href="/stats" className="hover:text-ink">Stats</Link>
          </nav>
        </header>
        <main className="px-6 py-8 max-w-f-desktop mx-auto">{children}</main>
      </body>
    </html>
  );
}
