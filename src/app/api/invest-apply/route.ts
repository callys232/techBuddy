import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);
const resend     = new Resend(process.env.RESEND_API_KEY ?? "");
const TEAM_EMAIL = process.env.TEAM_EMAIL ?? "team@techbuddy.ng";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, company, stage, investType, pitch, funding, url } = body ?? {};

  if (!name || !email || !pitch) {
    return NextResponse.json({ error: "name, email and pitch are required" }, { status: 400 });
  }

  await supabase.from("invest_applications").insert({
    name,
    email,
    company:     company ?? null,
    stage:       stage ?? null,
    invest_type: investType ?? null,
    pitch,
    funding:     funding ?? null,
    url:         url ?? null,
  }).then(() => null, () => null);

  await Promise.all([
    /* Confirmation to applicant */
    resend.emails.send({
      from:    "TechAgency <noreply@techbuddy.ng>",
      to:      email,
      subject: "We received your investment application",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for applying to partner with TechAgency Africa.</p>
        <p>We review every application personally and will get back to you within <strong>5 business days</strong>.</p>
        <p>What happens next:</p>
        <ol>
          <li>Our team reviews your pitch</li>
          <li>If there's a fit, we schedule a 30-minute discovery call</li>
          <li>We agree on terms and start building</li>
        </ol>
        <p>Questions? Reply to this email or WhatsApp us directly.</p>
        <p>— TechAgency Africa Team</p>
      `,
    }),
    /* Alert to team */
    resend.emails.send({
      from:    "TechAgency Applications <noreply@techbuddy.ng>",
      to:      TEAM_EMAIL,
      subject: `New investment application: ${company ?? name}`,
      html: `
        <h2>New Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company ?? "—"}</p>
        <p><strong>Stage:</strong> ${stage ?? "—"}</p>
        <p><strong>Investment type:</strong> ${investType ?? "—"}</p>
        <p><strong>Funding raised:</strong> ${funding ?? "—"}</p>
        <p><strong>URL:</strong> ${url ? `<a href="${url}">${url}</a>` : "—"}</p>
        <hr />
        <h3>Pitch</h3>
        <p>${pitch}</p>
      `,
    }),
  ]).catch(() => null);

  return NextResponse.json({ success: true });
}
