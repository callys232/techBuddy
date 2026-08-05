import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServerClient } from "@/lib/supabase/client";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";

interface PaystackEvent {
  event: string;
  data: {
    customer?: { email?: string; customer_code?: string };
    email?: string;
    subscription_code?: string;
    status?: string;
    next_payment_date?: string;
    plan?: { name?: string };
  };
}

/** Paystack webhook — verifies the HMAC signature before trusting anything in
 *  the payload, then keeps the subscriptions table in sync with billing state. */
export async function POST(req: Request) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const expected = crypto.createHmac("sha512", PAYSTACK_SECRET).update(raw).digest("hex");

  if (!signature || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as PaystackEvent;
  const email = (event.data.customer?.email ?? event.data.email ?? "").toLowerCase().trim();
  if (!email) return NextResponse.json({ ok: true }); // nothing to attribute this to

  const supabase = createServerClient();

  try {
    switch (event.event) {
      case "charge.success":
      case "subscription.create":
        await supabase.from("subscriptions").upsert(
          {
            email,
            status: "active",
            plan: event.data.plan?.name ?? "Resume Premium",
            paystack_customer_code: event.data.customer?.customer_code ?? null,
            paystack_subscription_code: event.data.subscription_code ?? null,
            current_period_end: event.data.next_payment_date ?? null,
          },
          { onConflict: "email" }
        );
        break;

      case "subscription.not_renew":
        await supabase.from("subscriptions").update({ status: "non-renewing" }).eq("email", email);
        break;

      case "subscription.disable":
      case "invoice.payment_failed":
        await supabase.from("subscriptions").update({ status: "inactive" }).eq("email", email);
        break;

      default:
        break; // ignore events we don't act on
    }
  } catch {
    // best-effort — Paystack retries webhooks, so a transient DB error isn't fatal here
  }

  return NextResponse.json({ ok: true });
}
