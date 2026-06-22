import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validations/contact";
import { createServerClient } from "@/lib/supabase/client";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

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

    /* Welcome email */
    await resend.emails.send({
      from:    "TechAgency Africa <noreply@techbuddy.ng>",
      to:      data.email,
      subject: "Welcome to the TechAgency newsletter",
      html: `
        <p>Welcome aboard 👋</p>
        <p>You'll hear from us roughly twice a month with:</p>
        <ul>
          <li>Deep-dives on building software for African markets</li>
          <li>Nigerian tech news worth reading</li>
          <li>Behind-the-scenes from products we're shipping</li>
          <li>Free resources and tools for founders and engineers</li>
        </ul>
        <p>No spam. Unsubscribe any time by replying "unsubscribe" to any email.</p>
        <p>In the meantime, explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng"}/blog">blog</a> or get a <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://techbuddy.ng"}/quote">free project quote</a>.</p>
        <p>— TechAgency Africa</p>
      `,
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
