import { NextResponse } from "next/server";
import { purchaseProduct } from "@/lib/store";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  const slug = body?.slug as string | undefined;

  if (!email || !slug) {
    return NextResponse.json({ error: "email and slug are required" }, { status: 400 });
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
