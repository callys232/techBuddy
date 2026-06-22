import type { Metadata } from "next";
import { MVPScopeGenerator } from "@/components/sections/MVPScopeGenerator";

export const metadata: Metadata = {
  title: "MVP Scope Generator — What Should I Build in Phase 1?",
  description:
    "Tell us about your product idea and answer 8 questions. We'll generate a prioritised Phase 1 feature list, Phase 2 roadmap, and what NOT to build — for African startups and founders.",
  keywords: [
    "MVP feature list Nigeria", "what to build in MVP Africa",
    "startup MVP scope generator", "product roadmap Nigeria",
    "Phase 1 features African startup",
  ],
  openGraph: {
    title: "MVP Scope Generator — What To Build First | TechAgency Africa",
    description: "8 questions. A prioritised Phase 1 feature list. What to build, what to cut, and what to do next.",
  },
};

export default function MVPScopePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool · For Founders
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4 max-w-2xl">
            What Should Your Phase 1 Actually Include?
          </h1>
          <p className="text-[var(--fg)]/50 max-w-xl mb-4 leading-relaxed">
            Most founders over-build their first version and run out of money or time before they validate anything. Answer 8 questions about your idea and get an honest, prioritised feature list — built around what African users actually need.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg)]/35 mb-12">
            <span>⏱ ~5 minutes</span>
            <span>·</span>
            <span>📋 8 questions</span>
            <span>·</span>
            <span>🗺️ Phase 1, Phase 2, and a "never build" list</span>
          </div>

          <MVPScopeGenerator />
        </div>
      </section>

      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[var(--fg)]/35 leading-relaxed max-w-2xl">
            <strong className="text-[var(--fg)]/50">How is this generated?</strong> Feature recommendations are based on our experience shipping 35+ products for African startups and businesses. The rules account for what actually slows down Nigerian builds — payment API onboarding, low-connectivity UX, multi-stakeholder sign-offs. This is not an AI-generated list. It&apos;s hand-coded logic from real projects.
          </p>
        </div>
      </section>
    </div>
  );
}
