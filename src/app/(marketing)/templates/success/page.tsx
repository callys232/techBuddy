import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Purchase Successful — Check Your Email",
  description: "Your template purchase was successful. GitHub repository access will be sent within 1 hour.",
};

interface Props {
  searchParams: Promise<{ name?: string; email?: string; error?: string }>;
}

export default async function TemplatePurchaseSuccessPage({ searchParams }: Props) {
  const { name, email, error } = await searchParams;

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-[var(--container-px)] text-center">
        <p className="font-mono text-red-400 text-xs uppercase tracking-[0.25em] mb-4">Payment issue</p>
        <h1 className="font-display text-4xl font-extrabold text-[var(--fg)] mb-4">Payment not completed</h1>
        <p className="text-[var(--fg)]/50 max-w-sm mb-8">
          {error === "payment_failed"
            ? "The payment was not completed. No charge was made."
            : "Something went wrong verifying your payment. Contact us if you were charged."}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/templates" className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity">
            Try again
          </Link>
          <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] transition-all">
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  const waMessage = encodeURIComponent(`Hi! I just purchased the ${name ?? "template"} template. My email is ${email ?? ""}.`);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-[var(--container-px)] text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-6">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="17" stroke="#38BDF8" strokeWidth="1.5" />
          <path d="M10 18.5l5.5 5.5 10.5-11" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-3">Payment successful</p>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--fg)] mb-4">
        {name ? `${name} is yours!` : "Purchase complete!"}
      </h1>
      <p className="text-[var(--fg)]/50 max-w-md mb-10 leading-relaxed">
        GitHub repository access will be sent to{" "}
        <span className="text-[var(--primary)] font-mono">{email ?? "your email"}</span>{" "}
        within <strong className="text-[var(--fg)]/70">1 hour</strong>. Check your spam folder if you don&apos;t see it.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 max-w-2xl w-full mb-10">
        {[
          { n: "01", title: "Check email",     body: "GitHub invite lands within 1 hour" },
          { n: "02", title: "Accept invite",   body: "Clone the repo and follow the deploy guide" },
          { n: "03", title: "Go live",         body: "Deploy to Vercel in under 5 minutes" },
        ].map((step) => (
          <div key={step.n} className="glass rounded-[var(--radius-card)] border border-[var(--border)] p-5 text-left">
            <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-widest mb-2">{step.n}</p>
            <p className="font-heading font-semibold text-[var(--fg)] mb-1">{step.title}</p>
            <p className="text-xs text-[var(--fg)]/45">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000"}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-7 font-semibold text-white hover:bg-emerald-600 transition-colors active:scale-95"
        >
          Chat on WhatsApp
        </a>
        <Link
          href="/templates"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--fg)] transition-all"
        >
          Browse more templates
        </Link>
      </div>
    </div>
  );
}
