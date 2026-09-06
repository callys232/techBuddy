import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng";

/* ₦2,500/month — Resume Premium plan. Adjust here if pricing changes. */
const PLAN_NAME = "Resume Premium";
const PLAN_AMOUNT_KOBO = 2_500 * 100;
const PLAN_INTERVAL = "monthly";

let cachedPlanCode: string | null = null;

async function getOrCreatePlanCode(): Promise<string> {
  if (process.env.PAYSTACK_RESUME_PLAN_CODE) return process.env.PAYSTACK_RESUME_PLAN_CODE;
  if (cachedPlanCode) return cachedPlanCode;

  const res = await fetch("https://api.paystack.co/plan", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: PLAN_NAME,
      amount: PLAN_AMOUNT_KOBO,
      interval: PLAN_INTERVAL,
      currency: "NGN",
    }),
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message ?? "Could not create Paystack plan");

  cachedPlanCode = data.data.plan_code as string;
  return cachedPlanCode;
}

/** Initiates a recurring Resume Premium subscription checkout via Paystack. */
export async function POST(req: Request) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const { name } = body ?? {};
  const email = user.email;

  try {
    const planCode = await getOrCreatePlanCode();
    const { data: order, error: orderError } = await createServerClient().from("payment_orders").insert({ user_id: user.id, email, provider: "paystack", product_key: "premium-all-tools-month", amount: PLAN_AMOUNT_KOBO / 100, currency: "NGN" }).select("id").single();
    if (orderError) throw new Error("Could not create payment order");

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: PLAN_AMOUNT_KOBO,
        currency: "NGN",
        plan: planCode,
        callback_url: `${BASE_URL}/tools/resume-maker?upgraded=1`,
        metadata: { buyer_name: name ?? "", product: "premium-all-tools-month", order_id: order.id },
      }),
    });
    const data = await res.json();
    if (!data.status) {
      return NextResponse.json({ error: data.message ?? "Paystack error" }, { status: 502 });
    }

    await createServerClient().from("payment_orders").update({ provider_reference: data.data.reference, updated_at: new Date().toISOString() }).eq("id", order.id);
    return NextResponse.json({ authorizationUrl: data.data.authorization_url, orderId: order.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
