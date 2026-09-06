import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_POSTS } from "@/mock/blog";
import { PageVectors } from "@/components/bg/PageVectors";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--page)]">
      <div className="relative overflow-hidden">
        <PageVectors variant="bottom-left" intensity={0.28} />
      </div>
      <article className="relative mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--ink)]/40 mb-8">
          <Link href="/blog" className="hover:text-[var(--brand)] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[var(--brand)]">{post.category}</span>
        </nav>

        {/* Category tag */}
        <span className="inline-block font-mono text-xs text-[var(--brand)] uppercase tracking-[0.2em] border border-[var(--brand)]/30 bg-[var(--brand)]/8 rounded-full px-3 py-1">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="mt-5 h-display">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--ink)]/45">
          <span className="font-medium text-[var(--ink)]/65">{post.author.name}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink)]/20" />
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="w-1 h-1 rounded-full bg-[var(--ink)]/20" />
          <span>{post.readTime} min read</span>
        </div>

        {/* Excerpt / lead */}
        <p className="mt-8 text-lg text-[var(--ink)]/60 leading-relaxed border-l-2 border-[var(--brand)]/40 pl-5">
          {post.excerpt}
        </p>

        {/* Divider */}
        <hr className="my-10 border-[var(--border)]" />

        {/* Body */}
        <div className="space-y-6 text-[var(--ink)]/80 leading-[1.85] text-[15.5px]">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {post.sources?.length ? (
          <aside className="mt-10 border-t border-[var(--border)] pt-6" aria-label="Article sources">
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
              Sources and further reading
            </p>
            <ul className="space-y-2">
              {post.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--ink-muted)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--brand)]">
                    {source.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        {/* Tags / related */}
        <div className="mt-12 flex flex-wrap gap-2">
          {["Nigeria Tech", post.category, "TechAgency"].map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs rounded-full border border-[var(--border)] px-3 py-1 text-[var(--ink)]/50"
            >
              #{tag.toLowerCase().replace(/\s+/g, "-")}
            </span>
          ))}
        </div>

        {/* CTA card */}
        <div className="mt-16 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--brand)] mb-2">
            Work with us
          </p>
          <p className="font-display text-xl font-bold text-[var(--ink)] mb-2">
            Need help implementing this?
          </p>
          <p className="text-sm text-[var(--ink)]/50 mb-6 max-w-xs mx-auto">
            Our engineers have shipped production systems across every topic we write about.
          </p>
          <Link
            href="/quote"
            className="btn-primary h-11 px-8 text-sm"
          >
            Get a free quote
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-[var(--ink)]/40 hover:text-[var(--brand)] transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
