import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type CookieSet = { name: string; value: string; options: CookieOptions };

// Anon-key server client bound to the operator's auth cookie. Used to
// check "is the operator logged in" on page loads.
export async function getUserClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (all: CookieSet[]) => {
          for (const { name, value, options } of all) {
            cookieStore.set(name, value, options);
          }
        },
      },
    },
  );
}

// Service-role client — NEVER import this from a client component.
// Only usable from Route Handlers / Server Components under `app/api/...`.
// Full read/write, bypasses RLS. This is the operator's "admin mode."
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "[dashboard] SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL must be set to use the admin client.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Gate any admin handler behind both (a) a logged-in operator session
// and (b) the email allow-list. This is intentionally strict — only
// Ryan logs into this dashboard.
export async function requireOperator(): Promise<{ email: string }> {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const email = data.user?.email ?? null;
  const allow = process.env.DASHBOARD_OPERATOR_EMAIL;
  if (!email || !allow || email.toLowerCase() !== allow.toLowerCase()) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return { email };
}
