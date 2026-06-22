import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_POSTS } from "@/mock/blog";

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
    <div className="min-h-screen bg-[var(--bg)]">
      <article className="mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--fg)]/40 mb-8">
          <Link href="/blog" className="hover:text-[var(--primary)] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[var(--primary)]">{post.category}</span>
        </nav>

        {/* Category tag */}
        <span className="inline-block font-mono text-xs text-[var(--primary)] uppercase tracking-[0.2em] border border-[var(--primary)]/30 bg-[var(--primary)]/8 rounded-full px-3 py-1">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="mt-5 font-display text-4xl md:text-5xl font-extrabold text-[var(--fg)] leading-[1.12] tracking-[-0.02em]">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--fg)]/45">
          <span className="font-medium text-[var(--fg)]/65">{post.author.name}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--fg)]/20" />
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="w-1 h-1 rounded-full bg-[var(--fg)]/20" />
          <span>{post.readTime} min read</span>
        </div>

        {/* Excerpt / lead */}
        <p className="mt-8 text-lg text-[var(--fg)]/60 leading-relaxed border-l-2 border-[var(--primary)]/40 pl-5">
          {post.excerpt}
        </p>

        {/* Divider */}
        <hr className="my-10 border-[var(--border)]" />

        {/* Body */}
        <div className="space-y-6 text-[var(--fg)]/80 leading-[1.85] text-[15.5px]">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Tags / related */}
        <div className="mt-12 flex flex-wrap gap-2">
          {["Nigeria Tech", post.category, "TechAgency"].map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs rounded-full border border-[var(--border)] px-3 py-1 text-[var(--fg)]/50"
            >
              #{tag.toLowerCase().replace(/\s+/g, "-")}
            </span>
          ))}
        </div>

        {/* CTA card */}
        <div className="mt-16 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)] mb-2">
            Work with us
          </p>
          <p className="font-display text-xl font-bold text-[var(--fg)] mb-2">
            Need help implementing this?
          </p>
          <p className="text-sm text-[var(--fg)]/50 mb-6 max-w-xs mx-auto">
            Our engineers have shipped production systems across every topic we write about.
          </p>
          <Link
            href="/quote"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-heading font-bold text-sm text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            Get a free quote
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-[var(--fg)]/40 hover:text-[var(--primary)] transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
