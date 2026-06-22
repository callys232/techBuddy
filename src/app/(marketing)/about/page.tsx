import type { Metadata } from "next";
import Link from "next/link";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "About TechAgency — Who We Are",
  description:
    "We're a Lagos-based digital product studio building world-class software for African businesses. Meet the team, learn our story, and understand how we work.",
};

const TEAM = [
  {
    name: "Chukwuemeka Obi",
    role: "Co-founder & CTO",
    bio: "Full-stack engineer with 10+ years building fintech and logistics platforms. Previously led engineering at a Series B Nigerian startup. Expert in distributed systems and Paystack payment integrations.",
    skills: ["Next.js", "PostgreSQL", "DevOps", "Fintech"],
    initial: "C",
  },
  {
    name: "Adaeze Nwosu",
    role: "Co-founder & Head of Design",
    bio: "Product designer who has shipped interfaces used by millions across Nigeria and Ghana. Specialises in low-bandwidth UX and accessibility for African markets. Google Africa Scholar.",
    skills: ["Product Design", "Figma", "User Research", "Design Systems"],
    initial: "A",
  },
  {
    name: "Tunde Fashola",
    role: "Head of Engineering",
    bio: "Ex-Microsoft engineer who returned to Lagos to build the African tech ecosystem. Leads our 30+ engineer talent network. Deep expertise in React Native, cloud architecture, and DevOps automation.",
    skills: ["React Native", "Cloud", "Team Leadership", "CI/CD"],
    initial: "T",
  },
  {
    name: "Ngozi Eze",
    role: "Head of Client Success",
    bio: "Bridges the gap between technical teams and business stakeholders. Has managed over 35 product launches for Nigerian startups. Certified Scrum Master with expertise in remote team coordination.",
    skills: ["Project Management", "Scrum", "Client Relations", "Strategy"],
    initial: "N",
  },
];

const VALUES = [
  {
    title: "African context first",
    body: "We design for low-bandwidth environments, Naira payments, NDPR compliance, and the real constraints of African businesses — not as an afterthought but as the primary requirement.",
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
    body: "94% of our clients continue with us after the first project. We're not a one-off vendor — we want to grow with your business, not just invoice you once.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-[var(--section-y)] overflow-hidden">
        <PageVectors variant="top-right" intensity={0.5} />
        <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            Our story
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-6xl font-extrabold text-[var(--fg)] leading-[1.08] tracking-[-0.03em] max-w-3xl">
            Africa&apos;s Product Studio
          </h1>
          <p className="mt-6 text-lg text-[var(--fg)]/55 max-w-2xl leading-relaxed">
            We started TechAgency in Lagos with a simple observation: Nigerian businesses were being underserved by generic agencies that didn&apos;t understand Paystack, NDPR, or what it means to build for a user on a 3G connection.
          </p>
          <p className="mt-4 text-lg text-[var(--fg)]/55 max-w-2xl leading-relaxed">
            Today we&apos;re a 120-engineer network shipping products across fintech, logistics, healthcare, and e-commerce for clients from Lagos to Accra to Nairobi.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/portfolio"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-bold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              See our work
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 font-heading font-bold text-sm text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)] py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "2020", label: "Founded in Lagos" },
              { stat: "120+", label: "Engineers in network" },
              { stat: "35+",  label: "Products shipped" },
              { stat: "12",   label: "Nigerian states served" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="font-display text-3xl font-extrabold text-[var(--fg)]">{stat}</p>
                <p className="mt-1 text-sm text-[var(--fg)]/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-[var(--section-y)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            How we work
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)] mb-12">
            What we believe
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--primary)]/40 transition-colors"
              >
                <h3 className="font-display font-bold text-[var(--fg)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="py-[var(--section-y)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            The team
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)] mb-12">
            Who you&apos;ll work with
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg)] p-6 flex flex-col gap-4"
              >
                {/* Avatar */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/15 font-display text-xl font-extrabold text-[var(--primary)]">
                  {member.initial}
                </div>
                <div>
                  <p className="font-display font-bold text-[var(--fg)] leading-snug">{member.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--primary)] mt-0.5">{member.role}</p>
                </div>
                <p className="text-xs text-[var(--fg)]/55 leading-relaxed flex-1">{member.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] rounded-full border border-[var(--border)] px-2 py-0.5 text-[var(--fg)]/50"
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

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="py-[var(--section-y)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            How we deliver
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)] mb-12">
            Our process
          </h2>
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
                <p className="font-mono text-2xl font-bold text-[var(--primary)]/30 mb-3">{s.step}</p>
                <h3 className="font-display font-bold text-[var(--fg)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--fg)]/55 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-[var(--section-y)] bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-[var(--container-px)] text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)] mb-4">
            Ready to build together?
          </h2>
          <p className="text-[var(--fg)]/50 mb-8">
            Tell us what you&apos;re working on. We&apos;ll respond within 24 hours with a realistic scope and budget range.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-heading font-bold text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Get a free quote
            </Link>
            <Link
              href="/talent"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-heading font-bold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              Join our talent network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
