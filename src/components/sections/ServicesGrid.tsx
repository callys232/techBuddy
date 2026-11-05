import Link from "next/link";
import {
  IconArrowRight, IconCode, IconCreditCard, IconDeviceMobile,
  IconMessageCircle, IconRobot, IconServer,
} from "@tabler/icons-react";

const services = [
  { title: "Business platforms", body: "Customer portals, internal operations, marketplaces, and SaaS products.", icon: IconCode, href: "/services/web-development" },
  { title: "Mobile products", body: "Useful iOS and Android experiences for customers and teams on the move.", icon: IconDeviceMobile, href: "/services/mobile-apps" },
  { title: "Payments and fintech", body: "Payment flows, subscriptions, reconciliation, and secure integrations.", icon: IconCreditCard, href: "/services/fintech-payments" },
  { title: "Automation and AI", body: "Practical automation for support, documents, knowledge, and repetitive work.", icon: IconRobot, href: "/services/ai-integration" },
  { title: "WhatsApp workflows", body: "Lead qualification, updates, support, and guided customer journeys.", icon: IconMessageCircle, href: "/services/whatsapp-api" },
  { title: "Reliable infrastructure", body: "Deployment, monitoring, security, and scale when your product needs it.", icon: IconServer, href: "/services/devops" },
];

export function ServicesGrid() {
  return (
    <section className="relative py-[var(--section-y)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">What we build</p>
            <h2 className="h-section">Software that removes the bottleneck.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)]">Start with the problem. We’ll recommend the smallest useful product and build it with the right level of technical depth.</p>
          </div>
          <Link href="/services" className="link-underline shrink-0 text-sm font-semibold">Explore all services <IconArrowRight className="ml-1 inline" size={14} /></Link>
        </div>

        <div className="service-grid">
          {services.map(({ title, body, icon: Icon, href }, index) => (
            <Link key={title} href={href} className="service-card group">
              <div className="flex items-start justify-between gap-5">
                <span className="service-card-icon"><Icon size={21} /></span>
                <span className="font-mono text-[10px] text-[var(--ink-faint)]">0{index + 1}</span>
              </div>
              <h3 className="mt-8 font-heading text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--brand)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{body}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--ink-muted)] group-hover:text-[var(--brand)]">Learn more <IconArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}