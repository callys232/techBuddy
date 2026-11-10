import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/contact";
import { createServerClient } from "@/lib/supabase/client";
import { getResendClient } from "@/lib/email/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = newsletterSchema.parse(body);

    try {
      const supabase = createServerClient();
      const { error } = await supabase
        .from("newsletter_subs")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert(
          { email: data.email, tags: data.tags ?? [], status: "active" } as any,
          { onConflict: "email" },
        );
      if (error) console.error("Supabase newsletter_subs error:", error);
    } catch (dbErr) {
      console.warn("Supabase newsletter storage warning:", dbErr);
    }

    /* Welcome email */
    const resend = getResendClient();
    if (resend) {
      await resend.emails
        .send({
          from: "TechBuddy <noreply@techbuddy.ng>",
          to: data.email,
          subject: "Welcome to the TechBuddy newsletter",
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
          <p>— TechBuddy</p>
        `,
        })
        .catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
