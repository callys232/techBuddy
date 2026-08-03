export interface WizardStep {
  label: string;
}

export interface QuoteTemplate {
  name:       string;
  type:       string;
  priceRange: { min: number; max: number };
  features:   string[];
  image:      string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { label: "Pain Points" },
  { label: "Template" },
  { label: "Scope" },
  { label: "Contact" },
];

export const PAIN_CHIPS: string[] = [
  "Slow site",
  "No app",
  "Security issues",
  "Need to scale",
  "New product",
  "E-commerce",
  "Fintech",
  "WhatsApp integration",
];

/** Also used in Hero section — service-based tags */
export const HERO_PAIN_CHIPS: string[] = [
  "Web Apps",
  "Mobile Apps",
  "AI & Automation",
  "WhatsApp Bots",
  "DevOps & Scaling",
  "Fintech & Payments",
  "UI/UX Design",
  "Data & Analytics",
];

export const SCOPE_FEATURES: string[] = [
  "CMS",
  "Auth",
  "Payments",
  "Admin panel",
  "API",
  "Multilingual",
  "Offline mode",
];

/** Customisation cost per feature, in thousands of Naira — mirrors FEATURE_ADDONS in mock/tools.ts */
export const SCOPE_FEATURE_COSTS: Record<string, number> = {
  "CMS":           200,
  "Auth":          200,
  "Payments":      250,
  "Admin panel":   250,
  "API":           250,
  "Multilingual":  150,
  "Offline mode":  200,
};

/** Flat base range (₦k) used when no template is selected / fully custom build */
export const CUSTOM_BASE_RANGE = { min: 250, max: 900 };

export interface BrandColor {
  name: string;
  hex: string;
}

export const BRAND_COLOR_SWATCHES: BrandColor[] = [
  { name: "Sky Blue",   hex: "#38BDF8" },
  { name: "Trust Blue", hex: "#1E3A8A" },
  { name: "Emerald",    hex: "#10B981" },
  { name: "Amber",      hex: "#F59E0B" },
  { name: "Rose",       hex: "#F43F5E" },
  { name: "Violet",     hex: "#8B5CF6" },
  { name: "Slate",      hex: "#64748B" },
  { name: "Coral",      hex: "#F87171" },
];

/** Computes a combined price estimate (₦k) from the selected template + scope features */
export function estimateQuotePrice(templateName: string, features: string[]): { min: number; max: number } {
  const template = QUOTE_TEMPLATES.find((t) => t.name === templateName);
  const base = template ? template.priceRange : CUSTOM_BASE_RANGE;
  const addOn = features.reduce((sum, f) => sum + (SCOPE_FEATURE_COSTS[f] ?? 0), 0);
  return { min: base.min + addOn, max: base.max + addOn };
}

export const TIMELINE_OPTIONS: string[] = [
  "ASAP",
  "1-3 months",
  "3-6 months",
  "No rush",
];

export const CONTACT_METHODS: string[] = ["email", "whatsapp", "call"];

export const REFERRAL_SOURCES: { value: string; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    name:       "LaunchPad",
    type:       "landing",
    priceRange: { min: 200, max: 500 },
    features:   ["Hero", "Pricing", "FAQ"],
    image:      "/placeholder.png",
  },
  {
    name:       "SaaSify",
    type:       "saas",
    priceRange: { min: 1200, max: 4000 },
    features:   ["Auth", "Dashboard", "Billing"],
    image:      "/placeholder.png",
  },
  {
    name:       "MarketPro",
    type:       "ecommerce",
    priceRange: { min: 800, max: 3000 },
    features:   ["Catalog", "Cart", "Checkout"],
    image:      "/placeholder.png",
  },
  {
    name:       "AdminKit",
    type:       "dashboard",
    priceRange: { min: 700, max: 2500 },
    features:   ["Tables", "Charts", "Users"],
    image:      "/placeholder.png",
  },
];

export const BUDGET_MIN     = 200_000;
export const BUDGET_MAX     = 50_000_000;
export const BUDGET_STEP    = 200_000;
export const BUDGET_DEFAULT = 800_000;
