import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServerClient } from "@/lib/supabase/client";

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET ?? "";

interface NowPaymentsIpn {
  order_id: string;
  payment_status: string;
  [key: string]: unknown;
}

/** NOWPayments signs the IPN body as HMAC-SHA512 of the JSON re-serialized with
 *  keys sorted alphabetically (recursively) and no extra whitespace. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeys(v)])
    );
  }
  return value;
}

function verifySignature(payload: NowPaymentsIpn, signature: string): boolean {
  const sorted = JSON.stringify(sortKeys(payload));
  const expected = crypto.createHmac("sha512", IPN_SECRET).update(sorted).digest("hex");
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
}

/** NOWPayments IPN webhook — verifies the HMAC signature, then grants 30 days
 *  of Resume Premium on a finished/confirmed payment. */
export async function POST(req: Request) {
  if (!IPN_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-nowpayments-sig");
  const payload = JSON.parse(raw) as NowPaymentsIpn;

  if (!signature || !verifySignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const email = payload.order_id?.split(":")[1]?.toLowerCase().trim();
  if (!email) return NextResponse.json({ ok: true }); // nothing to attribute this to

  if (payload.payment_status === "finished" || payload.payment_status === "confirmed") {
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const supabase = createServerClient();

    try {
      await supabase.from("subscriptions").upsert(
        {
          email,
          status: "active",
          plan: "Resume Premium (Crypto)",
          paystack_customer_code: null,
          paystack_subscription_code: null,
          current_period_end: periodEnd,
        },
        { onConflict: "email" }
      );
    } catch {
      // best-effort — NOWPayments retries IPNs, so a transient DB error isn't fatal here
    }
  }

  return NextResponse.json({ ok: true });
}
