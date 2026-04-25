import { redirect } from "next/navigation";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";
import { getUserClient } from "@/lib/supabase-server";

const TOOLS = [
  {
    name: "Document timeline",
    desc: "Drop in your dates, statements, and exhibits. Faretta orders them, flags conflicts, and builds a chronology you can hand a lawyer.",
    status: "Coming soon",
  },
  {
    name: "Witness organizer",
    desc: "Track who saw what, when, and how to reach them. Export to a single PDF for your file.",
    status: "Coming soon",
  },
  {
    name: "Forensics preview",
    desc: "Upload a contested document — Faretta highlights metadata anomalies, version mismatches, and edit traces.",
    status: "Liberty preview",
  },
  {
    name: "Cite-checker",
    desc: "Paste a brief or motion. Faretta verifies every case citation against the federal reporter.",
    status: "Coming soon",
  },
  {
    name: "Deadline tracker",
    desc: "Plug in your case dates and Faretta computes filing deadlines under the relevant rules.",
    status: "Coming soon",
  },
  {
    name: "Brief reader",
    desc: "Drop in opposing counsel's filing. Faretta summarizes their argument in plain English.",
    status: "Coming soon",
  },
];

export default async function ToolsPage() {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <>
      <SiteNav />
      <main className="pt-[88px] pb-20 px-6 max-w-f-content mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>Tools</span>
        </div>
        <h1 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-3 text-[clamp(1.875rem,4vw,2.5rem)]">
          Workbench.
        </h1>
        <p className="text-ink-2 text-[1rem] leading-[1.6] max-w-[640px] mb-10">
          The chat is the front door. These are the workshop tools we're building behind it. Most
          ship with Patriot or Liberty tier. We'll email you when each lands.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <div
              key={t.name}
              aria-disabled
              className="block p-5 bg-paper border border-ink/10 rounded-f-card opacity-90"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-[1rem] font-bold text-ink">{t.name}</h3>
                <span className="text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag whitespace-nowrap">{t.status}</span>
              </div>
              <p className="text-ink-2 text-[0.875rem] leading-[1.55]">{t.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
