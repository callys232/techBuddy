import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServerClient } from "@/lib/supabase/client";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

interface StripeSubscriptionObject {
  id: string;
  customer: string;
  status: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  metadata?: { email?: string };
}

interface StripeCheckoutSessionObject {
  customer_email?: string;
  customer?: string;
  subscription?: string;
  metadata?: { email?: string };
}

interface StripeEvent {
  type: string;
  data: { object: StripeSubscriptionObject | StripeCheckoutSessionObject };
}

/** Verifies Stripe's `t=...,v1=...` signature scheme: HMAC-SHA256 of `${t}.${payload}`. */
function verifySignature(payload: string, header: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(`${timestamp}.${payload}`).digest("hex");
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
}

async function fetchSubscription(id: string): Promise<StripeSubscriptionObject> {
  const res = await fetch(`https://api.stripe.com/v1/subscriptions/${id}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET}` },
  });
  return res.json();
}

/** Stripe webhook — verifies the signature before trusting anything in the
 *  payload, then keeps the subscriptions table in sync with billing state. */
export async function POST(req: Request) {
  if (!STRIPE_SECRET || !WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signatureHeader = req.headers.get("stripe-signature");
  if (!signatureHeader || !verifySignature(raw, signatureHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as StripeEvent;
  const supabase = createServerClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as StripeCheckoutSessionObject;
        const email = (session.metadata?.email ?? session.customer_email ?? "").toLowerCase().trim();
        if (!email || !session.subscription) break;

        const sub = await fetchSubscription(session.subscription);
        await supabase.from("subscriptions").upsert(
          {
            email,
            status: "active",
            plan: "Resume Premium",
            paystack_customer_code: null,
            paystack_subscription_code: sub.id,
            current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          },
          { onConflict: "email" }
        );
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as StripeSubscriptionObject;
        const email = (sub.metadata?.email ?? "").toLowerCase().trim();
        if (!email) break;

        await supabase
          .from("subscriptions")
          .update({
            status: sub.status === "active" ? "active" : sub.cancel_at_period_end ? "non-renewing" : "inactive",
            current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          })
          .eq("email", email);
        break;
      }

      case "customer.subscription.deleted":
      case "invoice.payment_failed": {
        const sub = event.data.object as StripeSubscriptionObject;
        const email = (sub.metadata?.email ?? "").toLowerCase().trim();
        if (!email) break;

        await supabase.from("subscriptions").update({ status: "inactive" }).eq("email", email);
        break;
      }

      default:
        break; // ignore events we don't act on
    }
  } catch {
    // best-effort — Stripe retries webhooks, so a transient DB error isn't fatal here
  }

  return NextResponse.json({ ok: true });
}
