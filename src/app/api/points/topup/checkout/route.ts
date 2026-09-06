import { NextResponse } from "next/server";
import { POINTS_PER_USD } from "@/lib/points";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

const MIN_USD = 1;
const MAX_USD = 500;

/** Creates a NOWPayments invoice to fund a user's points balance with crypto. */
export async function POST(req: Request) {
  if (!NOWPAYMENTS_API_KEY) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const email = user.email;

  const body = await req.json().catch(() => null);
  const amountUsd = Number(body?.amountUsd);

  if (!Number.isFinite(amountUsd) || amountUsd < MIN_USD || amountUsd > MAX_USD) {
    return NextResponse.json({ error: `Amount must be between $${MIN_USD} and $${MAX_USD}` }, { status: 400 });
  }

  const points = Math.round(amountUsd * POINTS_PER_USD);

  try {
    const supabase = createServerClient();
    const { data: order, error: orderError } = await supabase.from("payment_orders").insert({ user_id: user.id, email, provider: "nowpayments", product_key: "points-topup", amount: amountUsd, currency: "USD", metadata: { points } }).select("id").single();
    if (orderError) throw new Error("Could not create top-up order");
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
        order_id: `topup:${order.id}:${email}`,
        success_url: `${BASE_URL}/dashboard?funded=1`,
        cancel_url: `${BASE_URL}/dashboard`,
        ipn_callback_url: `${BASE_URL}/api/points/topup/webhook`,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message ?? "NOWPayments error" }, { status: 502 });
    }

    await supabase.from("payment_orders").update({ provider_reference: String(data.id ?? data.invoice_id ?? order.id), updated_at: new Date().toISOString() }).eq("id", order.id);
    return NextResponse.json({ authorizationUrl: data.invoice_url, points, orderId: order.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
