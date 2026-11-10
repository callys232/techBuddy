"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconCode,
  IconCreditCard,
  IconDeviceMobile,
  IconMessageCircle,
  IconRobot,
  IconServer,
  IconSparkles,
} from "@tabler/icons-react";

interface ServiceItem {
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
  bullet?: string;
  callout?: { text: string; href: string };
}

const services: ServiceItem[] = [
  {
    title: "Business platforms",
    body: "Customer portals, internal operations, marketplaces, and SaaS products.",
    icon: IconCode,
    href: "/services/web-development",
  },
  {
    title: "Mobile products",
    body: "Useful iOS and Android experiences for customers and teams on the move.",
    icon: IconDeviceMobile,
    href: "/services/mobile-apps",
  },
  {
    title: "Payments and fintech",
    body: "Payment flows, subscriptions, reconciliation, and secure integrations.",
    icon: IconCreditCard,
    href: "/services/fintech-payments",
    bullet: "Automated payment links & instant transfer verification (Paystack & Flutterwave)—no more chasing payment screenshots.",
    callout: {
      text: "Compare provider processing rates on our Fintech Fees Calculator →",
      href: "/tools/fintech-fees-calculator",
    },
  },
  {
    title: "Automation and AI",
    body: "Practical automation for support, documents, knowledge, and repetitive work.",
    icon: IconRobot,
    href: "/services/ai-integration",
  },
  {
    title: "WhatsApp workflows",
    body: "Lead qualification, updates, support, and guided customer journeys.",
    icon: IconMessageCircle,
    href: "/services/whatsapp-api",
    bullet: "Automated payment links & instant transfer verification (Paystack & Flutterwave)—no more chasing payment screenshots.",
    callout: {
      text: "Check your transaction savings with our free calculator →",
      href: "/tools/fintech-fees-calculator",
    },
  },
  {
    title: "Reliable infrastructure",
    body: "Deployment, monitoring, security, and scale when your product needs it.",
    icon: IconServer,
    href: "/services/devops",
  },
];

export function ServicesGrid() {
  return (
    <section className="relative py-[var(--section-y)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">What we build</p>
            <h2 className="h-section">Software that removes the bottleneck.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)]">
              Start with the problem. We’ll recommend the smallest useful product and build it with the right level of technical depth.
            </p>
          </div>
          <Link href="/services" className="link-underline shrink-0 text-sm font-semibold">
            Explore all services <IconArrowRight className="ml-1 inline" size={14} />
          </Link>
        </div>

        {/* Each box jumps into view as the user scrolls */}
        <div className="service-grid">
          {services.map(({ title, body, icon: Icon, href, bullet, callout }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.45,
                delay: (index % 3) * 0.08,
                ease: [0.21, 1.02, 0.49, 0.99],
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <div className="service-card group h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-5">
                    <span className="service-card-icon"><Icon size={21} /></span>
                    <span className="font-mono text-[10px] text-[var(--ink-faint)]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-heading text-lg font-semibold text-[var(--ink)]">
                    <Link href={href} className="hover:text-[var(--brand)] transition-colors">
                      {title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{body}</p>

                  {/* Feature Highlight & Callout */}
                  {bullet && (
                    <div className="mt-4 pt-3.5 border-t border-[var(--border)] text-xs space-y-2 bg-[var(--surface-soft)]/50 p-3 rounded-lg">
                      <p className="flex items-start gap-1.5 font-medium text-[var(--ink)] leading-snug">
                        <span className="text-[var(--good)] shrink-0 font-bold">✓</span>
                        <span>{bullet}</span>
                      </p>
                      {callout && (
                        <p className="pt-1">
                          <Link
                            href={callout.href}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand)] hover:underline"
                          >
                            <IconSparkles size={12} className="shrink-0 text-amber-500" />
                            <span>{callout.text}</span>
                          </Link>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--ink-muted)] group-hover:text-[var(--brand)] transition-colors"
                  >
                    <span>Learn more</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
