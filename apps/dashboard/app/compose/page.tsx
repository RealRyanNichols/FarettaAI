import { redirect } from "next/navigation";
import { getUserClient } from "@/lib/supabase-server";
import ComposeForm from "./form";

export default async function ComposePage() {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/");

  return (
    <div className="max-w-xl">
      <h1 className="text-[1.5rem] font-display mb-1">Compose memory</h1>
      <p className="text-mist text-[0.875rem] mb-6">Hand-authored. Dedup still applies.</p>
      <ComposeForm />
    </div>
  );
}
