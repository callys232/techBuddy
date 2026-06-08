import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quote Received — We'll Be in Touch",
  description: "We received your quote request and will respond within 24 hours. Book a discovery call to fast-track your project.",
};

const NEXT_STEPS = [
  {
    n:    "01",
    title: "We review your brief",
    body:  "Our team reads every detail of your request within the next few hours and assigns the right engineers to scope your project.",
    time:  "Within 4 hours",
  },
  {
    n:    "02",
    title: "You get a tailored proposal",
    body:  "A detailed scope, timeline, and pricing estimate — no vague quotes. We'll send it to your email and WhatsApp.",
    time:  "Within 24 hours",
  },
  {
    n:    "03",
    title: "We kick off",
    body:  "After you approve the proposal, we sign a simple agreement and spin up your project workspace. First milestone delivered in week 1.",
    time:  "After approval",
  },
];

export default function QuoteConfirmPage() {
  const waNumber  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";
  const waMessage = encodeURIComponent("Hi! I just submitted a quote request and would love to fast-track the discussion.");

  return (
    <div className="min-h-screen bg-[var(--bg)] px-[var(--container-px)] py-[var(--section-y)]">
      <div className="max-w-2xl mx-auto">

        {/* ── Success header ────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-6">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
              <circle cx="18" cy="18" r="17" stroke="#38BDF8" strokeWidth="1.5" />
              <path d="M10 18.5l5.5 5.5 10.5-11" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-3">
            Quote Received
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--fg)] mb-4">
            You&apos;re on the list!
          </h1>
          <p className="text-[var(--fg)]/50 max-w-md mx-auto leading-relaxed">
            We&apos;ve received your brief and will send a detailed proposal to your email within 24 hours.
            In the meantime, book a discovery call to fast-track things.
          </p>
        </div>

        {/* ── What happens next ─────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-6 text-center">
            What happens next
          </p>
          <div className="relative">
            <div className="absolute left-[27px] top-8 bottom-8 w-px bg-[var(--border)] hidden sm:block" aria-hidden />
            <div className="flex flex-col gap-6">
              {NEXT_STEPS.map((step) => (
                <div key={step.n} className="flex gap-5 items-start">
                  <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)] font-mono text-sm font-bold z-10">
                    {step.n}
                  </div>
                  <div className="pt-3 pb-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <p className="font-heading font-semibold text-[var(--fg)]">{step.title}</p>
                      <span className="inline-flex items-center rounded-full border border-[var(--border)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--fg)]/40">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--fg)]/50 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA actions ───────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 glass rounded-[var(--radius-card)] p-6 hover:border-emerald-500/40 border border-[var(--border)] transition-colors group"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#22c55e" className="mb-1" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="font-heading font-semibold text-[var(--fg)] group-hover:text-emerald-400 transition-colors">
              Message us on WhatsApp
            </p>
            <p className="text-xs text-[var(--fg)]/40">Skip the queue — chat directly with our team.</p>
          </a>

          <div className="flex flex-col gap-2 glass rounded-[var(--radius-card)] p-6 border border-[var(--border)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-1" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p className="font-heading font-semibold text-[var(--fg)]">Book a discovery call</p>
            <p className="text-xs text-[var(--fg)]/40 mb-3">30 minutes to scope your project in detail.</p>
            <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--border)] rounded-lg py-4 text-[var(--fg)]/20 text-xs">
              Cal.com embed coming soon
            </div>
          </div>
        </div>

        {/* ── Retainer upsell ───────────────────────────────────────────── */}
        <div className="glass rounded-[var(--radius-card)] border border-[var(--border)] p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-1">
                Keep the momentum going
              </p>
              <p className="font-heading font-semibold text-[var(--fg)] mb-1">
                Most clients continue with a maintenance plan after launch
              </p>
              <p className="text-sm text-[var(--fg)]/45">
                From ₦150k/mo — updates, monitoring, priority support and monthly reports.
              </p>
            </div>
            <Link
              href="/services/maintenance"
              className="shrink-0 inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all active:scale-95"
            >
              See plans →
            </Link>
          </div>
        </div>

        {/* ── Nav links ─────────────────────────────────────────────────── */}
        <div className="text-center flex flex-wrap gap-6 justify-center">
          <Link
            href="/portfolio"
            className="text-sm text-[var(--fg)]/40 hover:text-[var(--primary)] transition-colors"
          >
            Browse our portfolio →
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--fg)]/40 hover:text-[var(--primary)] transition-colors"
          >
            Back to home →
          </Link>
        </div>
      </div>
    </div>
  );
}
