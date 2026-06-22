import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconSparkles } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Pricing — What It Costs to Build with TechAgency",
  description:
    "Transparent Naira pricing for web apps, mobile products, AI integration, fintech, and maintenance. No hidden fees.",
};

const PROJECT_TIERS = [
  {
    name: "Landing Page",
    range: "₦200k – ₦500k",
    duration: "2–4 weeks",
    desc: "A conversion-focused marketing page or company website. Perfect for validating an idea or launching a product fast.",
    includes: [
      "Up to 8 sections / pages",
      "Mobile-responsive design",
      "Contact form + CMS for content",
      "SEO basics + performance optimised",
      "2 rounds of revisions",
      "1 month post-launch support",
    ],
    cta: "Get a landing page quote",
    highlight: false,
  },
  {
    name: "MVP / Web App",
    range: "₦900k – ₦4M",
    duration: "8–14 weeks",
    desc: "A working product with user auth, core flows, and payment integration. The fastest path from idea to paying users.",
    includes: [
      "Full-stack Next.js application",
      "Authentication (email + social)",
      "Paystack / Flutterwave integration",
      "Admin dashboard",
      "Supabase database + API",
      "Deployment + CI/CD pipeline",
      "3 months post-launch support",
    ],
    cta: "Get an MVP quote",
    highlight: true,
  },
  {
    name: "Mobile App",
    range: "₦1.5M – ₦6M",
    duration: "10–18 weeks",
    desc: "iOS + Android from one React Native codebase. Offline support, push notifications, and app store submission included.",
    includes: [
      "React Native (iOS + Android)",
      "Offline-first architecture",
      "Push notifications",
      "Biometric authentication",
      "App store submission (both stores)",
      "3 months post-launch support",
    ],
    cta: "Get a mobile app quote",
    highlight: false,
  },
  {
    name: "Full Platform",
    range: "₦5M – ₦20M+",
    duration: "3–8 months",
    desc: "Multi-role SaaS platforms, fintech systems, or enterprise tools. Discovery, design, engineering, and DevOps included.",
    includes: [
      "Full product discovery & scoping",
      "UI/UX design + Figma prototype",
      "Complex multi-role permissions",
      "3rd-party API integrations",
      "Dedicated DevOps infrastructure",
      "Compliance (NDPR, PCI-DSS)",
      "6 months post-launch support",
    ],
    cta: "Discuss your platform",
    highlight: false,
  },
];

const RETAINER_TIERS = [
  {
    name: "Starter",
    price: "₦200k",
    period: "/month",
    desc: "Keep your product running smoothly with monthly maintenance and monitoring.",
    includes: [
      "Security patches & dependency updates",
      "99.5% uptime monitoring",
      "SSL & hosting management",
      "Monthly performance report",
      "Bug fixes (up to 4 hrs/mo)",
    ],
    cta: "Start Starter",
    highlight: false,
  },
  {
    name: "Growth",
    price: "₦450k",
    period: "/month",
    desc: "Active product development alongside maintenance. Ideal for products with a growing user base.",
    includes: [
      "Everything in Starter",
      "Up to 8 hrs of feature additions",
      "Priority WhatsApp support",
      "Monthly SEO + performance audit",
      "Quarterly security assessment",
      "Dedicated account manager",
    ],
    cta: "Start Growth",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "₦900k+",
    period: "/month",
    desc: "A dedicated engineer embedded in your team. For products that can't afford to be down.",
    includes: [
      "Everything in Growth",
      "Full-time dedicated engineer",
      "4-hour response SLA",
      "Slack / WhatsApp war room",
      "Bi-weekly strategy calls",
      "Custom integrations included",
    ],
    cta: "Contact us",
    highlight: false,
  },
];

const ADD_ONS = [
  { name: "UI/UX Design (per screen flow)", price: "₦80k – ₦250k" },
  { name: "Paystack / Flutterwave integration", price: "₦250k – ₦600k" },
  { name: "WhatsApp Business API bot", price: "₦250k – ₦1M" },
  { name: "AI chatbot / LLM integration", price: "₦400k – ₦3M" },
  { name: "NDPR compliance audit", price: "₦200k – ₦500k" },
  { name: "Security pentest", price: "₦300k – ₦1.5M" },
  { name: "Performance optimisation", price: "₦200k – ₦800k" },
  { name: "DevOps setup (CI/CD + cloud)", price: "₦300k – ₦1.2M" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[var(--section-y)] pb-16 text-center">
        <PageVectors variant="center" intensity={0.38} />
        <div className="relative z-10 mx-auto max-w-3xl px-[var(--container-px)]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
            Transparent pricing
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[var(--fg)] leading-[1.1] mb-4">
            What does it cost<br />to build with us?
          </h1>
          <p className="text-[var(--fg)]/50 text-lg leading-relaxed mb-6">
            Every project is different, but these ranges cover the vast majority of what we build.
            All prices are in Nigerian Naira. No hidden fees, no surprises.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tools/cost-estimator"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-heading font-semibold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              <IconSparkles size={14} className="opacity-80" />
              Get an instant estimate
            </Link>
            <Link
              href="/quote"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 font-heading font-semibold text-sm text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              Get a custom quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── One-off project pricing ───────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
            Project builds
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-10">One-off builds, delivered in full.</p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {PROJECT_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={[
                  "relative flex flex-col rounded-[var(--radius-card)] border p-6",
                  tier.highlight
                    ? "border-[var(--primary)] bg-[var(--primary)]/4 shadow-[0_0_32px_rgba(56,189,248,0.15)]"
                    : "border-[var(--border)] bg-[var(--bg)]",
                ].join(" ")}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)] uppercase tracking-wide">
                    Most popular
                  </span>
                )}
                <div className="mb-4">
                  <p className="font-heading font-semibold text-[var(--fg)] text-sm">{tier.name}</p>
                  <p className="font-display text-2xl font-extrabold text-[var(--fg)] mt-1">{tier.range}</p>
                  <p className="font-mono text-xs text-[var(--fg)]/35 mt-0.5">{tier.duration}</p>
                </div>
                <p className="text-xs text-[var(--fg)]/55 leading-relaxed mb-5">{tier.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[var(--fg)]/65">
                      <IconCheck size={12} className="text-[var(--primary)] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/quote?service=${encodeURIComponent(tier.name)}`}
                  className={[
                    "flex h-9 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    tier.highlight
                      ? "bg-[var(--primary)] text-[var(--bg)] hover:opacity-90"
                      : "border border-[var(--border)] text-[var(--fg)]/70 hover:border-[var(--primary)] hover:text-[var(--primary)]",
                  ].join(" ")}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Retainer / maintenance ────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">
            Monthly maintenance plans
          </h2>
          <p className="text-sm text-[var(--fg)]/45 mb-10">Keep your product running and growing after launch.</p>

          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl">
            {RETAINER_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={[
                  "relative flex flex-col rounded-[var(--radius-card)] border p-6",
                  tier.highlight
                    ? "border-[var(--primary)] bg-[var(--primary)]/4 shadow-[0_0_32px_rgba(56,189,248,0.12)]"
                    : "border-[var(--border)] bg-[var(--surface)]",
                ].join(" ")}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)] uppercase tracking-wide">
                    Recommended
                  </span>
                )}
                <p className="font-heading font-semibold text-[var(--fg)] text-sm mb-1">{tier.name}</p>
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className="font-display text-2xl font-extrabold text-[var(--fg)]">{tier.price}</span>
                  <span className="text-xs text-[var(--fg)]/35">{tier.period}</span>
                </div>
                <p className="text-xs text-[var(--fg)]/50 leading-relaxed mb-5">{tier.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[var(--fg)]/65">
                      <IconCheck size={12} className="text-[var(--primary)] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/quote?service=${encodeURIComponent(tier.name + " Maintenance")}`}
                  className={[
                    "flex h-9 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    tier.highlight
                      ? "bg-[var(--primary)] text-[var(--bg)] hover:opacity-90"
                      : "border border-[var(--border)] text-[var(--fg)]/70 hover:border-[var(--primary)] hover:text-[var(--primary)]",
                  ].join(" ")}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Add-ons ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">Common add-ons</h2>
          <p className="text-sm text-[var(--fg)]/45 mb-8">Typically added to a base project build.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ADD_ONS.map(({ name, price }) => (
              <div
                key={name}
                className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3"
              >
                <span className="text-sm text-[var(--fg)]/70">{name}</span>
                <span className="font-mono text-xs text-[var(--primary)] shrink-0">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Note + CTA ───────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-[var(--container-px)] text-center">
          <p className="text-sm text-[var(--fg)]/40 leading-relaxed mb-8">
            All ranges are based on standard project scope. Complex integrations, large teams, NDPR compliance work, or very tight timelines will adjust the final number. We&apos;ll tell you exactly why before you sign anything.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-heading font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Get your specific quote
            </Link>
            <Link
              href="/tools/cost-estimator"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-heading font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              Use the estimator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
