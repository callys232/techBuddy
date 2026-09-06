import type { Metadata } from "next";
import { DEVOPS_SERVICES, DEVOPS_STACK } from "@/mock/services";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "DevOps & CI/CD — Production-Grade Infrastructure for Growing Systems",
  description:
    "Automated CI/CD pipelines, Docker & Kubernetes containerisation, GitOps, Terraform infrastructure-as-code, Grafana monitoring and disaster recovery for systems serving markets worldwide.",
  keywords: [
    "DevOps engineering", "CI/CD pipelines", "Kubernetes",
    "cloud infrastructure", "Docker containerisation",
    "Terraform infrastructure", "site reliability engineering",
  ],
  openGraph: {
    title: "DevOps & CI/CD Infrastructure for Growing Businesses | TechAgency",
    description:
      "Ship faster and break nothing — automated pipelines, containers and full observability.",
  },
};

export default function DevOpsPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="bottom-left" intensity={0.6} />
        <div className="relative z-10">
        <h1 className="h-display max-w-3xl">
          Ship Faster. Break Nothing.
        </h1>
        <p className="mt-6 text-lg text-[var(--ink)]/60 max-w-xl">
          End-to-end DevOps — from pipelines to production, with full observability.
        </p>
        <a
          href="/quote?service=devops"
          className="btn-primary mt-8 h-12 px-8"
        >
          Get a DevOps audit
        </a>
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h2 className="h-section mb-8">Services</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVOPS_SERVICES.map((s) => (
            <li
              key={s}
              className="glass rounded-[var(--radius-card)] p-5 text-[var(--ink)] font-medium"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>
      </RevealSection>

      <RevealSection delay={0.05}>
      <section className="px-[var(--container-px)] py-[var(--section-y)] bg-[var(--surface)]">
        <h2 className="h-section mb-8">
          Infrastructure Stack
        </h2>
        <div className="flex flex-wrap gap-3">
          {DEVOPS_STACK.map((tech) => (
            <span
              key={tech}
              className="font-mono text-sm rounded-[var(--radius-badge)] border border-[var(--border)] px-3 py-1.5 text-[var(--ink)]/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
