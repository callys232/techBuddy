export interface Template {
  name: string;
  type: string;
  price: string;
  features: string[];
  image: string;
}

export interface TemplateTab {
  id: string;
  label: string;
}

export const TEMPLATE_TABS: TemplateTab[] = [
  { id: "all", label: "All" },
  { id: "landing", label: "Landing" },
  { id: "saas", label: "SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog" },
  { id: "dashboard", label: "Dashboard" },
  { id: "mobile", label: "Mobile" },
];

export const ALL_TEMPLATES: Template[] = [
  {
    name: "LaunchPad",
    type: "landing",
    price: "From ₦180k",
    features: ["Hero", "Pricing", "FAQ", "CTA"],
    image: "/placeholder.png",
  },
  {
    name: "SaaSify",
    type: "saas",
    price: "From ₦350k",
    features: ["Auth", "Dashboard", "Billing", "Docs"],
    image: "/placeholder.png",
  },
  {
    name: "MarketPro",
    type: "ecommerce",
    price: "From ₦400k",
    features: ["Catalog", "Cart", "Checkout", "Orders"],
    image: "/placeholder.png",
  },
  {
    name: "Folio",
    type: "portfolio",
    price: "From ₦120k",
    features: ["Projects", "Blog", "Contact", "Resume"],
    image: "/placeholder.png",
  },
  {
    name: "AdminKit",
    type: "dashboard",
    price: "From ₦300k",
    features: ["Tables", "Charts", "Users", "Settings"],
    image: "/placeholder.png",
  },
  {
    name: "NativePro",
    type: "mobile",
    price: "From ₦500k",
    features: ["Onboarding", "Auth", "Profile", "Notifications"],
    image: "/placeholder.png",
  },
];
