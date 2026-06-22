export interface Project {
  image: string;
  name: string;
  description: string;
  tags: string[];
  stack: string[];
  liveUrl: string;
  caseStudy: boolean;
  category: string;
  result: string;
  highlight: string;
  client: string;
}

export interface PortfolioTab {
  id: string;
  label: string;
}

export const PORTFOLIO_TABS: PortfolioTab[] = [
  { id: "all",       label: "All" },
  { id: "web",       label: "Web App" },
  { id: "mobile",    label: "Mobile" },
  { id: "saas",      label: "SaaS" },
  { id: "fintech",   label: "Fintech" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "internal",  label: "Internal Tools" },
];

export const ALL_PROJECTS: Project[] = [
  {
    image: "/placeholder.png",
    name: "FinTrack Pro",
    description:
      "Personal finance and investment tracker built for young Lagos professionals. Real-time portfolio tracking, automated savings goals, and Paystack-powered instant transfers between banks.",
    tags: ["Fintech", "Mobile"],
    stack: ["React Native", "Supabase", "Paystack", "Expo"],
    liveUrl: "#",
    caseStudy: true,
    category: "fintech",
    result: "12,000 monthly active users within 6 months of launch",
    highlight: "₦2.1B in transactions tracked monthly",
    client: "Lagos-based fintech startup",
  },
  {
    image: "/placeholder.png",
    name: "AgriMarket",
    description:
      "B2B marketplace connecting smallholder farmers across 12 Nigerian states directly to bulk buyers. Eliminates 3–4 middlemen layers, with real-time price discovery and logistics integration.",
    tags: ["E-commerce", "Web"],
    stack: ["Next.js", "Sanity", "Flutterwave", "Google Maps"],
    liveUrl: "#",
    caseStudy: true,
    category: "ecommerce",
    result: "₦800M in gross merchandise value in year one",
    highlight: "40% cost reduction for registered farmers",
    client: "AgriTech NGO backed by USAID",
  },
  {
    image: "/placeholder.png",
    name: "LogiSync",
    description:
      "Fleet management SaaS for mid-size Nigerian logistics companies. Real-time vehicle tracking, driver performance scoring, fuel consumption analytics, and automated dispatch scheduling.",
    tags: ["SaaS", "Internal"],
    stack: ["Next.js", "PostgreSQL", "Docker", "Redis", "Mapbox"],
    liveUrl: "#",
    caseStudy: true,
    category: "saas",
    result: "35% average fuel cost reduction across 4 logistics clients",
    highlight: "1,200 vehicles tracked simultaneously in real time",
    client: "Series A logistics startup, Lagos",
  },
  {
    image: "/placeholder.png",
    name: "HealthPay",
    description:
      "End-to-end health insurance claims processing platform. Digitised claim submission, automated eligibility verification, and a provider portal for 40+ partner hospitals across Nigeria.",
    tags: ["Fintech", "Web"],
    stack: ["React", "Node.js", "Paystack", "Supabase"],
    liveUrl: "#",
    caseStudy: true,
    category: "fintech",
    result: "Claims processing time reduced from 14 days to under 24 hours",
    highlight: "98.7% platform uptime since launch in 2025",
    client: "HMO operator serving 25,000 enrollees",
  },
  {
    image: "/placeholder.png",
    name: "SchoolKit",
    description:
      "All-in-one school management platform: admissions workflows, school fees collection, grade books, parent communication, and a mobile app for parents to track their children's progress.",
    tags: ["SaaS", "Web"],
    stack: ["Next.js", "Supabase", "Clerk", "Resend"],
    liveUrl: "#",
    caseStudy: false,
    category: "saas",
    result: "Adopted by 180+ schools across 8 Nigerian states",
    highlight: "₦45M in school fees processed monthly",
    client: "Edtech startup (private school networks)",
  },
  {
    image: "/placeholder.png",
    name: "DispatchNG",
    description:
      "Last-mile delivery management mobile app for e-commerce businesses. Rider assignment, live order tracking, proof-of-delivery capture, and merchant dashboard with automated settlements.",
    tags: ["Mobile", "Internal"],
    stack: ["React Native", "Firebase", "Google Maps", "Flutterwave"],
    liveUrl: "#",
    caseStudy: true,
    category: "mobile",
    result: "2,400 deliveries completed daily on the platform",
    highlight: "18% improvement in on-time delivery rate vs industry average",
    client: "Courier startup serving 300+ e-commerce merchants",
  },
  {
    image: "/placeholder.png",
    name: "TalentPool",
    description:
      "Applicant tracking system and talent marketplace for Nigerian SMEs. Custom job boards, CV parsing, interview scheduling, offer management, and an anonymised candidate pool for passive hiring.",
    tags: ["SaaS", "HR Tech"],
    stack: ["Next.js", "PostgreSQL", "Resend", "Supabase"],
    liveUrl: "#",
    caseStudy: true,
    category: "saas",
    result: "650+ successful hires facilitated in the first 12 months",
    highlight: "5-day median time from job post to first interview",
    client: "HR consultancy firm, Abuja",
  },
  {
    image: "/placeholder.png",
    name: "GrowthDesk",
    description:
      "Business intelligence dashboard for multi-branch retail chains. Inventory tracking, POS integration, sales heatmaps by location, and automated low-stock alerts with supplier re-order workflows.",
    tags: ["Internal", "Analytics"],
    stack: ["Next.js", "Python", "Supabase", "Recharts"],
    liveUrl: "#",
    caseStudy: true,
    category: "internal",
    result: "3 retail chains now managing over ₦1.2B in inventory",
    highlight: "28% reduction in stockout incidents",
    client: "FMCG distribution group, Lagos",
  },
  {
    image: "/placeholder.png",
    name: "PayLeaf",
    description:
      "Corporate expense management and virtual card platform. Finance teams issue virtual Naira cards to employees, set spend limits per category, and auto-reconcile with accounting software.",
    tags: ["Fintech", "Mobile"],
    stack: ["React Native", "Node.js", "Paystack", "PostgreSQL"],
    liveUrl: "#",
    caseStudy: true,
    category: "fintech",
    result: "₦340M in corporate spend managed monthly",
    highlight: "72-hour card issuance turnaround from signup",
    client: "B2B fintech, serving 60+ SME clients",
  },
];

/** Home page showcase — top 3 projects */
export const FEATURED_PROJECTS: Project[] = ALL_PROJECTS.slice(0, 3);
