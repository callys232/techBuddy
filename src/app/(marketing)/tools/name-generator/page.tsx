import type { Metadata } from "next";
import { NameGenerator } from "@/components/sections/NameGenerator";

export const metadata: Metadata = {
  title: "Free Business Name Generator — AI Names + Domain Check",
  description:
    "Describe your business idea and get 12 AI-generated name ideas with an instant .com / .ng / .io availability check. Free, instant, no sign-up.",
  keywords: [
    "business name generator", "startup name generator",
    "AI business name ideas", "domain name checker",
    "company name generator Nigeria",
  ],
  openGraph: {
    title: "Free Business Name Generator — AI Names | TechAgency",
    description: "Describe your idea, get 12 AI name ideas with an instant domain availability check.",
  },
};

export default function NameGeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool · AI-powered</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            Business Name Generator
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Describe what you&apos;re building — get 12 name ideas with taglines and an instant domain availability check.
          </p>
          <NameGenerator />
        </div>
      </section>
    </div>
  );
}
