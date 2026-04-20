import Link from "next/link";
import { getUserClient } from "@/lib/supabase-server";
import SignInForm from "./sign-in";

export default async function HomePage() {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-[1.75rem] font-display mb-2">Operator sign-in</h1>
        <p className="text-mist mb-6 text-[0.9375rem]">
          Magic link only. Email must match <code>DASHBOARD_OPERATOR_EMAIL</code>.
        </p>
        <SignInForm />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[1.75rem] font-display mb-2">Signed in as {user.email}</h1>
      <p className="text-mist mb-6 text-[0.9375rem]">phpMyAdmin for the wisdom layer.</p>
      <ul className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1">
        <Link
          href="/memories"
          className="block p-6 bg-midnight rounded-g-primary border border-ink/[0.06] hover:border-gold/25"
        >
          <div className="text-[0.75rem] tracking-kicker uppercase text-gold mb-2">01</div>
          <div className="text-[1.125rem] font-semibold mb-1">Memories</div>
          <div className="text-mist text-[0.875rem]">Table view, filter, sort, inline summaries.</div>
        </Link>
        <Link
          href="/compose"
          className="block p-6 bg-midnight rounded-g-primary border border-ink/[0.06] hover:border-gold/25"
        >
          <div className="text-[0.75rem] tracking-kicker uppercase text-gold mb-2">02</div>
          <div className="text-[1.125rem] font-semibold mb-1">Compose</div>
          <div className="text-mist text-[0.875rem]">Hand-author a memory.</div>
        </Link>
        <Link
          href="/stats"
          className="block p-6 bg-midnight rounded-g-primary border border-ink/[0.06] hover:border-gold/25"
        >
          <div className="text-[0.75rem] tracking-kicker uppercase text-gold mb-2">03</div>
          <div className="text-[1.125rem] font-semibold mb-1">Stats</div>
          <div className="text-mist text-[0.875rem]">Counts, tier mix, top 20 by occurrences.</div>
        </Link>
      </ul>
    </div>
  );
}
