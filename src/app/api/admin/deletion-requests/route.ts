import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/client";

async function requireAdmin(req: Request) {
  const user = await getVerifiedUser(req);
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  return user && admins.includes(user.email) ? user : null;
}

export async function GET(req: Request) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { data, error } = await createServerClient().from("account_deletion_requests").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Could not load requests" }, { status: 500 });
  return NextResponse.json({ requests: data });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.id || !["approved", "rejected"].includes(body?.decision)) return NextResponse.json({ error: "Valid id and decision required" }, { status: 400 });
  const supabase = createServerClient();
  const { data: request } = await supabase.from("account_deletion_requests").select("*").eq("id", body.id).eq("status", "pending").maybeSingle();
  if (!request) return NextResponse.json({ error: "Pending request not found" }, { status: 404 });
  if (body.decision === "rejected") {
    const { error } = await supabase.from("account_deletion_requests").update({ status: "rejected", admin_note: body.note ?? null, reviewed_by: admin.email, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", request.id);
    if (error) return NextResponse.json({ error: "Could not reject request" }, { status: 500 });
    return NextResponse.json({ ok: true, status: "rejected" });
  }
  const { error: updateError } = await supabase.from("account_deletion_requests").update({ status: "approved", admin_note: body.note ?? null, reviewed_by: admin.email, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", request.id);
  if (updateError) return NextResponse.json({ error: "Could not approve request" }, { status: 500 });
  const { error: deleteError } = await supabase.auth.admin.deleteUser(request.user_id, true);
  if (deleteError) return NextResponse.json({ error: "Approved, but auth deletion failed; retry from the admin queue." }, { status: 500 });
  await supabase.from("account_deletion_requests").update({ status: "completed", updated_at: new Date().toISOString() }).eq("id", request.id);
  return NextResponse.json({ ok: true, status: "completed" });
}
