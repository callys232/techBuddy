export type ServiceColor = "teal" | "amber" | "coral";
export type ServiceIcon =
  | "code"
  | "device-mobile"
  | "server"
  | "shield"
  | "cloud"
  | "credit-card"
  | "search"
  | "settings"
  | "coin";

export interface ServiceItem {
  icon: ServiceIcon;
  title: string;
  desc: string;
  outcome: string;
  tag: string;
  href: string;
  color: ServiceColor;
  category: string;
  startingFrom: string;
  /** Not yet bookable — card renders as a non-clickable teaser instead of linking to a detail page or quote flow. */
  comingSoon?: boolean;
}

export interface ServiceTab {
  id: string;
  label: string;
}

export interface PricingTier {
  tier: string;
  price: string;
  /** Numeric NGN value backing `price`, used to render a converted-currency hint. */
  ngnValue: number;
  period: string;
  desc: string;
  features: string[];
  recommended: boolean;
  ctaText: string;
}

export const SERVICE_TABS: ServiceTab[] = [
  { id: "all",        label: "All" },
  { id: "web",        label: "Web" },
  { id: "mobile",     label: "Mobile" },
  { id: "devops",     label: "DevOps" },
  { id: "security",   label: "Security" },
  { id: "fintech",    label: "Fintech" },
  { id: "ai",         label: "AI" },
  { id: "design",     label: "Design" },
  { id: "data",       label: "Data" },
  { id: "training",   label: "Training" },
  { id: "maintenance", label: "Maintenance" },
  { id: "web3",       label: "Web3" },
];

export const ALL_SERVICE_SLUGS: string[] = [
  "web-development",
  "mobile-apps",
  "devops",
  "security-pentesting",
  "cloud-scaling",
  "fintech-payments",
  "tech-audit",
  "maintenance",
  "ai-integration",
  "whatsapp-api",
  "ui-ux-design",
  "data-analytics",
  "seo-growth",
  "training",
];

export const ALL_SERVICES: ServiceItem[] = [
  {
    icon: "code",
    title: "Web Development",
    desc: "Custom web application development for customer portals, marketplaces, e-commerce, SaaS, and internal operations.",
    outcome: "Turn a manual or fragmented process into one fast, dependable web product",
    tag: "Web",
    href: "/services/web-development",
    color: "teal",
    category: "web",
    startingFrom: "from ₦200k",
  },
  {
    icon: "device-mobile",
    title: "Mobile Apps",
    desc: "iOS and Android app development with React Native or Flutter, designed for low-data environments and everyday devices.",
    outcome: "Give customers a mobile experience they can trust wherever they are",
    tag: "Mobile",
    href: "/services/mobile-apps",
    color: "amber",
    category: "mobile",
    startingFrom: "from ₦800k",
  },
  {
    icon: "server",
    title: "DevOps & CI/CD",
    desc: "DevOps consulting, CI/CD automation, containers, monitoring, infrastructure as code, and disaster recovery.",
    outcome: "Release confidently without every deployment becoming an emergency",
    tag: "DevOps",
    href: "/services/devops",
    color: "teal",
    category: "devops",
    startingFrom: "from ₦300k",
  },
  {
    icon: "shield",
    title: "Security & Pentesting",
    desc: "Web and API penetration testing, OWASP assessments, security hardening, and NDPR compliance reviews.",
    outcome: "Know exactly where your vulnerabilities are before attackers do",
    tag: "Security",
    href: "/services/security-pentesting",
    color: "coral",
    category: "security",
    startingFrom: "from ₦300k",
  },
  {
    icon: "cloud",
    title: "Cloud & Scaling",
    desc: "Cloud architecture, CDN optimisation, load testing, observability, cost control, and infrastructure scaling.",
    outcome: "Prepare your platform for growth before traffic exposes the weak points",
    tag: "Cloud",
    href: "/services/cloud-scaling",
    color: "amber",
    category: "devops",
    startingFrom: "from ₦350k",
  },
  {
    icon: "credit-card",
    title: "Fintech & Payments",
    desc: "Secure Paystack and Flutterwave integrations, payment workflows, reconciliation, subscriptions, and fintech product engineering.",
    outcome: "Make it easier for customers to pay—and easier for your team to reconcile",
    tag: "Fintech",
    href: "/services/fintech-payments",
    color: "teal",
    category: "fintech",
    startingFrom: "from ₦350k",
  },
  {
    icon: "search",
    title: "Tech Audit",
    desc: "A practical review of performance, security, technical SEO, accessibility, architecture, and code quality.",
    outcome: "Find the issues slowing growth before they become a costly rebuild",
    tag: "Audit",
    href: "/services/tech-audit",
    color: "amber",
    category: "web",
    startingFrom: "from ₦200k",
  },
  {
    icon: "settings",
    title: "Maintenance Plans",
    desc: "Ongoing software maintenance, monitoring, security updates, bug fixes, and carefully scoped feature improvements.",
    outcome: "Keep your product healthy while your team focuses on customers and growth",
    tag: "Maintenance",
    href: "/services/maintenance",
    color: "teal",
    category: "maintenance",
    startingFrom: "₦200k/mo",
  },
  {
    icon: "code",
    title: "AI & LLM Integration",
    desc: "Practical AI integration for support, document processing, internal knowledge, recommendations, and workflow automation.",
    outcome: "Automate repetitive work without forcing AI into places it does not belong",
    tag: "AI",
    href: "/services/ai-integration",
    color: "teal",
    category: "ai",
    startingFrom: "from ₦400k",
  },
  {
    icon: "device-mobile",
    title: "WhatsApp Business API",
    desc: "WhatsApp Business API integration for support, lead qualification, OTPs, order updates, and guided customer workflows.",
    outcome: "Help customers get things done inside the app they already use every day",
    tag: "WhatsApp",
    href: "/services/whatsapp-api",
    color: "amber",
    category: "mobile",
    startingFrom: "from ₦250k",
  },
  {
    icon: "code",
    title: "UI/UX Design",
    desc: "Research-led UI/UX design, user journeys, wireframes, interactive Figma prototypes, and scalable design systems.",
    outcome: "Make complex workflows feel clear from the first screen",
    tag: "Design",
    href: "/services/ui-ux-design",
    color: "coral",
    category: "design",
    startingFrom: "from ₦200k",
  },
  {
    icon: "search",
    title: "Data & Analytics",
    desc: "Analytics dashboards, product tracking, business intelligence integrations, reporting, and reliable data pipelines.",
    outcome: "Replace scattered spreadsheets with a clear view of what the business is doing",
    tag: "Data",
    href: "/services/data-analytics",
    color: "amber",
    category: "data",
    startingFrom: "from ₦300k",
  },
  {
    icon: "search",
    title: "SEO & Growth",
    desc: "Technical SEO, search-led content strategy, Core Web Vitals, structured data, and conversion-focused landing pages.",
    outcome: "Help high-intent prospects find you when they are already looking for a solution",
    tag: "SEO",
    href: "/services/seo-growth",
    color: "teal",
    category: "web",
    startingFrom: "from ₦200k/mo",
  },
  {
    icon: "settings",
    title: "Training & Tech Transfer",
    desc: "Hands-on engineering workshops covering React, system design, DevOps, application security, and your team's stack.",
    outcome: "Build the skills your team needs to solve the next problem without outside help",
    tag: "Training",
    href: "/services/training",
    color: "amber",
    category: "training",
    startingFrom: "from ₦300k",
  },
  {
    icon: "coin",
    title: "Web3 & Blockchain",
    desc: "Smart contracts, wallet integrations, and on-chain payment rails — for teams exploring what's next.",
    outcome: "Be ready to ship when your Web3 use case is",
    tag: "Coming soon",
    href: "/services",
    color: "coral",
    category: "web3",
    startingFrom: "",
    comingSoon: true,
  },
];

/** Home page preview — first 6 services */
export const FEATURED_SERVICES: ServiceItem[] = ALL_SERVICES.slice(0, 6);

/** Single source of truth for the maintenance/retainer tiers — shown on both
 *  /services and /pricing. Previously these were two separately hand-written
 *  arrays that had already drifted slightly out of sync with each other. */
export const PRICING_TIERS: PricingTier[] = [
  {
    tier: "Starter",
    price: "₦200k",
    ngnValue: 200_000,
    period: "/month",
    desc: "Keep your product running smoothly with monthly maintenance and monitoring.",
    features: [
      "Security patches & dependency updates",
      "99.5% uptime monitoring",
      "SSL & hosting management",
      "Monthly performance report",
      "Bug fixes (up to 4 hrs/mo)",
    ],
    recommended: false,
    ctaText: "Get started",
  },
  {
    tier: "Growth",
    price: "₦450k",
    ngnValue: 450_000,
    period: "/month",
    desc: "Active product development alongside maintenance. Ideal for products with a growing user base.",
    features: [
      "Everything in Starter",
      "Up to 8 hrs of feature additions",
      "Priority WhatsApp support",
      "Monthly SEO + performance audit",
      "Quarterly security assessment",
      "Dedicated account manager",
    ],
    recommended: true,
    ctaText: "Most popular",
  },
  {
    tier: "Enterprise",
    price: "₦900k+",
    ngnValue: 900_000,
    period: "/month",
    desc: "A dedicated engineer embedded in your team. For products that can't afford to be down.",
    features: [
      "Everything in Growth",
      "Full-time dedicated engineer",
      "4-hour response SLA",
      "Slack / WhatsApp war room",
      "Bi-weekly strategy calls",
      "Custom integrations included",
    ],
    recommended: false,
    ctaText: "Contact us",
  },
];

export const DEVOPS_SERVICES: string[] = [
  "CI/CD Pipelines",
  "Containerisation (Docker / K8s)",
  "GitOps & Infrastructure as Code",
  "Monitoring & Alerting",
  "Disaster Recovery",
  "Cloud Cost Audits",
];

export const DEVOPS_STACK: string[] = [
  "Docker",
  "Kubernetes",
  "Terraform",
  "GitHub Actions",
  "Grafana",
  "AWS",
  "GCP",
  "Azure",
];

export const SERVICE_PROCESS_STEPS: string[] = [
  "Discovery",
  "Design",
  "Build",
  "Test",
  "Launch",
  "Support",
];

export const SERVICE_INCLUDED_FEATURES: string[] = [
  "Discovery & strategy",
  "Design & prototyping",
  "Development",
  "Testing & QA",
  "Launch & support",
];
