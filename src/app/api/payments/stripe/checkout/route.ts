import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

/* $5/month — Resume Premium, USD equivalent of the ₦2,500 Paystack plan.
 * Stripe doesn't settle in NGN, so this is the USD-priced sibling plan. */
const PLAN_AMOUNT_CENTS = 500;

/** Form-encodes Stripe's bracket-notation nested params from a plain object. */
function toFormBody(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

/** Creates a Stripe Checkout Session for the Resume Premium subscription. */
export async function POST(req: Request) {
  if (!STRIPE_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const { name } = body ?? {};
  const email = user.email;

  try {
    const supabase = createServerClient();
    const { data: order, error: orderError } = await supabase.from("payment_orders").insert({ user_id: user.id, email, provider: "stripe", product_key: "premium-all-tools-month", amount: PLAN_AMOUNT_CENTS / 100, currency: "USD" }).select("id").single();
    if (orderError) throw new Error("Could not create payment order");
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toFormBody({
        mode: "subscription",
        customer_email: email,
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][unit_amount]": String(PLAN_AMOUNT_CENTS),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][product_data][name]": "Resume Premium",
        success_url: `${BASE_URL}/tools/resume-maker?upgraded=1`,
        cancel_url: `${BASE_URL}/tools/resume-maker`,
        "metadata[buyer_name]": name ?? "",
        "metadata[product]": "resume-premium",
        "metadata[email]": email,
        "metadata[order_id]": order.id,
        "subscription_data[metadata][email]": email,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? "Stripe error" }, { status: 502 });
    }

    await supabase.from("payment_orders").update({ provider_reference: data.id, updated_at: new Date().toISOString() }).eq("id", order.id);
    return NextResponse.json({ authorizationUrl: data.url, orderId: order.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
