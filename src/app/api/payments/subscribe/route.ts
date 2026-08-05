import { NextResponse } from "next/server";

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

  const body = await req.json().catch(() => null);
  const { email, name } = body ?? {};
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const planCode = await getOrCreatePlanCode();

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
        metadata: { buyer_name: name ?? "", product: "resume-premium" },
      }),
    });
    const data = await res.json();
    if (!data.status) {
      return NextResponse.json({ error: data.message ?? "Paystack error" }, { status: 502 });
    }

    return NextResponse.json({ authorizationUrl: data.data.authorization_url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Subscription setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
