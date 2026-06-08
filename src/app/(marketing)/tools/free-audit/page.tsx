import type { Metadata } from "next";
import { FreeAuditForm } from "@/components/sections/FreeAuditForm";

export const metadata: Metadata = {
  title: "Free Tech Audit — Performance, Security & SEO Review for Nigerian Sites",
  description:
    "Submit your website or app URL and our engineers will manually audit performance, security headers, SEO, code quality and accessibility — delivered as a written report within 48 hours, free.",
  keywords: [
    "free website audit Nigeria", "free app security audit Africa",
    "website performance check Nigeria", "free SEO audit Lagos",
    "tech audit Nigeria free",
  ],
};

const WHAT_YOU_GET = [
  { icon: "⚡", title: "Performance score",    body: "Core Web Vitals, LCP, CLS, FID and load time on Nigerian network conditions." },
  { icon: "🔒", title: "Security review",      body: "HTTP headers, exposed endpoints, HTTPS config and known vulnerability checks." },
  { icon: "🔍", title: "SEO analysis",         body: "Meta tags, Open Graph, structured data, sitemap and indexability review." },
  { icon: "🧱", title: "Code quality notes",   body: "Architecture patterns, obvious tech debt, framework version and dependency health." },
  { icon: "♿", title: "Accessibility check",  body: "Colour contrast, keyboard navigation, ARIA labels and WCAG 2.1 compliance basics." },
];

export default function FreeAuditPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: pitch */}
          <div>
            <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
              Free Tool
            </p>
            <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-5">
              Get a Free Manual Tech Audit
            </h1>
            <p className="text-[var(--fg)]/55 leading-relaxed mb-10">
              Submit your URL — our engineers will review it by hand and send you an honest, actionable report. No automated Lighthouse screenshots. Real engineers, real findings.
            </p>

            <div className="space-y-5 mb-10">
              {WHAT_YOU_GET.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-heading font-semibold text-[var(--fg)] mb-0.5">{item.title}</p>
                    <p className="text-sm text-[var(--fg)]/45 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-[var(--radius-card)] border border-[var(--border)] p-5">
              <p className="font-heading font-semibold text-[var(--fg)] mb-1">Why is this free?</p>
              <p className="text-sm text-[var(--fg)]/45 leading-relaxed">
                We do this because it starts a real conversation. Most audits surface issues you&apos;ll want help fixing — and we&apos;re the team that can fix them. No hard pitch, just an honest report.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <FreeAuditForm />
          </div>
        </div>
      </section>
    </div>
  );
}
