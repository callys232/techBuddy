import type { Metadata } from "next";
import Link from "next/link";
import { FintechFeesCalculator } from "@/components/sections/FintechFeesCalculator";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Fintech Fees Calculator — Paystack vs Flutterwave",
  description:
    "Compare Paystack and Flutterwave transaction fees side by side at your real transaction volume — local and international cards. Free, instant.",
  keywords: [
    "paystack fees calculator", "flutterwave fees calculator",
    "paystack vs flutterwave", "payment gateway fees nigeria",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Paystack vs Flutterwave Fees Calculator | TechBuddy",
    description: "See the real per-transaction and monthly cost difference at your actual volume. Free, instant.",
  },
};

export default function FintechFeesCalculatorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="h-display mb-4 max-w-2xl">
            Paystack or Flutterwave — Which Costs You Less?
          </h1>
          <p className="text-[var(--ink)]/50 max-w-xl mb-4 leading-relaxed">
            Both quote near-identical headline rates, but the flat fees, caps, and free-transaction
            thresholds differ enough to matter at real volume. Set your amount and see the actual
            per-transaction and monthly difference.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink)]/35 mb-12">
            <span>⏱ ~30 seconds</span>
            <span>·</span>
            <span>💳 Local + international cards</span>
            <span>·</span>
            <span>💰 Real published rates</span>
          </div>
          <FintechFeesCalculator />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 items-start justify-between">
          <p className="text-sm text-[var(--ink)]/35 leading-relaxed max-w-xl">
            <strong className="text-[var(--ink)]/50">How is this calculated?</strong> Uses each
            provider&apos;s publicly listed local and international card rates. Rates change without much
            notice — confirm current pricing directly with Paystack or Flutterwave before deciding.
          </p>
          <Link href="/tools" className="text-sm font-semibold text-[var(--brand)] hover:underline shrink-0">
            ← All free tools
          </Link>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
