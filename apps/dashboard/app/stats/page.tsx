import { redirect } from "next/navigation";
import { getUserClient, getAdminClient } from "@/lib/supabase-server";

export default async function StatsPage() {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/");

  const admin = getAdminClient();
  const [{ count: total }, { data: all }, { data: top20 }] = await Promise.all([
    admin.from("brain_memory").select("*", { head: true, count: "exact" }),
    admin.from("brain_memory").select("project, access_tier"),
    admin
      .from("brain_memory")
      .select("id, project, kind, occurrences, content, summary")
      .order("occurrences", { ascending: false })
      .limit(20),
  ]);

  const perProject: Record<string, number> = {};
  const perTier: Record<string, number> = {};
  for (const r of all ?? []) {
    perProject[r.project] = (perProject[r.project] ?? 0) + 1;
    perTier[r.access_tier] = (perTier[r.access_tier] ?? 0) + 1;
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="text-[1.5rem] font-display mb-2">Stats</h1>
        <p className="text-mist text-[0.875rem]">
          Total memories: <span className="text-ink tabular-nums">{total ?? 0}</span>
        </p>
      </section>
      <section>
        <h2 className="text-[1.125rem] font-semibold mb-3">Per project</h2>
        <ul className="flex flex-col gap-1 text-[0.9375rem]">
          {Object.entries(perProject).sort((a, b) => b[1] - a[1]).map(([p, n]) => (
            <li key={p} className="flex justify-between border-b border-ink/[0.06] py-2">
              <span className="text-gold">{p}</span>
              <span className="tabular-nums">{n}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-[1.125rem] font-semibold mb-3">Tier distribution</h2>
        <ul className="flex flex-col gap-1 text-[0.9375rem]">
          {Object.entries(perTier).map(([t, n]) => (
            <li key={t} className="flex justify-between border-b border-ink/[0.06] py-2">
              <span>{t}</span>
              <span className="tabular-nums">{n}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-[1.125rem] font-semibold mb-3">Top 20 by occurrences</h2>
        <ol className="flex flex-col gap-1 text-[0.875rem]">
          {top20?.map((m) => (
            <li key={m.id} className="border-b border-ink/[0.06] py-2">
              <div className="flex gap-3 text-mist-2 text-[0.75rem] tracking-kicker uppercase">
                <span className="text-gold">{m.project}</span>
                <span>{m.kind}</span>
                <span className="ml-auto tabular-nums">×{m.occurrences}</span>
              </div>
              <p className="text-ink mt-1">{m.summary ?? m.content}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
