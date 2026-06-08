import type { Metadata } from "next";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Talent Hub — Hire Vetted Nigerian Engineers or Join the Network",
  description:
    "TechBuddy connects African businesses with pre-vetted full-stack engineers, DevOps specialists, mobile developers and product designers — ready to build in days, not months.",
  keywords: [
    "hire Nigerian developers", "vetted African engineers", "remote developers Nigeria",
    "tech talent Lagos", "hire fintech developer Africa", "join tech network Nigeria",
    "African software engineers", "product designers Nigeria",
  ],
  openGraph: {
    title: "Nigeria's Vetted Tech Talent — Hire or Join | TechBuddy",
    description:
      "Pre-vetted African engineers available to hire. Join a growing network of builders working on products that matter.",
  },
};

const ROLES = [
  { title: "Full-Stack Engineer", stack: "Next.js · Node.js · PostgreSQL", type: "Contract / Full-time", open: true },
  { title: "Mobile Developer",    stack: "React Native · Expo · Supabase",  type: "Contract",            open: true },
  { title: "DevOps Engineer",     stack: "Docker · K8s · Terraform · GCP",  type: "Full-time",           open: true },
  { title: "Product Designer",    stack: "Figma · FigJam · Prototyping",    type: "Contract",            open: true },
  { title: "Backend Engineer",    stack: "Go · Python · Redis · Kafka",     type: "Full-time",           open: false },
  { title: "QA / Test Engineer",  stack: "Playwright · Cypress · k6",      type: "Contract",            open: false },
];

const BENEFITS = [
  { icon: "🌍", title: "Remote-first",         body: "Work from anywhere in Africa — we are fully distributed, async-first." },
  { icon: "💵", title: "USD-equivalent pay",   body: "Competitive rates benchmarked against global markets, paid in your currency." },
  { icon: "📚", title: "Learning budget",      body: "₦300k/year for courses, conferences and certifications — no questions asked." },
  { icon: "🚀", title: "Ship real products",   body: "Work on high-growth startups and enterprise systems that serve millions." },
  { icon: "🤝", title: "Community & mentors",  body: "Peer reviews, weekly mob sessions and access to senior engineers." },
  { icon: "📈", title: "Career growth",        body: "Clear level ladder — junior to staff — with quarterly review cycles." },
];

const STEPS = [
  { n: "01", title: "Apply",               body: "Submit your profile and GitHub / portfolio links. No CV required." },
  { n: "02", title: "Technical screen",   body: "A 90-min async take-home challenge relevant to the role you're applying for." },
  { n: "03", title: "Culture call",       body: "30-min video call to align on values, working style and project fit." },
  { n: "04", title: "Start building",     body: "Get matched to a project within 5 business days. Ship your first PR in week 1." },
];

const STATS = [
  { value: "120+", label: "Engineers vetted" },
  { value: "35+",  label: "Active projects" },
  { value: "94%",  label: "Client re-hire rate" },
  { value: "5 days", label: "Avg. placement time" },
];

export default function TalentPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="top-right" intensity={0.7} />
        <div className="relative z-10 max-w-3xl">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-5">
            Talent Hub
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-6">
            Nigeria&apos;s Vetted Tech Talent,<br />Ready to Build
          </h1>
          <p className="text-lg text-[var(--fg)]/60 max-w-xl mb-10 leading-relaxed">
            Pre-screened engineers, designers and DevOps specialists — matched to your project in days.
            Or join our network and work on products that matter.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#hire"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95"
            >
              Hire an engineer
            </a>
            <a
              href="#join"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all active:scale-95"
            >
              Join the network
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="px-[var(--container-px)] py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-[var(--primary)] mb-1">{s.value}</p>
              <p className="text-sm text-[var(--fg)]/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hire section ──────────────────────────────────────────────────── */}
      <section id="hire" className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="mb-10">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-3">For Businesses</p>
          <h2 className="text-3xl font-bold text-[var(--fg)] mb-3">Open Roles &amp; Profiles</h2>
          <p className="text-[var(--fg)]/50 max-w-lg">
            Browse by skill. All engineers have passed a technical screen and culture assessment.
            Full profiles unlock after sign-in.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {ROLES.map((role) => (
            <div
              key={role.title}
              className="glass rounded-[var(--radius-card)] p-6 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-heading font-semibold text-[var(--fg)]">{role.title}</p>
                <span className={[
                  "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  role.open
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-[var(--fg)]/5 text-[var(--fg)]/30",
                ].join(" ")}>
                  {role.open ? "Open" : "Waitlist"}
                </span>
              </div>
              <p className="font-mono text-xs text-[var(--primary)]/80">{role.stack}</p>
              <p className="text-xs text-[var(--fg)]/40 mt-auto">{role.type}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-[var(--radius-card)] p-8 text-center max-w-lg mx-auto">
          <p className="font-heading font-semibold text-[var(--fg)] mb-2">View full engineer profiles</p>
          <p className="text-sm text-[var(--fg)]/50 mb-6">
            Detailed skills, past projects, availability and rates — available after a free account sign-in.
          </p>
          <a
            href="/sign-in?redirect=/talent/hire"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
          >
            Browse profiles
          </a>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] bg-[var(--surface)]">
        <div className="mb-10">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-3">Why join us</p>
          <h2 className="text-3xl font-bold text-[var(--fg)]">Built for African Builders</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-4">
              <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
              <div>
                <p className="font-heading font-semibold text-[var(--fg)] mb-1">{b.title}</p>
                <p className="text-sm text-[var(--fg)]/50 leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works / Join ───────────────────────────────────────────── */}
      <section id="join" className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="mb-10">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-3">For Engineers</p>
          <h2 className="text-3xl font-bold text-[var(--fg)] mb-3">How to Join the Network</h2>
          <p className="text-[var(--fg)]/50 max-w-lg">
            No gatekeeping. If you can build, we want you in the network.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-px bg-[var(--border)] hidden sm:block" aria-hidden />
          <div className="flex flex-col gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)] font-mono text-sm font-bold z-10">
                  {step.n}
                </div>
                <div className="pt-3">
                  <p className="font-heading font-semibold text-[var(--fg)] mb-1">{step.title}</p>
                  <p className="text-sm text-[var(--fg)]/50 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 glass rounded-[var(--radius-card)] p-8 text-center max-w-lg mx-auto">
          <p className="font-heading font-semibold text-[var(--fg)] mb-2">Ready to join?</p>
          <p className="text-sm text-[var(--fg)]/50 mb-6">
            Sign in and submit your engineer profile. We review applications every Monday.
          </p>
          <a
            href="/sign-in?redirect=/talent/join"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--primary)] px-7 font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all active:scale-95"
          >
            Apply to the network
          </a>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────────────────────── */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] bg-[var(--surface)] text-center border-t border-[var(--border)]">
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-3">Not sure where to start?</h2>
        <p className="text-[var(--fg)]/50 max-w-sm mx-auto mb-8">
          Message us on WhatsApp and we&apos;ll help you figure out whether hiring or joining is the right fit.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000"}?text=${encodeURIComponent("Hi! I'd like to know more about the talent network.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-white hover:bg-emerald-600 transition-colors active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </section>
    </div>
  );
}
