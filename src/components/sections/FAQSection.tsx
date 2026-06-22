"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How much does a project cost?",
    a: "Most client projects fall between ₦500k and ₦15M depending on scope. A landing page starts at ₦200k. A full SaaS platform with payments, auth and dashboards typically runs ₦3M–₦8M. A native mobile app (iOS + Android) is usually ₦1.5M–₦6M. We give you a Naira range before any contract is signed — no surprises. You can also use our free cost estimator for a rough number.",
    link: { label: "Try the cost estimator →", href: "/tools/cost-estimator" },
  },
  {
    q: "How long will it take to build my product?",
    a: "A standard MVP takes 8–14 weeks from signed contract to production launch. A full product with multiple user roles, payment flows, and an admin dashboard typically takes 3–5 months. We run 2-week sprints with a live staging environment, so you see real progress every week — not just a demo at the end.",
    link: null,
  },
  {
    q: "What if I don't know exactly what I need?",
    a: "That's what the discovery phase is for, and it's free. We start every engagement with a 60-minute strategy call where we ask the right questions, map your users' journeys, and scope the smallest version of your product that can generate revenue. Most clients come to us with a rough idea — we help turn it into a clear, costed plan.",
    link: { label: "Book a free call →", href: "/contact" },
  },
  {
    q: "Do you work with early-stage startups or only established companies?",
    a: "Both. Our smallest projects start at ₦200k. We've worked with founders who had just an idea and an Aso-ebi budget, and with Series A companies scaling to millions of users. What matters is that you're serious about building — not how much funding you have. If you're pre-revenue, we can discuss equity arrangements for the right opportunity.",
    link: { label: "See how we invest →", href: "/invest" },
  },
  {
    q: "How do I know you'll actually deliver?",
    a: "Our re-engagement rate is 94% — meaning nearly every client who ships with us comes back for the next project. We mitigate risk in three ways: weekly demos on a live staging URL (so you never wait 3 months to see what you're paying for), milestone-based payments (you only pay for work done), and a post-launch support period included in every contract. You can also read our client case studies or speak directly to past clients.",
    link: { label: "See the portfolio →", href: "/portfolio" },
  },
  {
    q: "Who owns the code when the project is done?",
    a: "You do — fully. Once final payment is received, all custom code transfers to you. We hand over the GitHub repository, deploy credentials, and documentation. The only things we retain are our internal boilerplates and tooling — the equivalent of a contractor keeping their own hammer. Open-source components remain under their original licences.",
    link: null,
  },
];

function FAQItem({ q, a, link }: typeof FAQS[0]) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-heading font-semibold text-[var(--fg)] text-[15px] leading-snug pr-4">
          {q}
        </span>
        <span className="mt-0.5 shrink-0 text-[var(--fg)]/40">
          {open ? <IconMinus size={16} /> : <IconPlus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 space-y-3">
              <p className="text-sm text-[var(--fg)]/65 leading-[1.8]">{a}</p>
              {link && (
                <Link
                  href={link.href}
                  className="inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
                >
                  {link.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-[var(--section-y)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-[380px,1fr] gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-28">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
              Common questions
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-[var(--fg)] leading-tight mb-4">
              You probably have questions.
            </h2>
            <p className="text-[var(--fg)]/50 text-sm leading-relaxed mb-6">
              We&apos;ve answered the ones that come up in almost every first conversation. If yours isn&apos;t here, just ask.
            </p>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
            >
              Ask us directly
            </Link>
          </div>

          {/* Right: accordion */}
          <div>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
