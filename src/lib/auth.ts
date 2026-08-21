import { createClient } from "@supabase/supabase-js";

/**
 * Verifies the bearer token from the Authorization header against Supabase
 * Auth and returns the token owner's verified email — or null.
 *
 * Every identity-sensitive route (points balance/spend, purchases, downloads,
 * subscription data, premium-gated generation) must call this instead of
 * trusting a client-supplied `email` field. Trusting a plain string let
 * anyone spend, read, or generate content as any email address they knew —
 * an IDOR, and a serious one here since points are bought with real crypto.
 */
export async function getVerifiedEmail(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user?.email) return null;
    return data.user.email.toLowerCase().trim();
  } catch {
    return null;
  }
}
