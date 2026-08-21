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
    <Link href={`/blog/${slug}`} className="card-interactive group flex flex-col overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 font-mono text-xs font-semibold rounded-[var(--radius-badge)] bg-[var(--brand)]/10 text-[var(--brand)] px-2.5 py-1">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-[var(--ink)] leading-snug mb-3 line-clamp-2">
          {title}
        </h3>
        <div className="mt-auto flex items-center gap-3">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-[var(--border)]">
            <Image src={author.avatar} alt={author.name} fill className="object-cover" />
          </div>
          <span className="text-sm text-[var(--ink-muted)]">{author.name}</span>
          <span className="text-[var(--ink-faint)]">·</span>
          <span className="text-sm text-[var(--ink-faint)]">{readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
