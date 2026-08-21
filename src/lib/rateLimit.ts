import { createServerClient } from "@/lib/supabase/client";

const WINDOW_MS = 60_000;

/**
 * Fixed-window rate limit backed by Supabase — an in-memory Map wouldn't hold
 * across serverless cold starts or multiple instances, and this table already
 * exists for exactly this. Fails OPEN: if Supabase isn't configured or the
 * check itself errors, the request is allowed through. Availability matters
 * more than perfect throttling for these routes; the goal is blocking casual
 * scripted abuse, not building a hardened gateway.
 */
export async function checkRateLimit(bucket: string, identifier: string, limit: number): Promise<boolean> {
  try {
    const supabase = createServerClient();
    const key = `${bucket}:${identifier}`;
    const now = Date.now();

    const { data: existing } = await supabase
      .from("rate_limits")
      .select("count, window_start")
      .eq("key", key)
      .maybeSingle();

    if (!existing || now - new Date(existing.window_start).getTime() > WINDOW_MS) {
      await supabase.from("rate_limits").upsert({ key, count: 1, window_start: new Date(now).toISOString() }, { onConflict: "key" });
      return true;
    }

    if (existing.count >= limit) return false;

    await supabase.from("rate_limits").update({ count: existing.count + 1 }).eq("key", key);
    return true;
  } catch {
    return true;
  }
}

/** Best-effort client IP from standard proxy headers — Vercel sets x-forwarded-for. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
