import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/contact";
import { createServerClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = newsletterSchema.parse(body);

    const supabase = createServerClient();
    const { error } = await supabase
      .from("newsletter_subs")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({ email: data.email, tags: data.tags ?? [], status: "active" } as any, { onConflict: "email" });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
