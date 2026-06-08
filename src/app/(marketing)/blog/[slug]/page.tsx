import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <article className="mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        <span className="font-mono text-sm text-[var(--primary)] uppercase tracking-widest">
          Web Dev
        </span>
        <h1 className="mt-4 font-display text-5xl font-extrabold text-[var(--fg)] leading-tight">
          {slug.replace(/-/g, " ")}
        </h1>
        <div className="mt-6 flex items-center gap-4 text-sm text-[var(--fg)]/50">
          <span>Tech Team</span>
          <span>·</span>
          <span>5 min read</span>
        </div>
        {/* Article body populated from Sanity portable text in production */}
        <div className="mt-12 prose prose-invert max-w-none text-[var(--fg)]/80">
          <p>Article content coming from Sanity CMS.</p>
        </div>

        {/* Service CTA */}
        <div className="mt-16 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-display text-xl font-bold text-[var(--fg)] mb-4">
            Need help with this?
          </p>
          <a
            href="/quote"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            Get a free quote
          </a>
        </div>
      </article>
    </div>
  );
}
