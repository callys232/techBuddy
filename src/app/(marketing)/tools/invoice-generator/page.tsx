import type { Metadata } from "next";
import { InvoiceGenerator } from "@/components/sections/InvoiceGenerator";
import { ShareTool } from "@/components/ui/ShareTool";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Free Invoice Generator — Professional PDF Invoices in Minutes",
  description:
    "Create a professional invoice with line items, tax, and multi-currency support. Download as a branded PDF — free, no sign-up required.",
  keywords: [
    "free invoice generator", "invoice maker online",
    "PDF invoice generator", "Nigerian VAT invoice",
    "small business invoice template",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Free Invoice Generator — Branded PDF in Minutes | TechBuddy",
    description: "Line items, tax, multi-currency. Download a professional PDF invoice — free, no sign-up.",
  },
};

export default function InvoiceGeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-6xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            Invoice Generator
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Fill in your details, add line items, and download a professional PDF invoice — VAT-ready, multi-currency, no sign-up.
          </p>
          <InvoiceGenerator />
          <ShareTool toolName="Invoice Generator" className="mt-12" />
        </div>
      </section>
    </div>
  );
}
