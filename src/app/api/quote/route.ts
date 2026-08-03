import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validations/quote";
import { createServerClient } from "@/lib/supabase/client";
import { sendQuoteAlertToTeam, sendQuoteConfirmationToUser } from "@/lib/email/send";
import { estimateQuotePrice } from "@/mock/quote";
import { formatPriceRange } from "@/mock/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = quoteSchema.parse(body);

    const supabase = createServerClient();

    const { error } = await supabase.from("quote_requests").insert({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      company: data.company ?? null,
      pain_points: data.pains,
      template_id: data.template ?? null,
      budget_range: data.budget,
      timeline: data.timeline,
      features: data.features,
      contact_method: data.contactMethod,
      source: data.source ?? null,
    });

    if (error) throw error;

    const estimatedRange = formatPriceRange(estimateQuotePrice(data.template ?? "", data.features));

    // Fire emails in parallel — don't block response on failure
    await Promise.allSettled([
      sendQuoteAlertToTeam({ ...data, pains: data.pains, estimatedRange }),
      sendQuoteConfirmationToUser(data.name, data.email),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
