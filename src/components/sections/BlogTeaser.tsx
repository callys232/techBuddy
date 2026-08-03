import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";
import { FEATURED_POSTS } from "@/mock/blog";

export function BlogTeaser() {
  return (
    <section className="relative overflow-hidden mx-auto max-w-6xl px-[var(--container-px)] py-[var(--section-y)]">
      <div className="gradient-line mb-16" />

      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <span className="eyebrow-pill mb-4 inline-flex">
            <span className="pulse-dot" />
            From the blog
          </span>
          <h2 className="mt-4 font-display font-extrabold text-[var(--fg)] tracking-[-0.02em]
                         text-[clamp(1.75rem,3vw,2.5rem)]">
            Built by <span className="gradient-text">Builders</span>
          </h2>
        </div>
        <Link href="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:underline shrink-0">
          All articles →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_POSTS.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}
