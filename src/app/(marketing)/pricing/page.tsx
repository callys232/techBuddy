import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconSparkles } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";
import { ConnectorsGrid } from "@/components/sections/ConnectorsGrid";
import { CurrencyBanner } from "@/components/ui/CurrencyBanner";
import { ComparisonTable, type ComparisonRow } from "@/components/ui/ComparisonTable";
import { PricingCard } from "@/components/ui/PricingCard";
import { CurrencyApprox } from "@/components/ui/CurrencyApprox";
import { PRICING_TIERS } from "@/mock/services";
import { getUserLocation } from "@/lib/geo";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Pricing — What It Costs to Build with TechAgency",
  description:
    "Transparent pricing for web apps, mobile products, AI integration, fintech, and maintenance — quoted in Naira, USD or GBP. No hidden fees.",
};

const PROJECT_TIERS = [
  {
    name: "Landing Page",
    range: "₦200k – ₦500k",
    ngnMin: 200_000,
    ngnMax: 500_000,
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
    ngnMin: 900_000,
    ngnMax: 4_000_000,
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
    ngnMin: 1_500_000,
    ngnMax: 6_000_000,
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
    ngnMin: 5_000_000,
    ngnMax: 20_000_000,
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

const ADD_ONS = [
  { name: "UI/UX Design (per screen flow)", price: "₦80k – ₦250k", ngnMin: 80_000, ngnMax: 250_000 },
  { name: "Paystack / Flutterwave integration", price: "₦250k – ₦600k", ngnMin: 250_000, ngnMax: 600_000 },
  { name: "WhatsApp Business API bot", price: "₦250k – ₦1M", ngnMin: 250_000, ngnMax: 1_000_000 },
  { name: "AI chatbot / LLM integration", price: "₦400k – ₦3M", ngnMin: 400_000, ngnMax: 3_000_000 },
  { name: "NDPR compliance audit", price: "₦200k – ₦500k", ngnMin: 200_000, ngnMax: 500_000 },
  { name: "Security pentest", price: "₦300k – ₦1.5M", ngnMin: 300_000, ngnMax: 1_500_000 },
  { name: "Performance optimisation", price: "₦200k – ₦800k", ngnMin: 200_000, ngnMax: 800_000 },
  { name: "DevOps setup (CI/CD + cloud)", price: "₦300k – ₦1.2M", ngnMin: 300_000, ngnMax: 1_200_000 },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  { capability: "Fixed Naira quote before work starts",       values: ["yes", "partial", "no"] },
  { capability: "Direct access to the engineer, not a broker", values: ["yes", "yes", "no"] },
  { capability: "NDPR/NDPA compliance built into delivery",    values: ["yes", "no", "partial"] },
  { capability: "Post-launch support included",                values: ["yes", "no", "partial"] },
  { capability: "Payment integration expertise (Paystack/Flutterwave)", values: ["yes", "partial", "yes"] },
  { capability: "One team across web, mobile, DevOps and AI",  values: ["yes", "no", "partial"] },
];

export default async function PricingPage() {
  const location = await getUserLocation();

  return (
    <div className="min-h-screen bg-[var(--page)]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[var(--section-y)] pb-16 text-center">
        <PageVectors variant="center" intensity={0.38} />
        <div className="relative z-10 mx-auto max-w-3xl px-[var(--container-px)]">
          <div className="flex justify-center">
            <CurrencyBanner location={location} />
          </div>
          <p className="eyebrow justify-center mb-6">Transparent pricing</p>
          <h1 className="h-display mb-4">
            What Does It Cost<br /><span className="text-[var(--brand)]">to Build With Us?</span>
          </h1>
          <p className="text-[var(--ink-muted)] text-lg leading-relaxed mb-8">
            Every project is different, but these ranges cover the vast majority of what we build.
            Prices are shown in Nigerian Naira — we quote in USD, GBP or your local currency for clients outside Nigeria. No hidden fees, no surprises.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/cost-estimator" className="btn-primary h-11 px-7 text-sm">
              <IconSparkles size={14} />
              Get an instant estimate
            </Link>
            <Link href="/quote" className="btn-ghost h-11 px-7 text-sm">
              Get a custom quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── One-off project pricing ───────────────────────────────────── */}
      <RevealSection>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-5">Project builds</p>
          <h2 className="h-section mb-2">
            One-off builds, <span className="text-[var(--brand)]">delivered in full.</span>
          </h2>
          <p className="text-sm text-[var(--ink-faint)] mb-10">Pick a scope. We handle discovery to launch.</p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {PROJECT_TIERS.map((tier) => (
              <div key={tier.name} className={tier.highlight ? "card border-[var(--brand)]/50 relative flex flex-col p-6" : "card-interactive relative flex flex-col p-6"}>
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3 py-0.5 font-mono text-[10px] font-bold text-[var(--brand-ink)] uppercase tracking-wide">
                    Most popular
                  </span>
                )}
                <div className="mb-4">
                  <p className="font-heading font-semibold text-[var(--ink)] text-sm">{tier.name}</p>
                  <p className="font-heading text-2xl font-extrabold text-[var(--brand)] mt-1">{tier.range}</p>
                  <CurrencyApprox ngn={tier.ngnMin} ngnMax={tier.ngnMax} />
                  <p className="font-mono text-xs text-[var(--ink-faint)] mt-0.5">{tier.duration}</p>
                </div>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-5">{tier.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[var(--ink)]/80">
                      <IconCheck size={12} className="text-[var(--brand)] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/quote?service=${encodeURIComponent(tier.name)}`}
                  className={tier.highlight ? "btn-primary h-9 text-xs" : "btn-ghost h-9 text-xs"}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── Retainer / maintenance ────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-16 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-5">Monthly plans</p>
          <h2 className="h-section mb-2">
            Keep it <span className="text-[var(--brand)]">running and growing.</span>
          </h2>
          <p className="text-sm text-[var(--ink-faint)] mb-10">Maintenance and active development after launch.</p>

          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl">
            {PRICING_TIERS.map((tier) => (
              <PricingCard key={tier.tier} {...tier} />
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── Add-ons ──────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-[var(--container-px)]">
          <p className="eyebrow mb-5">Add-ons</p>
          <h2 className="h-section mb-2">
            Common <span className="text-[var(--brand)]">add-ons.</span>
          </h2>
          <p className="text-sm text-[var(--ink-faint)] mb-8">Typically added to a base project build.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ADD_ONS.map(({ name, price, ngnMin, ngnMax }) => (
              <div key={name} className="card-interactive flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-sm text-[var(--ink)]/80">{name}</span>
                <span className="text-right shrink-0">
                  <span className="block font-mono text-xs text-[var(--brand)]">{price}</span>
                  <CurrencyApprox ngn={ngnMin} ngnMax={ngnMax} className="block text-[10px] text-[var(--ink-faint)]" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── How we compare ──────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-16">
        <div className="shell">
          <p className="eyebrow mb-5">Comparison</p>
          <h2 className="h-section mb-2">
            How we compare.
          </h2>
          <p className="text-sm text-[var(--ink-muted)] mb-10 max-w-xl">
            Most builds run through a freelancer or a big agency. Here&apos;s what actually differs.
          </p>
          <div className="card p-2 sm:p-4">
            <ComparisonTable
              columns={["TechAgency", "Freelancer", "Big agency"]}
              highlightColumn={0}
              rows={COMPARISON_ROWS}
            />
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── Third-party connectors ──────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <ConnectorsGrid />
      </RevealSection>

      {/* ── Note + CTA ───────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="relative overflow-hidden py-16 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-[var(--container-px)]">
          <p className="text-sm text-[var(--ink-faint)] leading-relaxed mb-8">
            All ranges are based on standard project scope. Complex integrations, large teams, NDPR compliance work, or very tight timelines will adjust the final number. We&apos;ll tell you exactly why before you sign anything.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="btn-primary h-12 px-8">
              Get your specific quote
            </Link>
            <Link href="/tools/cost-estimator" className="btn-ghost h-12 px-8">
              Use the estimator
            </Link>
          </div>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
