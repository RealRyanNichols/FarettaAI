import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type CookieSet = { name: string; value: string; options: CookieOptions };

// Anon-key server client bound to the visitor's auth cookie. Used to
// check "is the visitor signed in" on members-area pages.
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

// Service-role client. Server-only — never import from a "use client" file.
// Bypasses RLS so we can write to faretta_* tables that have no public policy.
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "[faretta] SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL must be set.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Members-area gate. Faretta has open signup — anyone with an email
// can sign in. Just confirm there's a session.
export async function requireUser(): Promise<{ userId: string; email: string }> {
  const sb = await getUserClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user || !user.email) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return { userId: user.id, email: user.email };
}
