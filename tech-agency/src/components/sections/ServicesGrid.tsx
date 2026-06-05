import Link from "next/link";
import { ServiceCard } from "@/components/ui/ServiceCard";

const SERVICES = [
  { icon: "code" as const, title: "Web Development", desc: "Full-stack apps, CMS, e-commerce, PWAs — offline-first for Nigerian connectivity.", tag: "Web", href: "/services/web-development", color: "teal" as const },
  { icon: "device-mobile" as const, title: "Mobile Apps", desc: "React Native, Flutter, USSD & SMS — works on feature phones.", tag: "Mobile", href: "/services/mobile-apps", color: "amber" as const },
  { icon: "server" as const, title: "DevOps & CI/CD", desc: "Automated pipelines, GitOps, containers, monitoring and DR.", tag: "DevOps", href: "/services/devops", color: "teal" as const },
  { icon: "shield" as const, title: "Security & Pentesting", desc: "OWASP coverage, NDPR compliance, WAF, bug bounty programs.", tag: "Security", href: "/services/security-pentesting", color: "coral" as const },
  { icon: "cloud" as const, title: "Cloud & Scaling", desc: "Multi-cloud, CDN, load testing, auto-scaling, 99.9% SLA.", tag: "Cloud", href: "/services/cloud-scaling", color: "amber" as const },
  { icon: "credit-card" as const, title: "Fintech & Payments", desc: "Paystack, Flutterwave, CBN compliance, PCI-DSS, USSD flows.", tag: "Fintech", href: "/services/fintech-payments", color: "teal" as const },
];

export function ServicesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-[var(--container-px)] py-[var(--section-y)]">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">What we do</span>
          <h2 className="mt-2 font-display text-4xl font-extrabold text-[var(--fg)]">
            Full-Stack Services
          </h2>
        </div>
        <Link
          href="/services"
          className="hidden sm:inline text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Link href="/services" className="text-sm font-semibold text-[var(--primary)] hover:underline">
          View all services →
        </Link>
      </div>
    </section>
  );
}
