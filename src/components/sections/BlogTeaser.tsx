import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";
import { FEATURED_POSTS } from "@/mock/blog";

export function BlogTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-[var(--container-px)] py-[var(--section-y)]">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">From the blog</span>
          <h2 className="mt-2 font-display text-4xl font-extrabold text-[var(--fg)]">
            Built by Builders
          </h2>
        </div>
        <Link href="/blog" className="hidden sm:inline text-sm font-semibold text-[var(--primary)] hover:underline">
          All articles →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_POSTS.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}
