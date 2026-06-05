import type { Metadata } from "next";
import { TemplateCard } from "@/components/ui/TemplateCard";
import { TabGroup } from "@/components/ui/TabGroup";

export const metadata: Metadata = {
  title: "Template Gallery",
  description: "Pre-built templates for landing pages, SaaS, e-commerce, dashboards, and more.",
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "landing", label: "Landing" },
  { id: "saas", label: "SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog" },
  { id: "dashboard", label: "Dashboard" },
  { id: "mobile", label: "Mobile" },
];

const TEMPLATES = [
  { name: "LaunchPad", type: "landing", price: "From ₦180k", features: ["Hero", "Pricing", "FAQ", "CTA"], image: "/placeholder.png" },
  { name: "SaaSify", type: "saas", price: "From ₦350k", features: ["Auth", "Dashboard", "Billing", "Docs"], image: "/placeholder.png" },
  { name: "MarketPro", type: "ecommerce", price: "From ₦400k", features: ["Catalog", "Cart", "Checkout", "Orders"], image: "/placeholder.png" },
  { name: "Folio", type: "portfolio", price: "From ₦120k", features: ["Projects", "Blog", "Contact", "Resume"], image: "/placeholder.png" },
  { name: "AdminKit", type: "dashboard", price: "From ₦300k", features: ["Tables", "Charts", "Users", "Settings"], image: "/placeholder.png" },
  { name: "NativePro", type: "mobile", price: "From ₦500k", features: ["Onboarding", "Auth", "Profile", "Notifications"], image: "/placeholder.png" },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Start Fast, Launch Faster
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
          Production-ready templates — customized to your brand, deployed in days.
        </p>
      </section>

      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <TabGroup tabs={FILTER_TABS} activeTab="all" onChange={() => {}} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.name} {...t} onSelect={() => {}} />
          ))}
          {/* Build from scratch — always visible */}
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border)] p-10 text-center">
            <p className="font-display text-lg font-bold text-[var(--fg)] mb-2">
              Build From Scratch
            </p>
            <p className="text-sm text-[var(--fg)]/50 mb-6">
              Custom design and architecture for unique requirements.
            </p>
            <a
              href="/quote"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all"
            >
              Start a custom build
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
