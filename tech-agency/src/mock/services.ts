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
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "devops", label: "DevOps" },
  { id: "security", label: "Security" },
  { id: "fintech", label: "Fintech" },
  { id: "maintenance", label: "Maintenance" },
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
];

/** Home page preview — first 6 services */
export const FEATURED_SERVICES: ServiceItem[] = ALL_SERVICES.slice(0, 6);

export const PRICING_TIERS: PricingTier[] = [
  {
    tier: "Starter",
    price: "₦150k/mo",
    features: [
      "Monthly updates",
      "Security patches",
      "Uptime monitoring",
      "Hosting management",
    ],
    recommended: false,
    ctaText: "Get started",
  },
  {
    tier: "Growth",
    price: "₦350k/mo",
    features: [
      "Everything in Starter",
      "Performance reports",
      "Feature additions",
      "Priority support",
      "Monthly reports",
    ],
    recommended: true,
    ctaText: "Most popular",
  },
  {
    tier: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Growth",
      "Dedicated engineer",
      "24hr SLA",
      "Slack / WhatsApp access",
      "Quarterly audits",
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
