import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { createServerClient } from "@/lib/supabase/client";
import { sendContactAlertToTeam } from "@/lib/email/send";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const supabase = createServerClient();
    const { error } = await supabase.from("contact_messages").insert(data);
    if (error) throw error;

    await sendContactAlertToTeam(data).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
