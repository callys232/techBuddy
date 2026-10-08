import type { Metadata } from "next";
import { CoverLetterGenerator } from "@/components/sections/CoverLetterGenerator";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Free Cover Letter Generator — AI-Written, Ready to Send",
  description:
    "Tell us the role and your strengths — get a tailored, ready-to-send cover letter in seconds. Download as PDF. Free, no sign-up. Pairs perfectly with Resume Maker.",
  keywords: [
    "free cover letter generator", "AI cover letter",
    "cover letter maker", "cover letter template",
    "job application letter generator",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Free AI Cover Letter Generator | TechBuddy",
    description: "Tell us the role and your strengths — get a tailored, ready-to-send cover letter in seconds.",
  },
};

export default function CoverLetterGeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-6xl mx-auto">
          <p className="eyebrow mb-4">Free Tool · AI-powered</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            Cover Letter Generator
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Tell us the role and your strengths — get a tailored, ready-to-send cover letter in seconds.
          </p>
          <CoverLetterGenerator />
        </div>
      </section>
    </div>
  );
}
