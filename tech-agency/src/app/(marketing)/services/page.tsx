import type { Metadata } from "next";
import { TabGroup } from "@/components/ui/TabGroup";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { PricingCard } from "@/components/ui/PricingCard";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack web, mobile, DevOps, security, fintech, and maintenance services for African businesses.",
};

const SERVICE_TABS = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "devops", label: "DevOps" },
  { id: "security", label: "Security" },
  { id: "fintech", label: "Fintech" },
  { id: "maintenance", label: "Maintenance" },
];

const PRICING_TIERS = [
  {
    tier: "Starter",
    price: "₦150k/mo",
    features: [
      "Monthly updates",
      "Security patches",
      "Uptime monitoring",
      "Hosting management",
    ],
    recommended: false,
    ctaText: "Get started",
  },
  {
    tier: "Growth",
    price: "₦350k/mo",
    features: [
      "Everything in Starter",
      "Performance reports",
      "Feature additions",
      "Priority support",
      "Monthly reports",
    ],
    recommended: true,
    ctaText: "Most popular",
  },
  {
    tier: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Growth",
      "Dedicated engineer",
      "24hr SLA",
      "Slack / WhatsApp access",
      "Quarterly audits",
    ],
    recommended: false,
    ctaText: "Contact us",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Everything Your Business Needs to Win Online
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-2xl mx-auto">
          From strategy to deployment — we cover every layer of the stack.
        </p>
      </section>

      {/* Filter tabs */}
      <section className="px-[var(--container-px)] pb-16">
        <TabGroup tabs={SERVICE_TABS} activeTab="all" onChange={() => {}} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ServiceCard instances rendered from CMS data in production */}
          <ServiceCard
            icon="code"
            title="Web Development"
            desc="Full-stack apps, CMS, e-commerce, PWAs — offline-first for Nigerian connectivity."
            tag="Web"
            href="/services/web-development"
            color="teal"
          />
          <ServiceCard
            icon="device-mobile"
            title="Mobile Apps"
            desc="React Native, Flutter, USSD & SMS integration — works on feature phones."
            tag="Mobile"
            href="/services/mobile-apps"
            color="amber"
          />
          <ServiceCard
            icon="server"
            title="DevOps & CI/CD"
            desc="Automated pipelines, containers, GitOps, monitoring, disaster recovery."
            tag="DevOps"
            href="/services/devops"
            color="teal"
          />
          <ServiceCard
            icon="shield"
            title="Security & Pentesting"
            desc="OWASP coverage, NDPR compliance, WAF, bug bounty, detailed report."
            tag="Security"
            href="/services/security-pentesting"
            color="coral"
          />
          <ServiceCard
            icon="cloud"
            title="Cloud & Scaling"
            desc="Multi-cloud, CDN, load testing, auto-scaling, 99.9% uptime SLA."
            tag="Cloud"
            href="/services/cloud-scaling"
            color="amber"
          />
          <ServiceCard
            icon="credit-card"
            title="Fintech & Payments"
            desc="Paystack, Flutterwave, CBN compliance, PCI-DSS, USSD banking flows."
            tag="Fintech"
            href="/services/fintech-payments"
            color="teal"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h2 className="font-display text-4xl font-bold text-center text-[var(--fg)] mb-12">
          Maintenance Plans
        </h2>
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.tier} {...tier} />
          ))}
        </div>
      </section>
    </div>
  );
}
