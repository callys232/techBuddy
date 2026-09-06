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
    "How our Lagos-based product studio scopes, designs, builds, and supports reliable software for businesses in Nigeria and worldwide.",
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
    body: "We reduce scope before we reduce quality, release useful software in manageable stages, and maintain it after launch. Every release should be small enough to evaluate and safe enough to operate.",
  },
  {
    title: "Transparent pricing",
    body: "We explain what drives cost, what is included, and which assumptions could change the estimate. Work outside the agreed scope is discussed before it begins.",
  },
  {
    title: "The simplest suitable solution",
    body: "Custom software is not always the right answer. If an existing tool, a smaller first release, or a process change solves the problem more responsibly, we will say so.",
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
            Software built around the realities of your business.
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
          <h2 className="h-section mb-3">
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
          <h2 className="h-section mb-12">What you can expect</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
            {[
              { step: "01", title: "Understand the problem", body: "We map the users, workflows, constraints, and business outcome before recommending technology." },
              { step: "02", title: "Define the right scope", body: "You receive a prioritised feature set, technical direction, delivery plan, and transparent cost range." },
              { step: "03", title: "Build with visibility", body: "Working software is demonstrated regularly, so decisions are made before problems become expensive." },
              { step: "04", title: "Launch responsibly", body: "We handle testing, deployment, monitoring, documentation, and knowledge transfer, with ongoing support available." },
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
          <h2 className="h-section mb-4">Start with the problem you need to solve.</h2>
          <p className="text-[var(--ink-muted)] mb-8">
            Tell us what you&apos;re working on. We&apos;ll respond within 24 hours with a realistic scope and budget range.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-primary h-12 px-8">
              Discuss your project
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
