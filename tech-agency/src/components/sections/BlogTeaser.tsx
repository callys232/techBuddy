import Link from "next/link";
import { BlogCard } from "@/components/ui/BlogCard";

const POSTS = [
  { image: "/placeholder.png", category: "Web Dev", title: "Building Offline-First Apps for Low-Bandwidth Markets", author: { name: "Tech Team", avatar: "/placeholder.png" }, readTime: 7, slug: "offline-first-low-bandwidth" },
  { image: "/placeholder.png", category: "Security", title: "NDPR Compliance Checklist for Nigerian SaaS Products", author: { name: "Tech Team", avatar: "/placeholder.png" }, readTime: 5, slug: "ndpr-compliance-checklist" },
  { image: "/placeholder.png", category: "DevOps", title: "Zero-Downtime Deploys with GitHub Actions on Vercel", author: { name: "Tech Team", avatar: "/placeholder.png" }, readTime: 6, slug: "zero-downtime-vercel" },
];

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
        {POSTS.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}
