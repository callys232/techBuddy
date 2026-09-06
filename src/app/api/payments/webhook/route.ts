import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServerClient } from "@/lib/supabase/client";

const SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
interface Event { event: string; data: { id?: string | number; reference?: string; amount?: number; currency?: string; status?: string; subscription_code?: string; next_payment_date?: string; customer?: { email?: string; customer_code?: string }; metadata?: { order_id?: string; product?: string } } }

export async function POST(req: Request) {
  if (!SECRET) return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const expected = crypto.createHmac("sha512", SECRET).update(raw).digest("hex");
  if (!signature || signature !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const event = JSON.parse(raw) as Event;
  const orderId = event.data.metadata?.order_id;
  if (!orderId || event.data.metadata?.product !== "premium-all-tools-month") return NextResponse.json({ ok: true, ignored: true });
  const supabase = createServerClient();
  const eventId = `${event.event}:${event.data.id ?? event.data.reference ?? orderId}`;
  const { error: claimError } = await supabase.from("webhook_events").insert({ provider: "paystack", provider_event_id: eventId, event_type: event.event, payload: event as unknown as Record<string, unknown> });
  if (claimError?.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
  if (claimError) return NextResponse.json({ error: "Could not record event" }, { status: 500 });
  try {
    const { data: order } = await supabase.from("payment_orders").select("*").eq("id", orderId).eq("provider", "paystack").maybeSingle();
    if (!order) throw new Error("Unknown payment order");
    const email = event.data.customer?.email?.toLowerCase().trim();
    if (!email || email !== order.email || event.data.currency !== order.currency || Number(event.data.amount ?? 0) < Number(order.amount) * 100) throw new Error("Payment does not match order");
    if (["charge.success", "subscription.create"].includes(event.event)) {
      await supabase.from("payment_orders").update({ status: "paid", provider_reference: event.data.reference ?? order.provider_reference, updated_at: new Date().toISOString() }).eq("id", order.id);
      await supabase.from("entitlements").upsert({ user_id: order.user_id, email: order.email, entitlement_key: "premium-all-tools", source: "paystack", source_reference: event.data.subscription_code ?? event.data.reference ?? order.id, status: "active", ends_at: event.data.next_payment_date ?? null, updated_at: new Date().toISOString() }, { onConflict: "source,source_reference,entitlement_key" });
    } else if (["subscription.disable", "invoice.payment_failed"].includes(event.event)) {
      await supabase.from("entitlements").update({ status: "revoked", updated_at: new Date().toISOString() }).eq("source", "paystack").eq("source_reference", event.data.subscription_code ?? "");
    }
    await supabase.from("webhook_events").update({ status: "processed", processed_at: new Date().toISOString() }).eq("provider", "paystack").eq("provider_event_id", eventId);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    await supabase.from("webhook_events").update({ status: "failed", error: error instanceof Error ? error.message : "Processing failed" }).eq("provider", "paystack").eq("provider_event_id", eventId);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
