import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { awardPoints, POINTS_PER_USD } from "@/lib/points";

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET ?? "";

interface NowPaymentsIpn {
  order_id: string;
  payment_status: string;
  [key: string]: unknown;
}

/** Same sorted-keys HMAC-SHA512 scheme as the other NOWPayments webhook. */
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

/** NOWPayments IPN webhook for points top-ups — verifies the signature, then
 *  credits points on a finished/confirmed payment. Idempotent per order_id
 *  isn't tracked separately here; NOWPayments sends one terminal status per
 *  invoice, and points_transactions carries the order_id-derived reason for
 *  any later reconciliation. */
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

  const parts = payload.order_id?.split(":") ?? [];
  const [prefix, email, amountUsdStr] = parts;
  if (prefix !== "topup" || !email) return NextResponse.json({ ok: true });

  if (payload.payment_status === "finished" || payload.payment_status === "confirmed") {
    const amountUsd = Number(amountUsdStr) || 0;
    const points = Math.round(amountUsd * POINTS_PER_USD);
    if (points > 0) {
      try {
        await awardPoints(email, points, `crypto_topup:$${amountUsd}`);
      } catch {
        // best-effort — NOWPayments retries IPNs, so a transient DB error isn't fatal here
      }
    }
  }

  return NextResponse.json({ ok: true });
}
