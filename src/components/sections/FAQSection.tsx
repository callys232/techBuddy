"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import Link from "next/link";
import { FAQS } from "@/mock/faqs";

function FAQItem({ q, a, link }: typeof FAQS[0]) {
  const [open, setOpen] = useState(false);

  return (
    <div className={[
      "card mb-3 overflow-hidden transition-all duration-250",
      open ? "border-[var(--brand)]/35" : "",
    ].join(" ")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-heading font-semibold text-[var(--ink)] text-[15px] leading-snug pr-4">
          {q}
        </span>
        <span className={[
          "mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
          open
            ? "bg-[var(--brand)] text-[var(--brand-ink)]"
            : "bg-[var(--border)] text-[var(--ink-muted)]",
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
            <div className="px-6 pb-6 space-y-3 border-t border-[var(--border)] pt-4">
              <p className="text-[14px] text-[var(--ink-muted)] leading-[1.8]">{a}</p>
              {link && (
                <Link
                  href={link.href}
                  className="inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
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
      <div className="mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-[340px,1fr] gap-16 items-start">

          {/* Left — sticky */}
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-5">Common questions</p>
            <h2 className="mt-5 font-heading font-extrabold text-[var(--ink)] leading-tight mb-4 tracking-[-0.02em]
                           text-[clamp(1.75rem,3vw,2.4rem)]">
              You probably have{" "}
              <span className="text-[var(--brand)]">questions.</span>
            </h2>
            <p className="text-[var(--ink-muted)] text-[14px] leading-relaxed mb-7">
              We&apos;ve answered the ones that come up in almost every first conversation. If yours isn&apos;t here, just ask.
            </p>
            <Link href="/contact" className="btn-primary px-7 py-3.5 text-[13px]">
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
