export interface Project {
  image: string;
  name: string;
  tags: string[];
  stack: string[];
  liveUrl: string;
  caseStudy: boolean;
  category: string;
}

export interface PortfolioTab {
  id: string;
  label: string;
}

export const PORTFOLIO_TABS: PortfolioTab[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web App" },
  { id: "mobile", label: "Mobile" },
  { id: "saas", label: "SaaS" },
  { id: "fintech", label: "Fintech" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "internal", label: "Internal Tools" },
];

export const ALL_PROJECTS: Project[] = [
  {
    image: "/placeholder.png",
    name: "FinTrack Pro",
    tags: ["Fintech", "Mobile"],
    stack: ["React Native", "Supabase", "Paystack"],
    liveUrl: "#",
    caseStudy: true,
    category: "fintech",
  },
  {
    image: "/placeholder.png",
    name: "AgriMarket",
    tags: ["E-commerce", "Web"],
    stack: ["Next.js", "Sanity", "Flutterwave"],
    liveUrl: "#",
    caseStudy: true,
    category: "ecommerce",
  },
  {
    image: "/placeholder.png",
    name: "LogiSync",
    tags: ["SaaS", "Internal"],
    stack: ["Next.js", "PostgreSQL", "Docker"],
    liveUrl: "#",
    caseStudy: true,
    category: "saas",
  },
  {
    image: "/placeholder.png",
    name: "HealthPay",
    tags: ["Fintech", "Web"],
    stack: ["React", "Paystack", "Supabase"],
    liveUrl: "#",
    caseStudy: true,
    category: "fintech",
  },
  {
    image: "/placeholder.png",
    name: "SchoolKit",
    tags: ["SaaS", "Web"],
    stack: ["Next.js", "Supabase", "Clerk"],
    liveUrl: "#",
    caseStudy: false,
    category: "saas",
  },
  {
    image: "/placeholder.png",
    name: "DispatchNG",
    tags: ["Mobile", "Internal"],
    stack: ["React Native", "Firebase", "Google Maps"],
    liveUrl: "#",
    caseStudy: true,
    category: "mobile",
  },
];

/** Home page showcase — top 3 projects */
export const FEATURED_PROJECTS: Project[] = ALL_PROJECTS.slice(0, 3);
