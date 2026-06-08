import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  author: { name: string; avatar: string };
  readTime: number;
  slug: string;
}

export function BlogCard({ image, category, title, author, readTime, slug }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)] hover:shadow-[var(--shadow-glow-teal)]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 font-mono text-xs font-semibold rounded-[var(--radius-badge)] bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] px-2.5 py-1">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-[var(--fg)] leading-snug mb-4 line-clamp-2">
          {title}
        </h3>
        <div className="mt-auto flex items-center gap-3">
          <div className="relative h-7 w-7 overflow-hidden rounded-full bg-[var(--border)]">
            <Image src={author.avatar} alt={author.name} fill className="object-cover" />
          </div>
          <span className="text-sm text-[var(--fg)]/60">{author.name}</span>
          <span className="text-[var(--fg)]/30">·</span>
          <span className="text-sm text-[var(--fg)]/40">{readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
