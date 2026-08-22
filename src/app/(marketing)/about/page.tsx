import type { Metadata } from "next";
import Link from "next/link";
import { PageVectors } from "@/components/bg/PageVectors";
import { STATS } from "@/mock/stats";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { ALL_PROJECTS } from "@/mock/portfolio";
import { IconTrendingUp } from "@tabler/icons-react";

/** A handful of concept builds that show the range of problems we design for —
 *  same "target outcome, not a measured result" disclosure as /portfolio. We're
 *  a small, growing studio without a public client roster yet, so this shows
 *  how we think rather than overclaiming who we've worked with. */
const DESIGN_EXAMPLES = ALL_PROJECTS.filter((p) =>
  ["HealthPay", "AgriMarket", "LogiSync"].includes(p.name)
);

export const metadata: Metadata = {
  title: "About TechAgency — Who We Are",
  description:
    "We're a Lagos-born digital product studio building world-class software for ambitious businesses everywhere. Meet the team, learn our story, and understand how we work.",
};

/** Role-based, not named individuals — this studio is small and growing, and
 *  we'd rather describe how the work gets done than invent a leadership team
 *  that doesn't exist yet. */
const CAPABILITIES = [
  {
    role: "Engineering",
    desc: "Full-stack builds across Next.js, React Native, and Node — from first commit to production-scale systems, with payment and fintech integrations a specialty.",
    skills: ["Next.js", "React Native", "PostgreSQL", "Fintech"],
    initial: "E",
  },
  {
    role: "Product Design",
    desc: "Interfaces designed for real-world constraints — low bandwidth, local payment rails, and accessibility treated as requirements, not afterthoughts.",
    skills: ["Figma", "User Research", "Design Systems", "Accessibility"],
    initial: "D",
  },
  {
    role: "DevOps & Infrastructure",
    desc: "CI/CD pipelines, cloud architecture, and monitoring set up so what ships stays up — and scales when it needs to.",
    skills: ["CI/CD", "Cloud", "Monitoring", "Security"],
    initial: "O",
  },
  {
    role: "Client Delivery",
    desc: "One point of contact from scoping to launch — direct communication, no handoffs between people you've never met.",
    skills: ["Scoping", "Communication", "Post-launch Support"],
    initial: "C",
  },
];

const VALUES = [
  {
    title: "Real-world constraints first",
    body: "We design for low-bandwidth environments, local payment rails, data compliance, and the real constraints of the markets we build for — wherever those markets are, not as an afterthought but as the primary requirement.",
  },
  {
    title: "Ship fast, maintain properly",
    body: "We believe in getting to production quickly and then maintaining relentlessly. A product launched and improved beats a perfect product delivered late every time.",
  },
  {
    title: "Transparent pricing",
    body: "No hidden costs. We tell you the range before we start, explain what drives the number, and stick to it. You always know exactly what you're paying for.",
  },
  {
    title: "Long-term partnerships",
    body: "We're not a one-off vendor — we design engagements so it makes sense to keep working together after launch, not just invoice you once.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-[var(--section-y)] overflow-hidden">
        <PageVectors variant="top-right" intensity={0.5} />
        <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-4">Our story</p>
          <h1 className="h-hero max-w-3xl">
            Built in Africa. Engineered for the World.
          </h1>
          <p className="mt-6 text-lg text-[var(--ink-muted)] max-w-2xl leading-relaxed">
            We started TechAgency in Lagos with a simple observation: fast-growing businesses were being underserved by generic agencies that didn&apos;t understand payments infrastructure, data compliance, or what it means to build for a user on a 3G connection.
          </p>
          <p className="mt-4 text-lg text-[var(--ink-muted)] max-w-2xl leading-relaxed">
            Today that means a vetted network of engineers across fintech, logistics, healthcare, and e-commerce — built to take on work from Lagos to London, at whatever size the project needs.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/portfolio" className="btn-primary h-11 px-7 text-sm">
              See our work
            </Link>
            <Link href="/contact" className="btn-ghost h-11 px-7 text-sm">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <RevealSection>
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)] py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[STATS.foundedYear, STATS.engineersInNetwork, STATS.productsShipped, STATS.countriesServed].map((s) => (
              <div key={s.id}>
                <p className="font-heading text-3xl font-extrabold text-[var(--ink)]">{s.value}</p>
                <p className="mt-1 text-sm text-[var(--ink-faint)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-[var(--section-y)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-3">How we work</p>
          <h2 className="h-section mb-12">What we believe</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="card-interactive p-6">
                <h3 className="font-heading font-bold text-[var(--ink)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── What we design toward ───────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-[var(--section-y)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-3">What that looks like</p>
          <h2 className="h-section mb-3">What we design toward</h2>
          <p className="text-sm text-[var(--ink-muted)] max-w-xl mb-12">
            We&apos;re a small, growing studio without a public client roster yet — so instead of
            case studies we can&apos;t back up, here&apos;s the kind of outcome we design for, worked
            through as concept builds. Same disclosure as our portfolio: these are targets, not measured results.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {DESIGN_EXAMPLES.map((p) => (
              <div key={p.name} className="card p-6 flex flex-col gap-3">
                <span className="font-mono text-[9px] uppercase tracking-wide rounded-full border border-[var(--border)] px-2 py-0.5 self-start text-[var(--ink-faint)]">
                  Concept build
                </span>
                <p className="font-heading font-bold text-[var(--ink)] leading-snug">{p.name}</p>
                <div className="flex items-start gap-2">
                  <IconTrendingUp size={14} className="text-[var(--brand)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{p.result}</p>
                </div>
                <p className="text-xs text-[var(--ink-faint)]">{p.client}</p>
              </div>
            ))}
          </div>
          <Link href="/portfolio" className="link-underline inline-block mt-8 text-sm font-semibold">
            See all concept builds →
          </Link>
        </div>
      </section>
      </RevealSection>

      {/* ── How we work ──────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-[var(--section-y)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-3">Our approach</p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--ink)] mb-3">
            How the work gets done
          </h2>
          <p className="text-sm text-[var(--ink-muted)] max-w-xl mb-12">
            We&apos;re a small, growing studio — every project runs through these four disciplines, whether that&apos;s one person wearing every hat or a full team, depending on scope.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((cap) => (
              <div key={cap.role} className="card p-6 flex flex-col gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)]/12 font-heading text-xl font-extrabold text-[var(--brand)]">
                  {cap.initial}
                </div>
                <p className="font-heading font-bold text-[var(--ink)] leading-snug">{cap.role}</p>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed flex-1">{cap.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cap.skills.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] rounded-full border border-[var(--border)] px-2 py-0.5 text-[var(--ink-muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-[var(--section-y)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-3">How we deliver</p>
          <h2 className="h-section mb-12">Our process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
            {[
              { step: "01", title: "Discovery", body: "We spend the first week understanding your business, users, and constraints — not just writing specs." },
              { step: "02", title: "Design & scope", body: "Interactive Figma prototypes, a fixed scope, and a transparent Naira range before any code is written." },
              { step: "03", title: "Build & iterate", body: "Weekly demos. Continuous deployment to a staging environment. You see real progress every 7 days." },
              { step: "04", title: "Launch & maintain", body: "Production deploy, knowledge transfer, and optional monthly maintenance plans to keep it running." },
            ].map((s, i) => (
              <div
                key={s.step}
                className={[
                  "p-6 border-[var(--border)]",
                  i < 3 ? "border-b lg:border-b-0 lg:border-r" : "",
                ].join(" ")}
              >
                <p className="font-mono text-2xl font-bold text-[var(--brand)]/30 mb-3">{s.step}</p>
                <h3 className="font-heading font-bold text-[var(--ink)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-[var(--section-y)] bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-[var(--container-px)] text-center">
          <h2 className="h-section mb-4">Ready to build together?</h2>
          <p className="text-[var(--ink-muted)] mb-8">
            Tell us what you&apos;re working on. We&apos;ll respond within 24 hours with a realistic scope and budget range.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-primary h-12 px-8">
              Get a free quote
            </Link>
            <Link href="/talent" className="btn-ghost h-12 px-8">
              Join our talent network
            </Link>
          </div>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
