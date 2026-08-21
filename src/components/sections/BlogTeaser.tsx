import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";
import { FEATURED_POSTS } from "@/mock/blog";

export function BlogTeaser() {
  return (
    <section className="relative overflow-hidden mx-auto max-w-6xl px-[var(--container-px)] py-[var(--section-y)]">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4">From the blog</p>
          <h2 className="mt-4 font-heading font-extrabold text-[var(--ink)] tracking-[-0.02em]
                         text-[clamp(1.75rem,3vw,2.5rem)]">
            Built by <span className="text-[var(--brand)]">Builders</span>
          </h2>
        </div>
        <Link href="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] hover:underline shrink-0">
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
