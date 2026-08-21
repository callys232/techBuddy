import { NextResponse } from "next/server";
import { POINTS_PER_USD } from "@/lib/points";

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

const MIN_USD = 1;
const MAX_USD = 500;

/** Creates a NOWPayments invoice to fund a user's points balance with crypto. */
export async function POST(req: Request) {
  if (!NOWPAYMENTS_API_KEY) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  const amountUsd = Number(body?.amountUsd);

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  if (!Number.isFinite(amountUsd) || amountUsd < MIN_USD || amountUsd > MAX_USD) {
    return NextResponse.json({ error: `Amount must be between $${MIN_USD} and $${MAX_USD}` }, { status: 400 });
  }

  const points = Math.round(amountUsd * POINTS_PER_USD);

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: amountUsd,
        price_currency: "usd",
        order_description: `TechBuddy points top-up — ${points} points`,
        order_id: `topup:${email}:${amountUsd}:${Date.now()}`,
        success_url: `${BASE_URL}/dashboard?funded=1`,
        cancel_url: `${BASE_URL}/dashboard`,
        ipn_callback_url: `${BASE_URL}/api/points/topup/webhook`,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message ?? "NOWPayments error" }, { status: 502 });
    }

    return NextResponse.json({ authorizationUrl: data.invoice_url, points });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
