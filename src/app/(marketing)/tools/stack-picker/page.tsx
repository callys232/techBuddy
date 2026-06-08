import type { Metadata } from "next";
import { StackPicker } from "@/components/sections/StackPicker";

export const metadata: Metadata = {
  title: "Tech Stack Picker — Best Stack for Your Nigerian Product",
  description:
    "Answer 4 questions and get a recommended production tech stack for your web app, mobile app or SaaS — tailored to the Nigerian and African market.",
  keywords: [
    "best tech stack Nigeria 2026", "what stack should I use Africa",
    "Next.js vs Django Nigeria", "React Native vs Flutter Africa",
    "tech stack for startup Nigeria",
  ],
};

export default function StackPickerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4">
            What&apos;s the Right Stack for Your Product?
          </h1>
          <p className="text-[var(--fg)]/50 leading-relaxed">
            Four questions. One recommendation. Based on what our engineers actually use in production across African markets.
          </p>
        </div>
        <StackPicker />
      </section>
    </div>
  );
}
