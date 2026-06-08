export type ServiceColor = "teal" | "amber" | "coral";
export type ServiceIcon =
  | "code"
  | "device-mobile"
  | "server"
  | "shield"
  | "cloud"
  | "credit-card"
  | "search"
  | "settings";

export interface ServiceItem {
  icon: ServiceIcon;
  title: string;
  desc: string;
  tag: string;
  href: string;
  color: ServiceColor;
  category: string;
}

export interface ServiceTab {
  id: string;
  label: string;
}

export interface PricingTier {
  tier: string;
  price: string;
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
    desc: "Full-stack apps, CMS, e-commerce, PWAs — offline-first for Nigerian connectivity.",
    tag: "Web",
    href: "/services/web-development",
    color: "teal",
    category: "web",
  },
  {
    icon: "device-mobile",
    title: "Mobile Apps",
    desc: "React Native, Flutter, USSD & SMS integration — works on feature phones.",
    tag: "Mobile",
    href: "/services/mobile-apps",
    color: "amber",
    category: "mobile",
  },
  {
    icon: "server",
    title: "DevOps & CI/CD",
    desc: "Automated pipelines, GitOps, containers, monitoring and disaster recovery.",
    tag: "DevOps",
    href: "/services/devops",
    color: "teal",
    category: "devops",
  },
  {
    icon: "shield",
    title: "Security & Pentesting",
    desc: "OWASP coverage, NDPR compliance, WAF setup, bug bounty programs.",
    tag: "Security",
    href: "/services/security-pentesting",
    color: "coral",
    category: "security",
  },
  {
    icon: "cloud",
    title: "Cloud & Scaling",
    desc: "Multi-cloud, CDN optimisation, load testing, auto-scaling, 99.9% uptime SLA.",
    tag: "Cloud",
    href: "/services/cloud-scaling",
    color: "amber",
    category: "devops",
  },
  {
    icon: "credit-card",
    title: "Fintech & Payments",
    desc: "Paystack, Flutterwave, CBN compliance, PCI-DSS, USSD banking flows.",
    tag: "Fintech",
    href: "/services/fintech-payments",
    color: "teal",
    category: "fintech",
  },
  {
    icon: "search",
    title: "Tech Audit",
    desc: "Performance, security, SEO and code quality audit — actionable PDF report.",
    tag: "Audit",
    href: "/services/tech-audit",
    color: "amber",
    category: "web",
  },
  {
    icon: "settings",
    title: "Maintenance Plans",
    desc: "Retainer-based monthly support: Starter, Growth, and Enterprise tiers.",
    tag: "Maintenance",
    href: "/services/maintenance",
    color: "teal",
    category: "maintenance",
  },
  {
    icon: "code",
    title: "AI & LLM Integration",
    desc: "GPT-4, Claude, Gemini — chatbots, document AI, recommendation engines, voice agents.",
    tag: "AI",
    href: "/services/ai-integration",
    color: "teal",
    category: "ai",
  },
  {
    icon: "device-mobile",
    title: "WhatsApp Business API",
    desc: "Automated flows, OTP, order updates, customer support bots — fully CBN compliant.",
    tag: "WhatsApp",
    href: "/services/whatsapp-api",
    color: "amber",
    category: "mobile",
  },
  {
    icon: "code",
    title: "UI/UX Design",
    desc: "Research-led product design: wireframes, prototypes, Figma handoff and design systems.",
    tag: "Design",
    href: "/services/ui-ux-design",
    color: "coral",
    category: "design",
  },
  {
    icon: "search",
    title: "Data & Analytics",
    desc: "Custom dashboards, BI integration, event tracking, cohort analysis and data pipelines.",
    tag: "Data",
    href: "/services/data-analytics",
    color: "amber",
    category: "data",
  },
  {
    icon: "search",
    title: "SEO & Growth",
    desc: "Technical SEO, content strategy, Core Web Vitals, rank tracking for African markets.",
    tag: "SEO",
    href: "/services/seo-growth",
    color: "teal",
    category: "web",
  },
  {
    icon: "settings",
    title: "Training & Tech Transfer",
    desc: "Hands-on workshops for your team: React, DevOps, security, system design — in-person or remote.",
    tag: "Training",
    href: "/services/training",
    color: "amber",
    category: "training",
  },
];

/** Home page preview — first 6 services */
export const FEATURED_SERVICES: ServiceItem[] = ALL_SERVICES.slice(0, 6);

export const PRICING_TIERS: PricingTier[] = [
  {
    tier: "Starter",
    price: "₦200k/mo",
    features: [
      "Monthly code updates",
      "Security patches & monitoring",
      "99.5% uptime SLA",
      "Hosting & SSL management",
      "Monthly status report",
    ],
    recommended: false,
    ctaText: "Get started",
  },
  {
    tier: "Growth",
    price: "₦450k/mo",
    features: [
      "Everything in Starter",
      "Up to 8 hrs feature additions",
      "Priority WhatsApp support",
      "Performance + SEO reports",
      "Quarterly security audit",
      "Dedicated account manager",
    ],
    recommended: true,
    ctaText: "Most popular",
  },
  {
    tier: "Enterprise",
    price: "₦900k+/mo",
    features: [
      "Everything in Growth",
      "Dedicated full-time engineer",
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
