import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevOps & CI/CD",
  description:
    "Automated pipelines, containers, GitOps, monitoring, and disaster recovery for production-grade systems.",
};

const SERVICES = [
  "CI/CD Pipelines",
  "Containerization (Docker / K8s)",
  "GitOps & Infrastructure as Code",
  "Monitoring & Alerting",
  "Disaster Recovery",
  "Cloud Cost Audits",
];

const STACK = [
  "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Grafana", "AWS", "GCP", "Azure",
];

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
          {SERVICES.map((s) => (
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
          {STACK.map((tech) => (
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
