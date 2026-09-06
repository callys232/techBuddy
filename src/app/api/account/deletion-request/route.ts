import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data, error } = await createServerClient().from("account_deletion_requests")
    .select("id, status, reason, admin_note, created_at, reviewed_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load deletion request" }, { status: 500 });
  return NextResponse.json({ request: data });
}

export async function POST(req: Request) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 500) : null;
  const supabase = createServerClient();
  const { data: existing } = await supabase.from("account_deletion_requests").select("id, status").eq("user_id", user.id).eq("status", "pending").maybeSingle();
  if (existing) return NextResponse.json({ request: existing, message: "Your request is already awaiting admin review." });
  const { data, error } = await supabase.from("account_deletion_requests").insert({ user_id: user.id, email: user.email, reason }).select("id, status, created_at").single();
  if (error) return NextResponse.json({ error: "Could not submit deletion request" }, { status: 500 });
  return NextResponse.json({ request: data, message: "Request submitted for manual admin approval." }, { status: 201 });
}

export async function DELETE(req: Request) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { error } = await createServerClient().from("account_deletion_requests").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("user_id", user.id).eq("status", "pending");
  if (error) return NextResponse.json({ error: "Could not cancel request" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
