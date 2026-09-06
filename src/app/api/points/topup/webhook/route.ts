import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { awardPoints, POINTS_PER_USD } from "@/lib/points";
import { createServerClient } from "@/lib/supabase/client";

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET ?? "";
interface Ipn { order_id: string; payment_status: string; payment_id?: string | number; price_amount?: number; [key: string]: unknown }
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => [k, sortKeys(v)]));
  return value;
}
function verified(payload: Ipn, signature: string) {
  const expected = crypto.createHmac("sha512", IPN_SECRET).update(JSON.stringify(sortKeys(payload))).digest("hex");
  const a = Buffer.from(signature, "hex"); const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!IPN_SECRET) return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  const raw = await req.text();
  let payload: Ipn;
  try { payload = JSON.parse(raw) as Ipn; } catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  const signature = req.headers.get("x-nowpayments-sig");
  if (!signature || !verified(payload, signature)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  if (!["confirmed", "finished"].includes(payload.payment_status)) return NextResponse.json({ ok: true });
  const [prefix, orderId] = payload.order_id?.split(":") ?? [];
  if (prefix !== "topup" || !orderId) return NextResponse.json({ ok: true });

  const supabase = createServerClient();
  const { data: order, error } = await supabase.from("payment_orders").select("id, email, amount, currency").eq("id", orderId).eq("provider", "nowpayments").eq("product_key", "points-topup").maybeSingle();
  if (error || !order) return NextResponse.json({ error: "Unknown payment order" }, { status: 400 });
  if (order.currency !== "USD" || Number(payload.price_amount ?? 0) + 0.01 < Number(order.amount)) return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
  try {
    await awardPoints(order.email, Math.round(Number(order.amount) * POINTS_PER_USD), "crypto_topup", `nowpayments-topup:${payload.payment_id ?? order.id}`);
    const { error: updateError } = await supabase.from("payment_orders").update({ status: "paid", updated_at: new Date().toISOString() }).eq("id", order.id);
    if (updateError) throw updateError;
    return NextResponse.json({ ok: true });
  } catch (processingError: unknown) {
    return NextResponse.json({ error: processingError instanceof Error ? processingError.message : "Processing failed" }, { status: 500 });
  }
}
