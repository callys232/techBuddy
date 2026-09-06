import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

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

  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const email = user.email;

  try {
    const supabase = createServerClient();
    const { data: order, error: orderError } = await supabase.from("payment_orders").insert({ user_id: user.id, email, provider: "nowpayments", product_key: "premium-all-tools-month", amount: PLAN_AMOUNT_USD, currency: "USD" }).select("id").single();
    if (orderError) throw new Error("Could not create payment order");
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
        order_id: `premium:${order.id}:${email}`,
        success_url: `${BASE_URL}/tools/resume-maker?upgraded=1`,
        cancel_url: `${BASE_URL}/tools/resume-maker`,
        ipn_callback_url: `${BASE_URL}/api/payments/crypto/webhook`,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message ?? "NOWPayments error" }, { status: 502 });
    }

    await supabase.from("payment_orders").update({ provider_reference: String(data.id ?? data.invoice_id ?? order.id), updated_at: new Date().toISOString() }).eq("id", order.id);
    return NextResponse.json({ authorizationUrl: data.invoice_url, orderId: order.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
