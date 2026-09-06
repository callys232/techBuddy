import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createServerClient } from "@/lib/supabase/client";

const SECRET = process.env.NOWPAYMENTS_IPN_SECRET ?? "";
interface Ipn { order_id: string; payment_status: string; payment_id?: string | number; price_amount?: number; [key: string]: unknown }
function sortKeys(value: unknown): unknown { if (Array.isArray(value)) return value.map(sortKeys); if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string,unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => [k,sortKeys(v)])); return value; }
function verified(payload: Ipn, sig: string) { const expected=crypto.createHmac("sha512",SECRET).update(JSON.stringify(sortKeys(payload))).digest("hex"); const a=Buffer.from(sig,"hex"), b=Buffer.from(expected,"hex"); return a.length===b.length&&crypto.timingSafeEqual(a,b); }

export async function POST(req: Request) {
  if (!SECRET) return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  const raw=await req.text(); let payload: Ipn;
  try { payload=JSON.parse(raw) as Ipn; } catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  const sig=req.headers.get("x-nowpayments-sig"); if(!sig||!verified(payload,sig)) return NextResponse.json({ error:"Invalid signature" },{status:401});
  if(!["confirmed","finished"].includes(payload.payment_status)) return NextResponse.json({ok:true});
  const [prefix,orderId]=payload.order_id?.split(":")??[]; if(prefix!=="premium"||!orderId) return NextResponse.json({ok:true,ignored:true});
  const supabase=createServerClient();
  const {data:order,error}=await supabase.from("payment_orders").select("*").eq("id",orderId).eq("provider","nowpayments").eq("product_key","premium-all-tools-month").maybeSingle();
  if(error||!order) return NextResponse.json({error:"Unknown payment order"},{status:400});
  if(order.currency!=="USD"||Number(payload.price_amount??0)+0.01<Number(order.amount)) return NextResponse.json({error:"Payment amount mismatch"},{status:400});
  try {
    const reference=String(payload.payment_id??order.id);
    const existing=await supabase.from("entitlements").select("id").eq("source","nowpayments").eq("source_reference",reference).eq("entitlement_key","premium-all-tools").maybeSingle();
    if(!existing.data){
      const {data:latest}=await supabase.from("entitlements").select("ends_at").eq("email",order.email).eq("entitlement_key","premium-all-tools").eq("source","nowpayments").order("ends_at",{ascending:false}).limit(1).maybeSingle();
      const base=latest?.ends_at&&new Date(latest.ends_at)>new Date()?new Date(latest.ends_at):new Date(); const endsAt=new Date(base.getTime()+30*86400000).toISOString();
      const {error:grantError}=await supabase.from("entitlements").insert({user_id:order.user_id,email:order.email,entitlement_key:"premium-all-tools",source:"nowpayments",source_reference:reference,ends_at:endsAt}); if(grantError) throw grantError;
    }
    const {error:updateError}=await supabase.from("payment_orders").update({status:"paid",updated_at:new Date().toISOString()}).eq("id",order.id); if(updateError) throw updateError;
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({error:"Webhook processing failed"},{status:500}); }
}
