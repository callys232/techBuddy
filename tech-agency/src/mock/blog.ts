export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  image: string;
  category: string;
  title: string;
  author: BlogAuthor;
  readTime: number;
  slug: string;
}

export interface BlogTab {
  id: string;
  label: string;
}

export const BLOG_TABS: BlogTab[] = [
  { id: "all", label: "All" },
  { id: "web-dev", label: "Web Dev" },
  { id: "security", label: "Security" },
  { id: "devops", label: "DevOps" },
  { id: "startup-tech", label: "Startup Tech" },
  { id: "nigeria-tech", label: "Nigeria Tech" },
  { id: "tools", label: "Tools" },
];

export const ALL_POSTS: BlogPost[] = [
  {
    image: "/placeholder.png",
    category: "Web Dev",
    title: "Building Offline-First Apps for Low-Bandwidth Markets",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 7,
    slug: "offline-first-low-bandwidth",
  },
  {
    image: "/placeholder.png",
    category: "Security",
    title: "NDPR Compliance Checklist for Nigerian SaaS Products",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 5,
    slug: "ndpr-compliance-checklist",
  },
  {
    image: "/placeholder.png",
    category: "DevOps",
    title: "Zero-Downtime Deploys with GitHub Actions on Vercel",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "zero-downtime-vercel",
  },
  {
    image: "/placeholder.png",
    category: "Startup Tech",
    title: "How to Launch an MVP in Nigeria for Under ₦2M",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 8,
    slug: "mvp-nigeria-budget",
  },
  {
    image: "/placeholder.png",
    category: "Nigeria Tech",
    title: "The State of Fintech Infrastructure in West Africa 2026",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 10,
    slug: "fintech-west-africa-2026",
  },
  {
    image: "/placeholder.png",
    category: "Tools",
    title: "Top Dev Tools for Remote African Engineering Teams",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "dev-tools-african-teams",
  },
];

/** Home page teaser — first 3 posts */
export const FEATURED_POSTS: BlogPost[] = ALL_POSTS.slice(0, 3);
