import type { Metadata } from "next";
import Link from "next/link";
import { RepoHealthScan } from "@/components/sections/RepoHealthScan";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Repo Health Scan — Instant GitHub Repo Health Score",
  description:
    "Paste a public GitHub repo URL and get an instant health score on staleness, licensing, and issue backlog. Free, no sign-up.",
  keywords: [
    "github repo health check", "code health score", "open source audit tool",
    "is this repo maintained", "github repo checker",
  ],
  openGraph: {
    title: "Repo Health Scan — Instant GitHub Health Score | TechAgency",
    description: "Paste a repo URL, get an instant score on staleness, licensing, and issue backlog. Free.",
  },
};

export default function RepoHealthScanPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="center" intensity={0.5} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="h-display mb-4">
            Is That GitHub Repo Actually Safe to Build On?
          </h1>
          <p className="text-[var(--ink)]/50 leading-relaxed mb-4">
            Before you base a project on someone else&apos;s code — a starter template, a library, a
            fork you're evaluating — check whether it's still maintained, properly licensed, and not
            drowning in unresolved issues.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--ink)]/35 mb-12">
            <span>⏱ ~10 seconds</span>
            <span>·</span>
            <span>🔓 Public repos only</span>
            <span>·</span>
            <span>🩺 Recency, license, issue backlog</span>
          </div>
          <RepoHealthScan />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-6 items-start justify-between">
          <p className="text-sm text-[var(--ink)]/35 leading-relaxed max-w-xl text-left">
            <strong className="text-[var(--ink)]/50">How is this calculated?</strong> A weighted score
            from how recently the repo was pushed to, whether it has a license, and its open-issue
            backlog relative to its popularity — pulled live from the public GitHub API.
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
