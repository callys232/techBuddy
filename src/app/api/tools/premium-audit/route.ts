import { NextResponse } from "next/server";
import { isEmailSubscribed } from "@/lib/subscription";
import { runAudit } from "@/lib/audit/engine";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  const url = body?.url as string | undefined;

  if (!email || !url) {
    return NextResponse.json({ error: "email and url are required" }, { status: 400 });
  }

  const subscribed = await isEmailSubscribed(email);
  if (!subscribed) {
    return NextResponse.json({ error: "The Premium Audit Report is a TechBuddy Premium feature" }, { status: 403 });
  }

  try {
    const report = await runAudit(url);
    return NextResponse.json({ report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not audit this URL";
    return NextResponse.json({ error: `Could not reach ${url} — check the URL and try again. (${message})` }, { status: 502 });
  }
}
