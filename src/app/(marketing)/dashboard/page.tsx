import type { Metadata } from "next";
import { DashboardContent } from "@/components/sections/DashboardContent";

export const metadata: Metadata = {
  title: "Your Dashboard — TechBuddy",
  description: "Track your Resume Premium subscription, points balance, and rewards.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4">Your account</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-8">
            Dashboard
          </h1>
          <DashboardContent />
        </div>
      </section>
    </div>
  );
}
