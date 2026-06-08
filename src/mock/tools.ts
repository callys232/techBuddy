export interface FreeTool {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  href: string;
}

export const FREE_TOOLS: FreeTool[] = [
  {
    slug: "cost-estimator",
    icon: "💰",
    title: "Project Cost Estimator",
    desc: "Get an instant Naira estimate for your build — select your project type, features and timeline.",
    badge: "Most used",
    href: "/tools/cost-estimator",
  },
  {
    slug: "stack-picker",
    icon: "🛠️",
    title: "Tech Stack Picker",
    desc: "Answer 4 questions, get a recommended production stack with hosting, database, auth and payments.",
    href: "/tools/stack-picker",
  },
  {
    slug: "free-audit",
    icon: "🔍",
    title: "Free Tech Audit",
    desc: "Submit your site URL and we'll manually audit performance, security, SEO and code quality — free.",
    badge: "Free",
    href: "/tools/free-audit",
  },
];

/* ── Cost estimator data ─────────────────────────────────────────────────── */

export interface ProjectType {
  id: string;
  label: string;
  base: number;
}

export interface FeatureAddon {
  id: string;
  label: string;
  cost: number;
}

export const PROJECT_TYPES: ProjectType[] = [
  { id: "landing",   label: "Landing page",      base:   250_000 },
  { id: "webapp",    label: "Web application",   base:   900_000 },
  { id: "saas",      label: "SaaS platform",     base: 1_500_000 },
  { id: "ecommerce", label: "E-commerce store",  base:   800_000 },
  { id: "mobile",    label: "Mobile app",        base: 1_500_000 },
  { id: "dashboard", label: "Admin / Dashboard", base:   700_000 },
];

export const FEATURE_ADDONS: FeatureAddon[] = [
  { id: "auth",       label: "Authentication",        cost:  200_000 },
  { id: "payments",   label: "Payment integration",   cost:  250_000 },
  { id: "admin",      label: "Admin panel",           cost:  250_000 },
  { id: "cms",        label: "CMS / content system",  cost:  200_000 },
  { id: "api",        label: "REST / GraphQL API",    cost:  250_000 },
  { id: "whatsapp",   label: "WhatsApp integration",  cost:  200_000 },
  { id: "ai",         label: "AI / chatbot feature",  cost:  450_000 },
  { id: "multilang",  label: "Multilingual support",  cost:  150_000 },
  { id: "offline",    label: "Offline / PWA mode",    cost:  200_000 },
  { id: "analytics",  label: "Analytics dashboard",   cost:  250_000 },
];

export const TIMELINE_MULTIPLIERS: { id: string; label: string; mult: number }[] = [
  { id: "asap",    label: "ASAP (< 4 weeks)",    mult: 1.4 },
  { id: "short",   label: "1 – 3 months",        mult: 1.0 },
  { id: "medium",  label: "3 – 6 months",        mult: 0.95 },
  { id: "relaxed", label: "No rush",             mult: 0.88 },
];

/* ── Stack picker data ───────────────────────────────────────────────────── */

export interface StackRecommendation {
  id: string;
  name: string;
  tagline: string;
  stack: { role: string; tech: string }[];
  why: string;
}

export const STACK_RECOMMENDATIONS: StackRecommendation[] = [
  {
    id: "nextjs-supabase",
    name: "Next.js + Supabase",
    tagline: "Best for most web products",
    stack: [
      { role: "Frontend",  tech: "Next.js 16 (App Router)" },
      { role: "Database",  tech: "Supabase (Postgres + RLS)" },
      { role: "Auth",      tech: "Supabase Auth" },
      { role: "Hosting",   tech: "Vercel" },
      { role: "Payments",  tech: "Paystack" },
      { role: "Email",     tech: "Resend" },
    ],
    why: "Full-stack JavaScript, instant APIs, built-in auth, edge deployment — ships fast and scales to millions without rewrites.",
  },
  {
    id: "react-native",
    name: "React Native + Expo",
    tagline: "Best for mobile-first products",
    stack: [
      { role: "Mobile",   tech: "React Native + Expo" },
      { role: "Backend",  tech: "Supabase + Edge Functions" },
      { role: "Push",     tech: "Expo Notifications" },
      { role: "Payments", tech: "Paystack Mobile SDK" },
      { role: "Store",    tech: "App Store + Google Play" },
    ],
    why: "Single codebase for iOS and Android. Expo handles OTA updates, push notifications, and store submissions out of the box.",
  },
  {
    id: "nextjs-django",
    name: "Next.js + Django",
    tagline: "Best for data-heavy / fintech products",
    stack: [
      { role: "Frontend",  tech: "Next.js 16" },
      { role: "Backend",   tech: "Django REST Framework" },
      { role: "Database",  tech: "PostgreSQL + Redis" },
      { role: "Auth",      tech: "JWT + refresh tokens" },
      { role: "Hosting",   tech: "Railway / AWS" },
      { role: "Payments",  tech: "Flutterwave" },
    ],
    why: "Django's mature ORM and admin panel make it ideal for complex data models, regulatory compliance and financial reporting.",
  },
  {
    id: "nextjs-node",
    name: "Next.js + Node/Express",
    tagline: "Best for high-scale API workloads",
    stack: [
      { role: "Frontend",  tech: "Next.js 16" },
      { role: "API",       tech: "Node.js + Express" },
      { role: "Database",  tech: "PostgreSQL + Drizzle ORM" },
      { role: "Queue",     tech: "BullMQ + Redis" },
      { role: "Hosting",   tech: "Docker + GCP Cloud Run" },
      { role: "CDN",       tech: "Cloudflare" },
    ],
    why: "Full JavaScript across the stack, easy to hire for, and Node's event loop handles thousands of concurrent connections efficiently.",
  },
];
