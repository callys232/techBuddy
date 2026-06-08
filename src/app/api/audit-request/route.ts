import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);
const resend    = new Resend(process.env.RESEND_API_KEY ?? "");
const TEAM_EMAIL = process.env.TEAM_EMAIL ?? "team@techbuddy.ng";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, url, auditTypes } = body ?? {};

  if (!name || !email || !url) {
    return NextResponse.json({ error: "name, email and url are required" }, { status: 400 });
  }

  await supabase.from("audit_requests").insert({ name, email, url, audit_types: auditTypes ?? [] }).then(() => null, () => null);

  await Promise.all([
    resend.emails.send({
      from:    "TechBuddy <noreply@techbuddy.ng>",
      to:      email,
      subject: "Your free tech audit request — we're on it",
      html: `
        <p>Hi ${name},</p>
        <p>We received your audit request for <strong>${url}</strong>.</p>
        <p>Our engineers will review the following:</p>
        <ul>${(auditTypes ?? []).map((t: string) => `<li>${t}</li>`).join("")}</ul>
        <p>Expect your audit report within <strong>48 hours</strong>.</p>
        <p>— TechBuddy Team</p>
      `,
    }),
    resend.emails.send({
      from:    "TechBuddy Audits <noreply@techbuddy.ng>",
      to:      TEAM_EMAIL,
      subject: `New audit request from ${name}`,
      html: `
        <p><strong>${name}</strong> (${email}) requested an audit for: <a href="${url}">${url}</a></p>
        <p>Audit types: ${(auditTypes ?? []).join(", ")}</p>
        <p>Respond within 48 hours.</p>
      `,
    }),
  ]).catch(() => null);

  return NextResponse.json({ success: true });
}
