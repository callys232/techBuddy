export interface FreeTool {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  href: string;
  premium?: boolean;
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
  {
    slug: "resume-maker",
    icon: "📄",
    title: "Resume Maker",
    desc: "Build a professional PDF resume in minutes — Classic, Modern, or Minimal template. Download free with a free account.",
    badge: "New",
    href: "/tools/resume-maker",
  },
  {
    slug: "sport-predictor",
    icon: "⚽",
    title: "Sport Predictor",
    desc: "Pick a live fixture from the Premier League, La Liga, Serie A, Bundesliga, Champions League or NBA — get a free win-probability analysis and form guide.",
    badge: "New",
    href: "/tools/sport-predictor",
  },
  {
    slug: "qr-code-generator",
    icon: "🔲",
    title: "QR Code Generator",
    desc: "Generate a QR code for a link, WiFi network, WhatsApp chat, vCard or plain text — customise the colour and download as PNG or SVG.",
    badge: "New",
    href: "/tools/qr-code-generator",
  },
  {
    slug: "invoice-generator",
    icon: "🧾",
    title: "Invoice Generator",
    desc: "Build a professional invoice with line items, VAT and multi-currency support — download as a branded PDF in seconds.",
    badge: "New",
    href: "/tools/invoice-generator",
  },
  {
    slug: "name-generator",
    icon: "✨",
    title: "Business Name Generator",
    desc: "Describe your business, get 15 AI-generated name ideas with an instant .com / .ng availability check.",
    badge: "AI-powered",
    href: "/tools/name-generator",
  },
  {
    slug: "cover-letter-generator",
    icon: "✉️",
    title: "Cover Letter Generator",
    desc: "Tell us the role and your strengths — get a tailored, ready-to-send cover letter in seconds. Pairs perfectly with Resume Maker.",
    badge: "AI-powered",
    href: "/tools/cover-letter-generator",
  },
  {
    slug: "business-plan-generator",
    icon: "📊",
    title: "AI Business Plan Generator",
    desc: "Turn your idea into a structured business plan — market analysis, business model, go-to-market and financial summary, ready to share with investors.",
    badge: "Premium",
    href: "/tools/business-plan-generator",
    premium: true,
  },
  {
    slug: "premium-audit",
    icon: "🚀",
    title: "Premium Audit Report",
    desc: "An instant, automated deep-dive report on top of the free audit — security headers, SEO signals, performance and a prioritised fix list as a branded PDF.",
    badge: "Premium",
    href: "/tools/premium-audit",
    premium: true,
  },
  {
    slug: "whatsapp-bot-builder",
    icon: "🤖",
    title: "WhatsApp Bot Flow Builder",
    desc: "Design your WhatsApp auto-reply flow — keywords, menus and responses — then send it to our team to deploy on WhatsApp Business API.",
    badge: "New",
    href: "/tools/whatsapp-bot-builder",
  },
  {
    slug: "telegram-bot-builder",
    icon: "✈️",
    title: "Telegram Bot Flow Builder",
    desc: "Design interactive Telegram bots with slash commands, inline buttons, live preview, and instant alerts. Production Node & Python server exports.",
    badge: "Premium",
    href: "/tools/telegram-bot-builder",
    premium: true,
  },
  {
    slug: "fintech-fees-calculator",
    icon: "💳",
    title: "Fintech Fees Calculator",
    desc: "Compare Paystack vs Flutterwave transaction costs at your real volume — local and international cards, side by side.",
    badge: "New",
    href: "/tools/fintech-fees-calculator",
  },
  {
    slug: "downtime-cost-calculator",
    icon: "🔥",
    title: "Downtime Cost Calculator",
    desc: "See what an hour of downtime actually costs your business — revenue at risk plus team productivity loss, by business type.",
    badge: "New",
    href: "/tools/downtime-cost-calculator",
  },
  {
    slug: "repo-health-scan",
    icon: "🩺",
    title: "Repo Health Scan",
    desc: "Paste a public GitHub repo URL — get an instant health score on staleness, licensing, and issue backlog.",
    badge: "New",
    href: "/tools/repo-health-scan",
  },
  {
    slug: "hire-rate-calculator",
    icon: "🇳🇬",
    title: "Nigerian Tech Hire Rate Calculator",
    desc: "Typical monthly rates for engineers, designers and PMs in the Lagos/Abuja market, by role and seniority.",
    badge: "New",
    href: "/tools/hire-rate-calculator",
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

/* ── Fintech fees calculator data ────────────────────────────────────────────
   Rates as publicly listed by each provider as of 2026 — verify current
   pricing on paystack.com / flutterwave.com before relying on this for a
   real financial decision; providers change rates without much notice. ── */

export interface FeeProvider {
  id: string;
  name: string;
  localRate: number;       // fraction, e.g. 0.015 = 1.5%
  localFlatFeeNgn: number; // added on top of the percentage, local cards
  localCapNgn: number;     // fee never exceeds this, local cards
  localFreeUnderNgn: number; // transactions at/under this pay zero fee (0 = no such threshold)
  intlRate: number;
  intlFlatFeeNgn: number;
}

export const FEE_PROVIDERS: FeeProvider[] = [
  { id: "paystack",    name: "Paystack",    localRate: 0.015, localFlatFeeNgn: 100, localCapNgn: 2000, localFreeUnderNgn: 2500, intlRate: 0.039, intlFlatFeeNgn: 100 },
  { id: "flutterwave", name: "Flutterwave", localRate: 0.014, localFlatFeeNgn: 0,   localCapNgn: 2000, localFreeUnderNgn: 0,    intlRate: 0.038, intlFlatFeeNgn: 0   },
];

/** Per-transaction fee in NGN for a given provider, amount, and card type. */
export function computeProviderFee(provider: FeeProvider, amountNgn: number, cardType: "local" | "intl"): number {
  if (cardType === "local") {
    if (provider.localFreeUnderNgn > 0 && amountNgn <= provider.localFreeUnderNgn) return 0;
    return Math.min(amountNgn * provider.localRate + provider.localFlatFeeNgn, provider.localCapNgn);
  }
  return amountNgn * provider.intlRate + provider.intlFlatFeeNgn;
}

/* ── Downtime cost calculator data ───────────────────────────────────────── */

export interface DowntimeBusinessType {
  id: string;
  label: string;
  desc: string;
  /** Fraction of hourly revenue actually at risk during downtime — a SaaS
   *  losing login access isn't losing 100% of its hourly run-rate the way a
   *  storefront going dark is, but a fintech outage costs more than raw
   *  revenue once you count trust and compliance exposure. */
  revenueFactor: number;
}

export const DOWNTIME_BUSINESS_TYPES: DowntimeBusinessType[] = [
  { id: "ecommerce", label: "E-commerce / online store", desc: "Checkout stops the moment the site goes down",                     revenueFactor: 1.0  },
  { id: "saas",      label: "SaaS / subscription product", desc: "Users locked out — support load and churn risk, not a direct sale lost", revenueFactor: 0.4  },
  { id: "fintech",   label: "Fintech / payments",         desc: "Failed transactions plus trust and compliance exposure on top",    revenueFactor: 1.2  },
  { id: "internal",  label: "Internal tool",              desc: "No direct revenue loss — this is pure team productivity cost",     revenueFactor: 0.25 },
];

/* ── Repo health scan data ───────────────────────────────────────────────── */

export interface RepoHealthFlag {
  ok: boolean;
  label: string;
}

/* ── Nigerian tech hire rate calculator data ─────────────────────────────────
   General Lagos/Abuja market estimates as of 2026 — not sourced from a
   survey, so treat these as a starting conversation with a candidate, not a
   guarantee. Real offers vary by company stage, exact skill set, and whether
   the role is remote-for-a-foreign-company (which pays meaningfully more). ── */

export interface HireRole {
  id: string;
  label: string;
}

export const HIRE_ROLES: HireRole[] = [
  { id: "frontend",  label: "Frontend Engineer" },
  { id: "backend",   label: "Backend Engineer" },
  { id: "fullstack", label: "Full-Stack Engineer" },
  { id: "mobile",    label: "Mobile Engineer" },
  { id: "devops",    label: "DevOps Engineer" },
  { id: "design",    label: "Product Designer" },
  { id: "pm",        label: "Product Manager" },
];

export interface HireSeniority {
  id: string;
  label: string;
  yearsRange: string;
}

export const HIRE_SENIORITY: HireSeniority[] = [
  { id: "junior", label: "Junior",     yearsRange: "0–2 years" },
  { id: "mid",    label: "Mid-level",  yearsRange: "2–5 years" },
  { id: "senior", label: "Senior",     yearsRange: "5+ years" },
];

/** Monthly NGN band [min, max] by role then seniority. */
export const HIRE_RATE_BANDS: Record<string, Record<string, [number, number]>> = {
  frontend:  { junior: [180_000, 400_000], mid: [450_000, 900_000],   senior: [900_000,   2_000_000] },
  backend:   { junior: [200_000, 450_000], mid: [500_000, 1_000_000], senior: [1_000_000, 2_300_000] },
  fullstack: { junior: [220_000, 480_000], mid: [550_000, 1_100_000], senior: [1_100_000, 2_500_000] },
  mobile:    { junior: [200_000, 450_000], mid: [500_000, 1_000_000], senior: [1_000_000, 2_200_000] },
  devops:    { junior: [250_000, 500_000], mid: [600_000, 1_200_000], senior: [1_200_000, 2_600_000] },
  design:    { junior: [180_000, 380_000], mid: [420_000, 850_000],   senior: [850_000,   1_800_000] },
  pm:        { junior: [220_000, 450_000], mid: [500_000, 1_000_000], senior: [1_000_000, 2_200_000] },
};
