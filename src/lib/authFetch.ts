import { getSupabase } from "@/lib/supabase/client";

/** fetch() wrapper that attaches the current Supabase session's access token
 *  as a Bearer header — required for every identity-sensitive API route
 *  (points, purchases, subscription, premium generation). Falls through to a
 *  plain unauthenticated fetch if there's no session; the route will then
 *  correctly reject with 401 rather than trusting a spoofable email field. */
export async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  let token: string | undefined;
  try {
    const { data } = await getSupabase().auth.getSession();
    token = data.session?.access_token;
  } catch {
    // not signed in — proceed without a token, route will 401
  }

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...init, headers });
}
