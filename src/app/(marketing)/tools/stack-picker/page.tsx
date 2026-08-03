import type { Metadata } from "next";
import { StackPicker } from "@/components/sections/StackPicker";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Tech Stack Picker — Best Stack for Your Product",
  description:
    "Answer 4 questions and get a recommended production tech stack for your web app, mobile app or SaaS — built on what actually ships in fast-growing and emerging markets.",
  keywords: [
    "best tech stack 2026", "what stack should I use",
    "Next.js vs Django", "React Native vs Flutter",
    "tech stack for startup",
  ],
};

export default function StackPickerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.38} />
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-12">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4">
            What&apos;s the Right Stack for Your Product?
          </h1>
          <p className="text-[var(--fg)]/50 leading-relaxed">
            Four questions. One recommendation. Based on what our engineers actually use in production, from African markets to global scale.
          </p>
        </div>
        <StackPicker />
      </section>
    </div>
  );
}

