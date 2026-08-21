import type { Metadata } from "next";
import { MVPScopeGenerator } from "@/components/sections/MVPScopeGenerator";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "MVP Scope Generator — What Should I Build in Phase 1?",
  description:
    "Tell us about your product idea and answer 8 questions. We'll generate a prioritised Phase 1 feature list, Phase 2 roadmap, and what NOT to build — for founders anywhere.",
  keywords: [
    "MVP feature list", "what to build in MVP",
    "startup MVP scope generator", "product roadmap generator",
    "Phase 1 features startup",
  ],
  openGraph: {
    title: "MVP Scope Generator — What To Build First | TechAgency",
    description: "8 questions. A prioritised Phase 1 feature list. What to build, what to cut, and what to do next.",
  },
};

export default function MVPScopePage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="scattered" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool · For Founders</p>
          <h1 className="h-display mb-4 max-w-2xl">
            What Should Your Phase 1 Actually Include?
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-4 leading-relaxed">
            Most founders over-build their first version and run out of money or time before they validate anything. Answer 8 questions about your idea and get an honest, prioritised feature list — built around what real users actually need.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink-faint)] mb-12">
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
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-sm text-[var(--ink-faint)] leading-relaxed max-w-2xl">
            <strong className="text-[var(--ink-muted)]">How is this generated?</strong> Feature recommendations come from hand-coded rules, not an AI model — logic built around what actually slows down real-world builds in African markets: payment API onboarding, low-connectivity UX, multi-stakeholder sign-offs.
          </p>
        </div>
      </section>
    </div>
  );
}

