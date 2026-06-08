import type { Metadata } from "next";
import { AppCard } from "@/components/ui/AppCard";
import { SERVICE_PROCESS_STEPS, SERVICE_INCLUDED_FEATURES } from "@/mock/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return { title };
}

export function generateStaticParams() {
  return [
    { slug: "web-development" },
    { slug: "mobile-apps" },
    { slug: "devops" },
    { slug: "security-pentesting" },
    { slug: "cloud-scaling" },
    { slug: "fintech-payments" },
    { slug: "tech-audit" },
    { slug: "maintenance" },
  ];
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <span className="font-mono text-sm text-[var(--primary)] uppercase tracking-widest">
          Service
        </span>
        <h1 className="mt-3 font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          {title}
        </h1>
      </section>

      {/* What's included */}
      <section className="px-[var(--container-px)] pb-16">
        <h2 className="font-display text-3xl font-bold text-[var(--fg)] mb-8">
          What&apos;s Included
        </h2>
        <ul className="space-y-3 max-w-2xl">
          {SERVICE_INCLUDED_FEATURES.map((item) => (
            <li key={item} className="flex items-center gap-3 text-[var(--fg)]/80">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Process timeline */}
      <section className="px-[var(--container-px)] py-16 bg-[var(--surface)]">
        <h2 className="font-display text-3xl font-bold text-[var(--fg)] mb-10">
          Our Process
        </h2>
        <ol className="flex flex-wrap gap-4">
          {SERVICE_PROCESS_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--bg)] text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-[var(--fg)]">{step}</span>
              {i < SERVICE_PROCESS_STEPS.length - 1 && <span className="text-[var(--border)] ml-2">→</span>}
            </li>
          ))}
        </ol>
      </section>

      {/* Case studies */}
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h2 className="font-display text-3xl font-bold text-[var(--fg)] mb-10">
          Related Work
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AppCard
            image="/placeholder.png"
            name="Sample Project"
            tags={["Next.js", "Supabase"]}
            stack={["Next.js", "TypeScript", "Tailwind"]}
            liveUrl="#"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center bg-[var(--surface)]">
        <h2 className="font-display text-4xl font-bold text-[var(--fg)] mb-6">
          Ready to start?
        </h2>
        <a
          href={`/quote?service=${slug}`}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] transition-all hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] active:scale-95"
        >
          Get a quote for {title}
        </a>
      </section>
    </div>
  );
}
