export interface Template {
  name:       string;
  type:       string;
  /** Customisation price range in thousands of Naira */
  priceRange: { min: number; max: number };
  features:   string[];
  image:      string;
  source:     "original";
}

export interface ExternalTemplate {
  name:         string;
  type:         string;
  /** Customisation price range in thousands of Naira */
  priceRange:   { min: number; max: number };
  features:     string[];
  /** Thumbnail from source (Envato CDN / GitHub social preview) */
  image:        string;
  source:       "envato" | "github";
  sourceLabel:  string;
  /** Link to the original theme / repo */
  sourceUrl:    string;
  /** Original price string e.g. "$59" or "Free" */
  originalPrice: string;
}

export interface TemplateTab {
  id:    string;
  label: string;
}

export const TEMPLATE_TABS: TemplateTab[] = [
  { id: "all",       label: "All" },
  { id: "landing",   label: "Landing" },
  { id: "saas",      label: "SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog",      label: "Blog" },
  { id: "dashboard", label: "Dashboard" },
  { id: "mobile",    label: "Mobile" },
];

/* ── Our original templates ─────────────────────────────────────────────── */

export const ALL_TEMPLATES: Template[] = [
  {
    name:       "LaunchPad",
    type:       "landing",
    priceRange: { min: 200, max: 500 },
    features:   ["Hero", "Pricing", "FAQ", "CTA"],
    image:      "/placeholder.png",
    source:     "original",
  },
  {
    name:       "SaaSify",
    type:       "saas",
    priceRange: { min: 1200, max: 4000 },
    features:   ["Auth", "Dashboard", "Billing", "Docs"],
    image:      "/placeholder.png",
    source:     "original",
  },
  {
    name:       "MarketPro",
    type:       "ecommerce",
    priceRange: { min: 800, max: 3000 },
    features:   ["Catalog", "Cart", "Checkout", "Orders"],
    image:      "/placeholder.png",
    source:     "original",
  },
  {
    name:       "Folio",
    type:       "portfolio",
    priceRange: { min: 200, max: 450 },
    features:   ["Projects", "Blog", "Contact", "Resume"],
    image:      "/placeholder.png",
    source:     "original",
  },
  {
    name:       "AdminKit",
    type:       "dashboard",
    priceRange: { min: 700, max: 2500 },
    features:   ["Tables", "Charts", "Users", "Settings"],
    image:      "/placeholder.png",
    source:     "original",
  },
  {
    name:       "NativePro",
    type:       "mobile",
    priceRange: { min: 1200, max: 4500 },
    features:   ["Onboarding", "Auth", "Profile", "Notifications"],
    image:      "/placeholder.png",
    source:     "original",
  },
  {
    name:       "BlogBase",
    type:       "blog",
    priceRange: { min: 200, max: 600 },
    features:   ["MDX Posts", "Tags", "Newsletter", "RSS"],
    image:      "/placeholder.png",
    source:     "original",
  },
];

/* ── Curated external references ────────────────────────────────────────── */
/* ThemeForest items licensed under Envato Regular/Extended License.         */
/* We link with affiliate ref and charge for our customisation service.      */

export const EXTERNAL_TEMPLATES: ExternalTemplate[] = [
  /* ── ThemeForest / Envato ─────────────────────────────────────────────── */
  {
    name:          "Flatsome",
    type:          "ecommerce",
    priceRange:    { min: 600, max: 2500 },
    features:      ["WooCommerce", "Drag & drop", "RTL", "Multi-layout"],
    image:         "https://preview.themeforest.net/item/flatsome-multipurpose-responsive-woocommerce-theme/full_screen_preview/5154212",
    source:        "envato",
    sourceLabel:   "ThemeForest",
    sourceUrl:     "https://themeforest.net/item/flatsome-multipurpose-responsive-woocommerce-theme/5154212",
    originalPrice: "$59",
  },
  {
    name:          "Kalles",
    type:          "ecommerce",
    priceRange:    { min: 700, max: 2800 },
    features:      ["Shopify", "Multi-currency", "Mega menu", "Ajax cart"],
    image:         "https://cdn.shopify.com/s/files/1/0577/7673/9268/files/kalles-new.jpg",
    source:        "envato",
    sourceLabel:   "ThemeForest",
    sourceUrl:     "https://themeforest.net/item/kalles-clean-versatile-ecommerce-shopify-theme/26600600",
    originalPrice: "$59",
  },
  {
    name:          "Salient",
    type:          "saas",
    priceRange:    { min: 900, max: 3500 },
    features:      ["Nectar page builder", "900+ demos", "WooCommerce", "WPML"],
    image:         "https://preview.themeforest.net/item/salient-responsive-multipurpose-theme/full_screen_preview/4363266",
    source:        "envato",
    sourceLabel:   "ThemeForest",
    sourceUrl:     "https://themeforest.net/item/salient-responsive-multipurpose-theme/4363266",
    originalPrice: "$60",
  },
  {
    name:          "Uncode",
    type:          "landing",
    priceRange:    { min: 250, max: 700 },
    features:      ["Grid system", "500+ layouts", "WooCommerce", "RTL"],
    image:         "https://preview.themeforest.net/item/uncode-creative-multiuse-wordpress-theme/full_screen_preview/13373235",
    source:        "envato",
    sourceLabel:   "ThemeForest",
    sourceUrl:     "https://themeforest.net/item/uncode-creative-multiuse-wordpress-theme/13373235",
    originalPrice: "$59",
  },
  {
    name:          "Smarty Admin",
    type:          "dashboard",
    priceRange:    { min: 800, max: 3000 },
    features:      ["React", "Charts", "Dark mode", "100+ widgets"],
    image:         "https://wrapbootstrap.com/cache/themes/WB0R5L90Q/screenshot-1200x900.jpg",
    source:        "envato",
    sourceLabel:   "ThemeForest",
    sourceUrl:     "https://themeforest.net/search/react%20admin%20dashboard",
    originalPrice: "$24",
  },
  /* ── GitHub (MIT-licensed) ─────────────────────────────────────────────── */
  {
    name:          "Taxonomy",
    type:          "saas",
    priceRange:    { min: 800, max: 2500 },
    features:      ["Next.js 14", "Stripe", "Prisma", "Tailwind"],
    image:         "/placeholder.png",
    source:        "github",
    sourceLabel:   "GitHub (MIT)",
    sourceUrl:     "https://github.com/mickasmt/next-saas-stripe-starter",
    originalPrice: "Free",
  },
  {
    name:          "shadcn/ui Dashboard",
    type:          "dashboard",
    priceRange:    { min: 600, max: 2000 },
    features:      ["Next.js 14", "shadcn/ui", "Recharts", "TypeScript"],
    image:         "/placeholder.png",
    source:        "github",
    sourceLabel:   "GitHub (MIT)",
    sourceUrl:     "https://github.com/shadcn-ui/ui/tree/main/apps/www",
    originalPrice: "Free",
  },
  {
    name:          "Taxonomy Blog",
    type:          "blog",
    priceRange:    { min: 200, max: 550 },
    features:      ["Next.js 14", "MDX", "Contentlayer", "Auth"],
    image:         "/placeholder.png",
    source:        "github",
    sourceLabel:   "GitHub (MIT)",
    sourceUrl:     "https://github.com/shadcn-ui/taxonomy",
    originalPrice: "Free",
  },
  {
    name:          "T3 SaaS Boilerplate",
    type:          "saas",
    priceRange:    { min: 1000, max: 3500 },
    features:      ["Next.js", "tRPC", "Prisma", "NextAuth"],
    image:         "/placeholder.png",
    source:        "github",
    sourceLabel:   "GitHub (MIT)",
    sourceUrl:     "https://github.com/t3-oss/create-t3-turbo",
    originalPrice: "Free",
  },
  {
    name:          "OpenResume",
    type:          "portfolio",
    priceRange:    { min: 200, max: 450 },
    features:      ["Next.js", "PDF export", "Tailwind", "TypeScript"],
    image:         "/placeholder.png",
    source:        "github",
    sourceLabel:   "GitHub (MIT)",
    sourceUrl:     "https://github.com/xitanggg/open-resume",
    originalPrice: "Free",
  },
];

export function formatPriceRange(range: { min: number; max: number }): string {
  const fmt = (n: number) => n >= 1000 ? `₦${(n / 1000).toFixed(1)}M` : `₦${n}k`;
  return `${fmt(range.min)} – ${fmt(range.max)}`;
}
