import type { Metadata } from "next";
import { ResumeMaker } from "@/components/sections/ResumeMaker";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Free Resume Maker — Build a Professional Resume in Minutes",
  description:
    "Create a polished, ATS-friendly resume online for free. Choose from three professional templates — Classic, Modern, or Minimal — fill in your details and download as a PDF instantly.",
  keywords: [
    "free resume maker",
    "resume builder online",
    "CV maker online free",
    "professional CV builder",
    "ATS resume builder",
    "download resume PDF free",
  ],
};

export default function ResumeMakerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.32} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-3 max-w-2xl">
            Build Your Resume — Free
          </h1>
          <p className="text-[var(--fg)]/50 max-w-xl mb-10 leading-relaxed">
            Fill in your details, pick a template, and download a professional PDF resume at no cost. No watermarks.
          </p>
          <ResumeMaker />
        </div>
      </section>
    </div>
  );
}
