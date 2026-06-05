import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talent Hub",
  description: "Nigeria's vetted tech talent, ready to build. Hire developers or join the network.",
};

export default function TalentPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Nigeria&apos;s Vetted Tech Talent,<br />Ready to Build
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
          Browse profiles, filter by skill, and hire the engineer your project needs.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="/sign-in?redirect=/talent/hire"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
          >
            Hire a developer
          </a>
          <a
            href="/sign-in?redirect=/talent/join"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
          >
            Join the network
          </a>
        </div>
      </section>

      {/* Auth gate notice */}
      <section className="px-[var(--container-px)] py-16 text-center">
        <div className="mx-auto max-w-md glass rounded-[var(--radius-card)] p-8">
          <p className="text-[var(--fg)]/70 text-sm">
            Full developer profiles are visible after sign-in. Create a free account to browse the network.
          </p>
        </div>
      </section>
    </div>
  );
}
