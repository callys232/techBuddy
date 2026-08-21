import { NextResponse } from "next/server";
import { isEmailSubscribed } from "@/lib/subscription";
import { isUnlocked } from "@/lib/store";
import { runAudit } from "@/lib/audit/engine";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getVerifiedEmail } from "@/lib/auth";

export async function POST(req: Request) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const url = body?.url as string | undefined;

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const hasAccess = (await isEmailSubscribed(email)) || (await isUnlocked(email, "premium-audit-unlock"));
  if (!hasAccess) {
    return NextResponse.json({ error: "The Premium Audit Report is a TechBuddy Premium feature" }, { status: 403 });
  }

  const allowed = await checkRateLimit("premium-audit", getClientIp(req), 10);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  try {
    const report = await runAudit(url);
    return NextResponse.json({ report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not audit this URL";
    return NextResponse.json({ error: `Could not reach ${url} — check the URL and try again. (${message})` }, { status: 502 });
  }
}
