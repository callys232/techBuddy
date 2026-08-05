import { createServerClient } from "@/lib/supabase/client";

/** A subscription counts as active if Paystack has it marked active/non-renewing
 *  and (when known) the current period hasn't lapsed yet. */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("email", email.toLowerCase().trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return false;
    if (data.status !== "active" && data.status !== "non-renewing") return false;
    if (data.current_period_end && new Date(data.current_period_end).getTime() < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}
