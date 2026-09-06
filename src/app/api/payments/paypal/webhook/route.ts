import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/client";
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API } from "@/lib/paypal";

const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID ?? "";

interface PaypalResource {
  id?: string;
  custom_id?: string;
  subscriber?: { email_address?: string };
  billing_info?: { next_billing_time?: string };
}

interface PaypalEvent {
  event_type: string;
  resource: PaypalResource;
}

/** PayPal has no local HMAC scheme — signature verification is itself an API
 *  call, so we round-trip the transmission headers + raw body back to PayPal. */
async function verifyWebhook(token: string, headers: Headers, rawBody: unknown): Promise<boolean> {
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_time: headers.get("paypal-transmission-time"),
      cert_url: headers.get("paypal-cert-url"),
      auth_algo: headers.get("paypal-auth-algo"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      webhook_id: WEBHOOK_ID,
      webhook_event: rawBody,
    }),
  });
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

/** PayPal webhook — verifies via PayPal's own verification endpoint, then keeps
 *  the subscriptions table in sync with billing state. */
export async function POST(req: Request) {
  if (!paypalConfigured() || !WEBHOOK_ID) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const event = JSON.parse(raw) as PaypalEvent;

  try {
    const token = await getPaypalAccessToken();
    const verified = await verifyWebhook(token, req.headers, event);
    if (!verified) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
  }

  const customParts = event.resource.custom_id?.split(":") ?? [];
  const email = (customParts.length > 1 ? customParts.slice(1).join(":") : event.resource.custom_id ?? event.resource.subscriber?.email_address ?? "").toLowerCase().trim();
  if (!email) return NextResponse.json({ ok: true }); // nothing to attribute this to

  const supabase = createServerClient();

  try {
    switch (event.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await supabase.from("subscriptions").upsert(
          {
            email,
            status: "active",
            plan: "Resume Premium",
            paystack_customer_code: null,
            paystack_subscription_code: event.resource.id ?? null,
            current_period_end: event.resource.billing_info?.next_billing_time ?? null,
          },
          { onConflict: "email" }
        );
        break;

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "PAYMENT.SALE.DENIED":
        await supabase.from("subscriptions").update({ status: "inactive" }).eq("email", email);
        break;

      default:
        break; // ignore events we don't act on
    }
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    // best-effort — PayPal retries webhooks, so a transient DB error isn't fatal here
  }

  return NextResponse.json({ ok: true });
}
