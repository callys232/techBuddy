"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How much does a project cost?",
    a: "Every project is scoped differently, so we don't publish fixed prices — a landing page and a fintech platform are very different builds. Use our free Cost Estimator to get an instant Naira range based on your project type, features, and timeline. For a precise figure, our quote wizard gives you an exact number with a signed scope.",
    link: { label: "Get an instant estimate →", href: "/tools/cost-estimator" },
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
    a: "Both. We've worked with founders who had just an idea and an Aso-ebi budget, and with Series A companies scaling to millions of users. What matters is that you're serious about building — not how much funding you have. Use the cost estimator to see what your idea would take, then reach out. If you're pre-revenue, we can also discuss equity arrangements for the right opportunity.",
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
    <div className={[
      "lm-card mb-3 overflow-hidden transition-all duration-250",
      open ? "border-[rgba(56,189,248,0.35)]" : "",
    ].join(" ")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-heading font-semibold text-[var(--fg)] text-[15px] leading-snug pr-4">
          {q}
        </span>
        <span className={[
          "mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
          open
            ? "bg-[var(--primary)] text-[var(--bg)]"
            : "bg-[var(--border)] text-[var(--fg)]/50",
        ].join(" ")}>
          {open ? <IconMinus size={13} /> : <IconPlus size={13} />}
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
            <div className="px-6 pb-6 space-y-3 border-t border-[rgba(56,189,248,0.1)] pt-4">
              <p className="text-[14px] text-[var(--fg)]/60 leading-[1.8]">{a}</p>
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
    <section className="relative overflow-hidden py-[var(--section-y)]">
      <div className="gradient-line mb-16" />
      <div className="mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-[340px,1fr] gap-16 items-start">

          {/* Left — sticky */}
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow-pill mb-5 inline-flex">
              Common questions
            </span>
            <h2 className="mt-5 font-display font-extrabold text-[var(--fg)] leading-tight mb-4 tracking-[-0.02em]
                           text-[clamp(1.75rem,3vw,2.4rem)]">
              You probably have{" "}
              <span className="gradient-text">questions.</span>
            </h2>
            <p className="text-[var(--fg)]/50 text-[14px] leading-relaxed mb-7">
              We&apos;ve answered the ones that come up in almost every first conversation. If yours isn&apos;t here, just ask.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--primary)] px-7 py-3.5 font-heading text-[13px] font-bold text-[var(--bg)] btn-glow transition-all active:scale-[0.97]"
            >
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12" />
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
