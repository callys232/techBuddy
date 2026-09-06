import { NextResponse } from "next/server";
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API } from "@/lib/paypal";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

/* $5/month — same USD-priced Resume Premium plan as Stripe. PayPal requires a
 * Product + Billing Plan to exist before a subscription can reference them. */
const PLAN_AMOUNT_USD = "5.00";

let cachedPlanId: string | null = null;

async function getOrCreatePlanId(token: string): Promise<string> {
  if (process.env.PAYPAL_RESUME_PLAN_ID) return process.env.PAYPAL_RESUME_PLAN_ID;
  if (cachedPlanId) return cachedPlanId;

  const productRes = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Resume Premium", type: "SERVICE", category: "SOFTWARE" }),
  });
  const product = await productRes.json();
  if (!productRes.ok) throw new Error(product.message ?? "Could not create PayPal product");

  const planRes = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: product.id,
      name: "Resume Premium Monthly",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: { fixed_price: { value: PLAN_AMOUNT_USD, currency_code: "USD" } },
        },
      ],
      payment_preferences: { auto_bill_outstanding: true },
    }),
  });
  const plan = await planRes.json();
  if (!planRes.ok) throw new Error(plan.message ?? "Could not create PayPal plan");

  cachedPlanId = plan.id as string;
  return cachedPlanId;
}

/** Creates a PayPal subscription and returns the approval link to redirect the buyer to. */
export async function POST(req: Request) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const email = user.email;

  try {
    const token = await getPaypalAccessToken();
    const planId = await getOrCreatePlanId(token);
    const supabase = createServerClient();
    const { data: order, error: orderError } = await supabase.from("payment_orders").insert({ user_id: user.id, email, provider: "paypal", product_key: "premium-all-tools-month", amount: Number(PLAN_AMOUNT_USD), currency: "USD" }).select("id").single();
    if (orderError) throw new Error("Could not create payment order");

    const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: { email_address: email },
        custom_id: `${order.id}:${email}`,
        application_context: {
          brand_name: "TechBuddy",
          return_url: `${BASE_URL}/tools/resume-maker?upgraded=1`,
          cancel_url: `${BASE_URL}/tools/resume-maker`,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message ?? "PayPal error" }, { status: 502 });
    }

    const approvalUrl = (data.links as { rel: string; href: string }[]).find((l) => l.rel === "approve")?.href;
    await supabase.from("payment_orders").update({ provider_reference: data.id, updated_at: new Date().toISOString() }).eq("id", order.id);
    return NextResponse.json({ authorizationUrl: approvalUrl, orderId: order.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
