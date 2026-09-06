import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient<Database> | undefined;

/** Lazy browser singleton — created on first real use, not at module load,
 *  so a build/prerender pass with no Supabase env vars configured doesn't crash. */
export function getSupabase(): SupabaseClient<Database> {
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!browserClient) browserClient = createClient<Database>(url, anonKey);
  return browserClient;
}

// Server client (for API routes / Server Actions) — created fresh per call, also lazy.
export function createServerClient(): SupabaseClient<Database> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL.");
  }
  return createClient<Database>(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
