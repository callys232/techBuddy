import { NextResponse } from "next/server";
import { purchaseProduct } from "@/lib/store";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getVerifiedEmail } from "@/lib/auth";

export async function POST(req: Request) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slug = body?.slug as string | undefined;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const allowed = await checkRateLimit("store-purchase", getClientIp(req), 20);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  try {
    const result = await purchaseProduct(email, slug);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Purchase failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
