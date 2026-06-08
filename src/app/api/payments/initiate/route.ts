import { NextResponse } from "next/server";
import { ALL_TEMPLATES } from "@/mock/templates";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://techbuddy.ng";

export async function POST(req: Request) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const { templateName, email, name } = body ?? {};

  if (!templateName || !email || !name) {
    return NextResponse.json({ error: "templateName, email and name are required" }, { status: 400 });
  }

  const template = ALL_TEMPLATES.find((t) => t.name === templateName);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  /* Deposit amount = midpoint of priceRange in kobo */
  const midNaira  = Math.round((template.priceRange.min + template.priceRange.max) / 2) * 1000;
  const amountKobo = midNaira * 100;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      currency: "NGN",
      callback_url: `${BASE_URL}/api/payments/verify`,
      metadata: {
        custom_fields: [
          { display_name: "Name",     variable_name: "name",          value: name },
          { display_name: "Template", variable_name: "template_name", value: templateName },
        ],
        template_name: templateName,
        buyer_name: name,
      },
    }),
  });

  const data = await res.json();

  if (!data.status) {
    return NextResponse.json({ error: data.message ?? "Paystack error" }, { status: 502 });
  }

  return NextResponse.json({ authorizationUrl: data.data.authorization_url });
}
