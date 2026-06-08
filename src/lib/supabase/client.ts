import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (singleton)
export const supabase = createClient<Database>(url, anonKey);

// Server client (for API routes / Server Actions)
export function createServerClient() {
  return createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY ?? anonKey);
}
