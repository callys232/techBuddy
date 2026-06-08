import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const resend = new Resend(process.env.RESEND_API_KEY ?? "");
const TEAM_EMAIL = process.env.TEAM_EMAIL ?? "team@techbuddy.ng";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://techbuddy.ng";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference") ?? req.nextUrl.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(`${BASE_URL}/templates?error=missing_ref`);
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  const data = await res.json();

  if (!data.status || data.data?.status !== "success") {
    return NextResponse.redirect(`${BASE_URL}/templates?error=payment_failed`);
  }

  const { email, metadata } = data.data;
  const templateName: string = metadata?.template_name ?? "your template";
  const buyerName: string   = metadata?.buyer_name    ?? "there";

  await Promise.all([
    resend.emails.send({
      from:    "TechBuddy <noreply@techbuddy.ng>",
      to:      email,
      subject: `🎉 Your ${templateName} template is ready`,
      html: `
        <p>Hi ${buyerName},</p>
        <p>Thanks for purchasing <strong>${templateName}</strong>!</p>
        <p>Our team will send your GitHub repository access invite to this email within 1 hour.</p>
        <p>In the meantime, feel free to <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}">WhatsApp us</a> if you have any questions.</p>
        <p>— TechBuddy Team</p>
      `,
    }),
    resend.emails.send({
      from:    "TechBuddy Payments <noreply@techbuddy.ng>",
      to:      TEAM_EMAIL,
      subject: `New template purchase: ${templateName}`,
      html: `
        <p><strong>${buyerName}</strong> (${email}) just purchased <strong>${templateName}</strong>.</p>
        <p>Reference: ${reference}</p>
        <p>Action: send GitHub repo access invite to ${email}</p>
      `,
    }),
  ]).catch(() => null);

  return NextResponse.redirect(
    `${BASE_URL}/templates/success?name=${encodeURIComponent(templateName)}&email=${encodeURIComponent(email)}`
  );
}
