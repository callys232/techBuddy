import type { Metadata } from "next";
import { DEVOPS_SERVICES, DEVOPS_STACK } from "@/mock/services";

export const metadata: Metadata = {
  title: "DevOps & CI/CD — Production-Grade Infrastructure for African Systems",
  description:
    "Automated CI/CD pipelines, Docker & Kubernetes containerisation, GitOps, Terraform infrastructure-as-code, Grafana monitoring and disaster recovery for systems serving the African market.",
  keywords: [
    "DevOps Nigeria", "CI/CD Africa", "Kubernetes Nigeria",
    "cloud infrastructure Lagos", "Docker containerisation Nigeria",
    "Terraform Africa", "site reliability engineering Nigeria",
  ],
  openGraph: {
    title: "DevOps & CI/CD Infrastructure for African Businesses | TechAgency",
    description:
      "Ship faster and break nothing — automated pipelines, containers and full observability.",
  },
};

export default function DevOpsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none max-w-3xl">
          Ship Faster. Break Nothing.
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl">
          End-to-end DevOps — from pipelines to production, with full observability.
        </p>
        <a
          href="/quote?service=devops"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95"
        >
          Get a DevOps audit
        </a>
      </section>

      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h2 className="font-display text-3xl font-bold text-[var(--fg)] mb-8">Services</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVOPS_SERVICES.map((s) => (
            <li
              key={s}
              className="glass rounded-[var(--radius-card)] p-5 text-[var(--fg)] font-medium"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-[var(--container-px)] py-[var(--section-y)] bg-[var(--surface)]">
        <h2 className="font-display text-3xl font-bold text-[var(--fg)] mb-8">
          Infrastructure Stack
        </h2>
        <div className="flex flex-wrap gap-3">
          {DEVOPS_STACK.map((tech) => (
            <span
              key={tech}
              className="font-mono text-sm rounded-[var(--radius-badge)] border border-[var(--border)] px-3 py-1.5 text-[var(--fg)]/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
