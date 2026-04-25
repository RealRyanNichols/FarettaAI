import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";
import { getUserClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  return (
    <>
      <SiteNav />
      <main className="pt-[88px] pb-20 px-6 max-w-f-content mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>Members</span>
        </div>
        <h1 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-2 text-[clamp(1.875rem,4vw,2.5rem)]">
          Welcome back.
        </h1>
        <p className="text-ink-2 text-[1rem] leading-[1.6] mb-8">
          Signed in as <span className="font-mono text-ink">{user.email}</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/api-keys"
            className="block p-6 bg-paper border border-ink/10 rounded-f-card hover:border-liberty/40 hover:shadow-f-card transition-all"
          >
            <div className="text-[0.6875rem] tracking-kicker uppercase text-liberty font-semibold mb-2">01</div>
            <div className="text-[1.125rem] font-bold text-ink mb-1">API keys</div>
            <div className="text-ink-2 text-[0.875rem] leading-[1.5]">Issue + revoke keys for embedding Faretta on partner sites.</div>
          </Link>
          <Link
            href="/tools"
            className="block p-6 bg-paper border border-ink/10 rounded-f-card hover:border-liberty/40 hover:shadow-f-card transition-all"
          >
            <div className="text-[0.6875rem] tracking-kicker uppercase text-liberty font-semibold mb-2">02</div>
            <div className="text-[1.125rem] font-bold text-ink mb-1">Tools</div>
            <div className="text-ink-2 text-[0.875rem] leading-[1.5]">Document timeline, witness organizer, forensics preview.</div>
          </Link>
          <Link
            href="/"
            className="block p-6 bg-paper border border-ink/10 rounded-f-card hover:border-liberty/40 hover:shadow-f-card transition-all"
          >
            <div className="text-[0.6875rem] tracking-kicker uppercase text-liberty font-semibold mb-2">03</div>
            <div className="text-[1.125rem] font-bold text-ink mb-1">Open the chat</div>
            <div className="text-ink-2 text-[0.875rem] leading-[1.5]">Pick up a conversation. Free tier still applies until you upgrade.</div>
          </Link>
        </div>

        <form action="/api/auth/signout" method="post" className="mt-10">
          <button
            type="submit"
            className="px-4 py-2 rounded-full border border-ink/20 text-ink-2 text-[0.8125rem] font-semibold hover:border-flag hover:text-flag transition-colors"
          >
            Sign out
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
