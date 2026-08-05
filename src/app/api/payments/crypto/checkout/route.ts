import { NextResponse } from "next/server";

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

/* $5 — one month of Resume Premium. Crypto gateways don't do recurring billing
 * the way card processors do, so this is a one-time invoice; the webhook grants
 * 30 days of access per successful payment and the user re-pays to renew. */
const PLAN_AMOUNT_USD = 5;

/** Creates a NOWPayments hosted invoice for one month of Resume Premium. */
export async function POST(req: Request) {
  if (!NOWPAYMENTS_API_KEY) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const { email } = body ?? {};
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: PLAN_AMOUNT_USD,
        price_currency: "usd",
        order_description: "Resume Premium — 1 month",
        order_id: `resume-premium:${email}:${Date.now()}`,
        success_url: `${BASE_URL}/tools/resume-maker?upgraded=1`,
        cancel_url: `${BASE_URL}/tools/resume-maker`,
        ipn_callback_url: `${BASE_URL}/api/payments/crypto/webhook`,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message ?? "NOWPayments error" }, { status: 502 });
    }

    return NextResponse.json({ authorizationUrl: data.invoice_url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
