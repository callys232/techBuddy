import { NextResponse } from "next/server";
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API } from "@/lib/paypal";

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

  const body = await req.json().catch(() => null);
  const { email } = body ?? {};
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const token = await getPaypalAccessToken();
    const planId = await getOrCreatePlanId(token);

    const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: { email_address: email },
        custom_id: email,
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
    return NextResponse.json({ authorizationUrl: approvalUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
