import { redirect } from "next/navigation";
import { getUserClient, getAdminClient } from "@/lib/supabase-server";

type Memory = {
  id: string;
  project: string;
  kind: string;
  content: string;
  summary: string | null;
  tags: string[];
  occurrences: number;
  access_tier: string;
  last_seen_at: string;
};

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; kind?: string; tag?: string }>;
}) {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/");

  const params = await searchParams;
  const admin = getAdminClient();
  let q = admin
    .from("brain_memory")
    .select("id, project, kind, content, summary, tags, occurrences, access_tier, last_seen_at");
  if (params.project) q = q.eq("project", params.project);
  if (params.kind) q = q.eq("kind", params.kind);
  if (params.tag) q = q.contains("tags", [params.tag]);
  q = q.order("occurrences", { ascending: false }).limit(200);
  const { data: rows, error } = await q;

  return (
    <div>
      <h1 className="text-[1.5rem] font-display mb-1">Memories</h1>
      <p className="text-mist text-[0.875rem] mb-6">
        Top 200, sorted by occurrences. Filter via <code>?project=</code>, <code>?kind=</code>, <code>?tag=</code>.
      </p>
      {error ? <p className="text-wrath">{error.message}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-[0.875rem]">
          <thead className="text-mist-2 text-left text-[0.75rem] tracking-kicker uppercase">
            <tr>
              <th className="py-2 pr-4">Project</th>
              <th className="py-2 pr-4">Kind</th>
              <th className="py-2 pr-4">×</th>
              <th className="py-2 pr-4">Tier</th>
              <th className="py-2 pr-4">Tags</th>
              <th className="py-2 pr-4">Content</th>
            </tr>
          </thead>
          <tbody>
            {(rows as Memory[] | null)?.map((m) => (
              <tr key={m.id} className="border-t border-ink/[0.06] align-top">
                <td className="py-3 pr-4 text-gold">{m.project}</td>
                <td className="py-3 pr-4">{m.kind}</td>
                <td className="py-3 pr-4 tabular-nums">{m.occurrences}</td>
                <td className="py-3 pr-4 text-mist">{m.access_tier}</td>
                <td className="py-3 pr-4 text-mist-2">{m.tags?.join(", ")}</td>
                <td className="py-3 pr-4 max-w-[540px]">{m.summary ?? m.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
