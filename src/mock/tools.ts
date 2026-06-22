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
    slug: "timeline-estimator",
    icon: "📅",
    title: "Timeline Estimator",
    desc: "Get a realistic, phase-by-phase delivery timeline based on your project scope, team readiness, and complexity.",
    badge: "New",
    href: "/tools/timeline-estimator",
  },
  {
    slug: "stack-picker",
    icon: "🛠️",
    title: "Tech Stack Picker",
    desc: "Answer 4 questions, get a recommended production stack with hosting, database, auth and payments.",
    href: "/tools/stack-picker",
  },
  {
    slug: "ndpr-checker",
    icon: "🛡️",
    title: "NDPR Compliance Checker",
    desc: "Answer 16 questions and get a compliance score, gap analysis, and priority actions — specific to the Nigerian Data Protection Regulation.",
    badge: "Nigeria-specific",
    href: "/tools/ndpr-checker",
  },
  {
    slug: "mvp-scope",
    icon: "🗺️",
    title: "MVP Scope Generator",
    desc: "Tell us about your idea, answer 8 questions, get a prioritised Phase 1 feature list — what to build, what to cut, and what to do after launch.",
    badge: "For founders",
    href: "/tools/mvp-scope",
  },
  {
    slug: "build-vs-buy",
    icon: "⚖️",
    title: "Build vs Buy Calculator",
    desc: "Should you build it custom or use an existing tool? Get a 3-year cost comparison, break-even analysis, and a clear recommendation.",
    badge: "Popular",
    href: "/tools/build-vs-buy",
  },
  {
    slug: "pmf-score",
    icon: "📈",
    title: "Product-Market Fit Score",
    desc: "10 questions on retention, organic growth, engagement, and revenue signals. Get a PMF score and the specific gaps holding you back.",
    badge: "For founders",
    href: "/tools/pmf-score",
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

/* ── Timeline Estimator data ─────────────────────────────────────────────── */

export interface TimelineProjectType {
  id: string;
  label: string;
  desc: string;
  phases: { discovery: number[]; design: number[]; dev: number[]; qa: number[]; launch: number[] };
}

export interface TimelineOption {
  id: string;
  label: string;
  desc: string;
  weeksDelta: number;
}

export interface TimelineFeature {
  id: string;
  label: string;
  weeks: number;
}

export const TIMELINE_PROJECT_TYPES: TimelineProjectType[] = [
  {
    id: "landing",
    label: "Landing page",
    desc: "Marketing site, product page, or company website",
    phases: { discovery: [0.5, 1], design: [1, 2], dev: [1, 2], qa: [0.5, 1], launch: [0.5, 0.5] },
  },
  {
    id: "webapp",
    label: "Web app / MVP",
    desc: "Full-stack product with auth, database, and core user flows",
    phases: { discovery: [1, 2], design: [2, 3], dev: [4, 6], qa: [1, 2], launch: [0.5, 1] },
  },
  {
    id: "saas",
    label: "SaaS platform",
    desc: "Multi-tenant product with billing, roles, and a full feature set",
    phases: { discovery: [2, 3], design: [3, 4], dev: [8, 12], qa: [2, 3], launch: [1, 1] },
  },
  {
    id: "ecommerce",
    label: "E-commerce store",
    desc: "Product catalogue, cart, checkout, and order management",
    phases: { discovery: [1, 1], design: [2, 3], dev: [4, 6], qa: [1, 2], launch: [0.5, 1] },
  },
  {
    id: "mobile",
    label: "Mobile app",
    desc: "iOS + Android app from a single React Native codebase",
    phases: { discovery: [1, 2], design: [2, 4], dev: [5, 8], qa: [2, 3], launch: [1, 2] },
  },
  {
    id: "dashboard",
    label: "Admin / Dashboard",
    desc: "Internal tool, analytics panel, or operations dashboard",
    phases: { discovery: [1, 1], design: [1, 2], dev: [3, 5], qa: [1, 1], launch: [0.5, 0.5] },
  },
];

export const TIMELINE_FEATURES: TimelineFeature[] = [
  { id: "payments",  label: "Payment integration (Paystack/Flutterwave)", weeks: 1.5 },
  { id: "auth",      label: "Authentication (email, social, OTP)",        weeks: 0.5 },
  { id: "admin",     label: "Admin panel / backoffice",                    weeks: 2   },
  { id: "cms",       label: "CMS / content management",                   weeks: 1   },
  { id: "ai",        label: "AI / LLM feature (chatbot, extraction)",      weeks: 3   },
  { id: "whatsapp",  label: "WhatsApp Business API",                       weeks: 1.5 },
  { id: "analytics", label: "Analytics dashboard / reporting",             weeks: 2   },
  { id: "offline",   label: "Offline / PWA mode",                         weeks: 1.5 },
  { id: "api",       label: "Public REST / GraphQL API",                   weeks: 1.5 },
  { id: "multilang", label: "Multilingual support",                        weeks: 1   },
];

export const TIMELINE_READINESS: TimelineOption[] = [
  { id: "figma",    label: "Figma designs are ready",       desc: "You have final or near-final screen designs we can build from",  weeksDelta: -2   },
  { id: "brand",    label: "Brand kit only, need design",   desc: "You have a logo and brand guide — we handle UX/UI design",       weeksDelta:  0   },
  { id: "scratch",  label: "Starting from zero",            desc: "No designs yet — we do full research, UX, and visual design",    weeksDelta:  2   },
  { id: "nodesign", label: "Functional UI only",            desc: "Speed over aesthetics — clean utility UI, no branding needed",   weeksDelta: -1   },
];

export const TIMELINE_FEEDBACK: TimelineOption[] = [
  { id: "fast",   label: "Same day / next day",         desc: "You can review and approve within 24 hours",                 weeksDelta: -1 },
  { id: "normal", label: "2–3 business days",           desc: "Standard review cycles — most projects run at this pace",   weeksDelta:  0 },
  { id: "slow",   label: "About a week per review",     desc: "Busy schedules — each feedback round takes 5–7 days",       weeksDelta:  3 },
  { id: "multi",  label: "Multiple decision-makers",    desc: "Sign-off requires a committee, board, or multiple founders", weeksDelta:  5 },
];

export const TIMELINE_INTEGRATIONS: TimelineOption[] = [
  { id: "standard", label: "Standard only",                  desc: "Paystack, Supabase, Resend, WhatsApp — well-documented APIs",  weeksDelta: 0 },
  { id: "govt",     label: "Government / regulatory APIs",   desc: "NIBSS, FIRS, CAC, NDPR reporting — slow approval cycles",      weeksDelta: 4 },
  { id: "legacy",   label: "Legacy or existing codebase",    desc: "Integrating with an old system or continuing someone's work",  weeksDelta: 3 },
  { id: "hardware", label: "Hardware, IoT, or unusual tech", desc: "Physical devices, unusual protocols, or undocumented systems", weeksDelta: 5 },
];
