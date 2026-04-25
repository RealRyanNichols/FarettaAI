import { redirect } from "next/navigation";
import { SiteNav } from "../_components/site-nav";
import { SiteFooter } from "../_components/site-footer";
import { getAdminClient, getUserClient } from "@/lib/supabase-server";
import { NewKeyForm } from "./_new-key-form";

export const dynamic = "force-dynamic";

type KeyRow = {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

export default async function ApiKeysPage() {
  const sb = await getUserClient();
  const { data: userData } = await sb.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const admin = getAdminClient();
  const { data: rows } = await admin
    .from("faretta_api_keys")
    .select("id, name, prefix, created_at, last_used_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const keys = (rows || []) as KeyRow[];

  return (
    <>
      <SiteNav />
      <main className="pt-[88px] pb-20 px-6 max-w-f-content mx-auto">
        <div className="inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-kicker font-semibold text-flag mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-flag" />
          <span>API keys</span>
        </div>
        <h1 className="font-sans font-extrabold leading-[1.05] tracking-display text-ink mb-2 text-[clamp(1.875rem,4vw,2.5rem)]">
          Embed Faretta on your sites.
        </h1>
        <p className="text-ink-2 text-[1rem] leading-[1.6] max-w-[640px] mb-10">
          API keys authorize the Faretta chat widget to run on partner sites — RepWatchr.com,
          Faretta.Legal, TheLeadFlowPro.com, your own site. Plaintext is shown once, at creation.
          Don't lose it; you can always issue a new one.
        </p>

        <NewKeyForm />

        <div className="mt-10">
          <h2 className="font-sans font-bold text-ink text-[1.125rem] mb-4">Your keys</h2>
          {keys.length === 0 ? (
            <p className="text-mute text-[0.9375rem]">No keys yet. Create one above.</p>
          ) : (
            <div className="border border-ink/10 rounded-f-card bg-paper divide-y divide-ink/[0.08]">
              {keys.map((k) => (
                <div key={k.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className={`font-mono text-[0.875rem] ${k.revoked_at ? "line-through text-mute" : "text-ink"}`}>
                      frt_live_{k.prefix}_••••••••
                    </div>
                    <div className="text-mute text-[0.75rem] mt-1">
                      <strong className="text-ink-2">{k.name}</strong> · created {new Date(k.created_at).toLocaleDateString()}
                      {k.last_used_at ? ` · last used ${new Date(k.last_used_at).toLocaleDateString()}` : " · never used"}
                      {k.revoked_at ? ` · revoked ${new Date(k.revoked_at).toLocaleDateString()}` : ""}
                    </div>
                  </div>
                  {!k.revoked_at && (
                    <form action={`/api/keys/${k.id}/revoke`} method="post">
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-full border border-flag/40 text-flag text-[0.75rem] font-semibold hover:bg-flag hover:text-paper transition-colors"
                      >
                        Revoke
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
