export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: BlogAuthor;
  readTime: number;
  slug: string;
  date: string;
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
    excerpt: "Most Nigerian users are on 3G or intermittent WiFi. Here's how to architect apps that feel fast regardless of network conditions — using service workers, background sync, and optimistic UI.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 7,
    slug: "offline-first-low-bandwidth",
    date: "2026-05-14",
  },
  {
    image: "/placeholder.png",
    category: "Security",
    title: "NDPR Compliance Checklist for Nigerian SaaS Products",
    excerpt: "The Nigeria Data Protection Regulation has real teeth. This 12-point checklist covers data residency, consent capture, breach notification timelines, and what your privacy policy must contain.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 5,
    slug: "ndpr-compliance-checklist",
    date: "2026-05-07",
  },
  {
    image: "/placeholder.png",
    category: "DevOps",
    title: "Zero-Downtime Deploys with GitHub Actions on Vercel",
    excerpt: "Rolling deployments, feature flags, and blue-green switching — a practical guide to shipping to production without a maintenance window, using only GitHub Actions and Vercel's API.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "zero-downtime-vercel",
    date: "2026-04-28",
  },
  {
    image: "/placeholder.png",
    category: "Startup Tech",
    title: "How to Launch an MVP in Nigeria for Under ₦2M",
    excerpt: "We've scoped hundreds of Nigerian startup builds. This is the exact budget breakdown — stack choices, hosting, payments, and what to cut — to get a real product live for under ₦2 million.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 8,
    slug: "mvp-nigeria-budget",
    date: "2026-04-15",
  },
  {
    image: "/placeholder.png",
    category: "Nigeria Tech",
    title: "The State of Fintech Infrastructure in West Africa 2026",
    excerpt: "From Paystack's API evolution to the CBN's open banking framework and M-Pesa's westward expansion — a technical look at where the rails are being laid for the next decade of African fintech.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 10,
    slug: "fintech-west-africa-2026",
    date: "2026-04-01",
  },
  {
    image: "/placeholder.png",
    category: "Tools",
    title: "Top Dev Tools for Remote African Engineering Teams",
    excerpt: "Linear over Jira, Supabase over Firebase, Vercel over AWS for most teams — the tools that actually work for distributed African engineering teams in 2026, ranked by adoption in our network.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "dev-tools-african-teams",
    date: "2026-03-20",
  },
  {
    image: "/placeholder.png",
    category: "AI",
    title: "Integrating Claude & GPT-4 into Nigerian Business Workflows",
    excerpt: "Document extraction, WhatsApp bots, invoice parsing, customer support — real AI use cases we've deployed for Nigerian businesses, with architecture notes and cost breakdowns.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 9,
    slug: "ai-integration-nigerian-business",
    date: "2026-03-10",
  },
  {
    image: "/placeholder.png",
    category: "Web Dev",
    title: "Paystack vs Flutterwave: Which API Should You Integrate in 2026?",
    excerpt: "A technical comparison from engineers who've integrated both. We cover SDK quality, webhook reliability, international payouts, sandbox fidelity, and which to pick for your specific use case.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 7,
    slug: "paystack-vs-flutterwave-2026",
    date: "2026-02-25",
  },
  {
    image: "/placeholder.png",
    category: "Startup Tech",
    title: "How to Hire and Manage Remote Engineers in Nigeria",
    excerpt: "Equity vs salary, async communication, code review culture, and how to run a productive remote engineering team when your talent is spread across Lagos, Abuja, Accra and Nairobi.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 8,
    slug: "hiring-remote-engineers-nigeria",
    date: "2026-02-10",
  },
  {
    image: "/placeholder.png",
    category: "Security",
    title: "WhatsApp Business API Security: What Most Developers Get Wrong",
    excerpt: "Message signing, webhook validation, session token storage, and how to avoid the top 5 security mistakes we see in Nigerian WhatsApp bot implementations — with corrected code examples.",
    author: { name: "Tech Team", avatar: "/placeholder.png" },
    readTime: 6,
    slug: "whatsapp-api-security",
    date: "2026-01-28",
  },
];

/** Home page teaser — first 3 posts */
export const FEATURED_POSTS: BlogPost[] = ALL_POSTS.slice(0, 3);
