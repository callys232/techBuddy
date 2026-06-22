/* Build vs Buy Calculator — data model ────────────────────────────────── */

export interface BvBCategory {
  id:        string;
  label:     string;
  icon:      string;
  buildMin:  number;   /* ₦ minimum build cost */
  buildMax:  number;   /* ₦ maximum build cost */
  buildWeeks: [number, number]; /* min, max delivery weeks */
  saasOptions: {
    name:     string;
    monthly:  number;   /* ₦ per month (0 = free tier exists) */
    perSeat:  boolean;
    freeLink: boolean;  /* true = has meaningful free tier */
  }[];
  buildPros: string[];
  buyPros:   string[];
  buildWhen: string;   /* one-liner: "Build when..." */
  buyWhen:   string;   /* one-liner: "Buy when..." */
}

export const BVB_CATEGORIES: BvBCategory[] = [
  {
    id: "crm",
    label: "CRM / Sales Pipeline",
    icon: "🤝",
    buildMin: 1_200_000, buildMax: 3_500_000,
    buildWeeks: [10, 18],
    saasOptions: [
      { name: "HubSpot Free", monthly: 0,      perSeat: false, freeLink: true  },
      { name: "HubSpot Starter", monthly: 15_000, perSeat: false, freeLink: false },
      { name: "Pipedrive",    monthly: 8_000,  perSeat: true,  freeLink: false },
    ],
    buildPros: ["Fully custom pipeline stages", "Deep integration with your other systems", "Own all your CRM data permanently", "No per-seat costs as team grows"],
    buyPros:   ["Live in hours, not months", "World-class UX out of the box", "HubSpot has a strong free tier", "Updates and new features included"],
    buildWhen: "Your sales process is complex or highly custom and no off-the-shelf tool matches it",
    buyWhen:   "You need to move fast, your team is small, and HubSpot's free tier covers 80% of your needs",
  },
  {
    id: "support",
    label: "Customer Support / Helpdesk",
    icon: "🎧",
    buildMin: 800_000, buildMax: 2_500_000,
    buildWeeks: [8, 16],
    saasOptions: [
      { name: "Freshdesk Free", monthly: 0,      perSeat: true,  freeLink: true  },
      { name: "Crisp",          monthly: 5_000,  perSeat: false, freeLink: true  },
      { name: "Zendesk",        monthly: 25_000, perSeat: true,  freeLink: false },
    ],
    buildPros: ["Integrated with your product data (orders, accounts)", "No per-seat cost at scale", "Custom automations for your specific workflows"],
    buyPros:   ["Freshdesk free is genuinely good", "AI features included", "Multi-channel (email, chat, WhatsApp) from day one"],
    buildWhen: "Support is deeply integrated with your product — agents need to see order data, account history, and trigger actions",
    buyWhen:   "Standard ticket management is all you need — Freshdesk's free tier handles 10+ agents at zero cost",
  },
  {
    id: "ecommerce",
    label: "E-commerce Store",
    icon: "🛒",
    buildMin: 900_000, buildMax: 3_000_000,
    buildWeeks: [8, 16],
    saasOptions: [
      { name: "Flutterwave Store", monthly: 0,      perSeat: false, freeLink: true  },
      { name: "Shopify Basic",     monthly: 15_000, perSeat: false, freeLink: false },
      { name: "WooCommerce",       monthly: 5_000,  perSeat: false, freeLink: true  },
    ],
    buildPros: ["Zero transaction fees", "Custom checkout flow", "Full control over UX and brand", "Combine with your existing platform"],
    buyPros:   ["Flutterwave Store is free and Nigerian-native", "No dev time to launch", "Inventory, orders, analytics all built in"],
    buildWhen: "You have complex inventory, custom pricing logic, or need deep integration with your existing systems",
    buyWhen:   "You're launching a standard product store — Flutterwave or WooCommerce gets you live in a day",
  },
  {
    id: "appointments",
    label: "Appointment Booking",
    icon: "📅",
    buildMin: 400_000, buildMax: 1_200_000,
    buildWeeks: [4, 10],
    saasOptions: [
      { name: "Cal.com",     monthly: 0,      perSeat: false, freeLink: true  },
      { name: "Calendly",    monthly: 3_000,  perSeat: true,  freeLink: true  },
      { name: "Square Appt", monthly: 0,      perSeat: false, freeLink: true  },
    ],
    buildPros: ["Branded booking page", "Custom service types and flows", "Full integration with your platform"],
    buyPros:   ["Cal.com is free and open-source", "Live in 30 minutes", "Google Calendar / Zoom sync built in"],
    buildWhen: "Booking is your core product — clinics, salons, etc. with complex scheduling rules, staff management, and payments",
    buyWhen:   "You just need a link people can use to book time with you or your team",
  },
  {
    id: "hr-payroll",
    label: "HR / Payroll System",
    icon: "👥",
    buildMin: 2_000_000, buildMax: 8_000_000,
    buildWeeks: [16, 28],
    saasOptions: [
      { name: "Paystack Payroll", monthly: 3_000,  perSeat: true,  freeLink: false },
      { name: "Workpay",         monthly: 2_000,  perSeat: true,  freeLink: false },
      { name: "BambooHR",        monthly: 8_000,  perSeat: true,  freeLink: false },
    ],
    buildPros: ["Nigerian-specific compliance built to your rules", "No per-employee cost", "Full ownership of sensitive payroll data"],
    buyPros:   ["Paystack Payroll is Nigerian-native and cheap", "Tax/pension compliance built in", "Payslips, leave, and reports out of the box"],
    buildWhen: "You have complex org structures, unions, or bespoke compliance requirements that no off-the-shelf system handles",
    buyWhen:   "Standard Nigerian payroll — Paystack Payroll at ₦3k/employee/month is faster and cheaper to run",
  },
  {
    id: "forms",
    label: "Forms & Data Collection",
    icon: "📋",
    buildMin: 200_000, buildMax: 600_000,
    buildWeeks: [2, 6],
    saasOptions: [
      { name: "Google Forms",  monthly: 0,     perSeat: false, freeLink: true },
      { name: "Typeform",      monthly: 8_000, perSeat: false, freeLink: true },
      { name: "Tally",         monthly: 0,     perSeat: false, freeLink: true },
    ],
    buildPros: ["Deep integration with your database", "Custom validation logic", "No branding or response limits"],
    buyPros:   ["Tally is free and feature-rich", "Logic branching built in", "Live in minutes"],
    buildWhen: "Form submissions need to trigger complex backend workflows — payments, account creation, database writes",
    buyWhen:   "You're collecting information and routing it to a spreadsheet or email — Tally is free and does this perfectly",
  },
  {
    id: "analytics",
    label: "Analytics Dashboard",
    icon: "📊",
    buildMin: 600_000, buildMax: 2_500_000,
    buildWeeks: [6, 14],
    saasOptions: [
      { name: "Looker Studio", monthly: 0,      perSeat: false, freeLink: true  },
      { name: "Metabase",      monthly: 8_000,  perSeat: false, freeLink: true  },
      { name: "Tableau",       monthly: 50_000, perSeat: true,  freeLink: false },
    ],
    buildPros: ["Pixel-perfect to your data model", "Embedded in your existing product", "Real-time data from your own DB"],
    buyPros:   ["Metabase is free self-hosted and connects to Postgres", "No engineering time to maintain", "Looker Studio is free and shareable"],
    buildWhen: "Dashboards are a customer-facing feature of your product — your clients log in to see their own data",
    buyWhen:   "You're building internal reporting for your team — Metabase or Looker Studio connects to your DB for free",
  },
  {
    id: "whatsapp-automation",
    label: "WhatsApp Automation",
    icon: "💬",
    buildMin: 400_000, buildMax: 1_500_000,
    buildWeeks: [4, 10],
    saasOptions: [
      { name: "Respond.io",  monthly: 25_000, perSeat: false, freeLink: false },
      { name: "Interakt",    monthly: 10_000, perSeat: false, freeLink: false },
      { name: "Wati",        monthly: 12_000, perSeat: false, freeLink: false },
    ],
    buildPros: ["Full control of conversation flows", "Direct integration with your database and orders", "No per-message markup on top of Meta's fees", "AI integration on your terms"],
    buyPros:   ["Respond.io handles the API complexity", "Built-in agent inbox and routing", "Faster to launch standard flows"],
    buildWhen: "WhatsApp is your primary customer channel and you need it deeply connected to your product — orders, accounts, payments",
    buyWhen:   "You need standard broadcast, OTP, and support flows and don't want to manage the API directly",
  },
  {
    id: "internal-tool",
    label: "Internal Tool / Admin Panel",
    icon: "🛠️",
    buildMin: 600_000, buildMax: 3_000_000,
    buildWeeks: [5, 14],
    saasOptions: [
      { name: "Retool",   monthly: 30_000, perSeat: false, freeLink: true  },
      { name: "Appsmith", monthly: 0,      perSeat: false, freeLink: true  },
      { name: "Budibase", monthly: 0,      perSeat: false, freeLink: true  },
    ],
    buildPros: ["Exactly matches your data model and workflows", "No vendor lock-in", "Can be customer-facing eventually"],
    buyPros:   ["Appsmith and Budibase are free and self-hostable", "Connect to Postgres / REST APIs in hours", "No frontend engineering needed"],
    buildWhen: "The internal tool will eventually become a customer-facing product, or your team needs it to be deeply integrated with production systems",
    buyWhen:   "You need CRUD interfaces, dashboards, and forms for internal ops — Appsmith does this for free in a day",
  },
];

/* ── Questions ────────────────────────────────────────────────────────────── */

export const BVB_QUESTIONS = [
  {
    id:       "category",
    question: "What do you want to build or buy?",
    subtitle: "Select the category that best describes what you need.",
    type:     "category-grid" as const,
  },
  {
    id:       "users",
    question: "How many people will use this?",
    subtitle: "This affects per-seat SaaS costs significantly.",
    type:     "select" as const,
    options:  [
      { id: "solo",    label: "Just me",          hint: "Solo founder or small team",       userCount: 1   },
      { id: "small",   label: "2–10 people",      hint: "Small team or startup",            userCount: 5   },
      { id: "medium",  label: "10–50 people",     hint: "Growing company",                  userCount: 25  },
      { id: "large",   label: "50+ people",       hint: "Large team or enterprise",         userCount: 75  },
      { id: "customers", label: "Customers use it", hint: "It's a product your clients log into", userCount: 0 },
    ],
  },
  {
    id:       "customisation",
    question: "How much do you need to customise it?",
    subtitle: "The higher your customisation need, the stronger the case for building.",
    type:     "select" as const,
    options:  [
      { id: "standard", label: "Standard is fine",         hint: "Off-the-shelf covers 90% of what we need",     weight: 0   },
      { id: "some",     label: "Some customisation",       hint: "We'd need tweaks but nothing exotic",          weight: 0.3 },
      { id: "heavy",    label: "Heavy customisation",      hint: "Our workflow is complex and fairly unique",    weight: 0.6 },
      { id: "bespoke",  label: "Fully bespoke",            hint: "No existing tool comes close to what we need", weight: 1.0 },
    ],
  },
  {
    id:       "data-ownership",
    question: "How important is owning your data?",
    subtitle: "Sensitive or regulated data (health, finance, NDPR-governed) often requires full data ownership.",
    type:     "select" as const,
    options:  [
      { id: "low",      label: "Not critical",     hint: "Data in a third party's cloud is fine", weight: 0   },
      { id: "medium",   label: "Somewhat important", hint: "We'd prefer local storage but can compromise", weight: 0.4 },
      { id: "high",     label: "Very important",   hint: "Data must stay under our control (health, finance)", weight: 0.8 },
      { id: "critical", label: "Non-negotiable",   hint: "Regulatory or contractual requirement to own data", weight: 1.0 },
    ],
  },
  {
    id:       "timeline",
    question: "How urgently do you need this live?",
    subtitle: "Urgency is one of the strongest reasons to buy rather than build.",
    type:     "select" as const,
    options:  [
      { id: "asap",     label: "ASAP — this week or month", hint: "We need it running now",          buildPenalty: 1.0 },
      { id: "quarter",  label: "Within 3 months",           hint: "Reasonable build timeline",       buildPenalty: 0.3 },
      { id: "halfyear", label: "3–6 months",                hint: "No rush",                         buildPenalty: 0.0 },
      { id: "flexible", label: "No fixed deadline",         hint: "We can take our time and build right", buildPenalty: 0.0 },
    ],
  },
  {
    id:       "years",
    question: "How many years do you expect to use this?",
    subtitle: "Longer time horizons favour building — SaaS costs compound.",
    type:     "select" as const,
    options:  [
      { id: "1", label: "Less than a year",  hint: "Short-term or experimental", years: 1 },
      { id: "2", label: "1–2 years",         hint: "Medium-term use",            years: 2 },
      { id: "5", label: "3–5 years",         hint: "Core to the business",       years: 4 },
      { id: "10",label: "5+ years",          hint: "This is infrastructure",     years: 7 },
    ],
  },
];

/* ── Scoring / recommendation ───────────────────────────────────────────── */

export function computeBvB(answers: Record<string, string>, category: BvBCategory) {
  const usersOpt    = BVB_QUESTIONS[1].options!.find((o) => o.id === answers.users) as { userCount: number } | undefined;
  const customOpt   = BVB_QUESTIONS[2].options!.find((o) => o.id === answers.customisation) as { weight: number } | undefined;
  const dataOpt     = BVB_QUESTIONS[3].options!.find((o) => o.id === answers["data-ownership"]) as { weight: number } | undefined;
  const timelineOpt = BVB_QUESTIONS[4].options!.find((o) => o.id === answers.timeline) as { buildPenalty: number } | undefined;
  const yearsOpt    = BVB_QUESTIONS[5].options!.find((o) => o.id === answers.years) as { years: number } | undefined;

  const userCount   = usersOpt?.userCount ?? 5;
  const years       = yearsOpt?.years ?? 3;

  /* Best SaaS option cost */
  const cheapestSaaS = category.saasOptions.reduce((min, s) =>
    s.monthly < min.monthly ? s : min, category.saasOptions[0]);
  const monthlySaaS  = cheapestSaaS.perSeat ? cheapestSaaS.monthly * Math.max(1, userCount) : cheapestSaaS.monthly;
  const totalSaaSCost = monthlySaaS * 12 * years;

  /* Build cost (midpoint) */
  const buildMid         = (category.buildMin + category.buildMax) / 2;
  const annualMaintenance = buildMid * 0.15;
  const totalBuildCost   = buildMid + annualMaintenance * (years - 1);

  /* Build score (0 = strong buy, 1 = strong build) */
  const customWeight = (customOpt?.weight ?? 0);
  const dataWeight   = (dataOpt?.weight ?? 0);
  const penalty      = (timelineOpt?.buildPenalty ?? 0);
  const costFactor   = totalBuildCost < totalSaaSCost ? 0.3 : 0;
  const buildScore   = Math.max(0, Math.min(1,
    (customWeight * 0.35) + (dataWeight * 0.25) + (costFactor * 0.25) - (penalty * 0.5) + 0.1
  ));

  const verdict: "build" | "buy" | "hybrid" =
    buildScore >= 0.6 ? "build" :
    buildScore >= 0.35 ? "hybrid" : "buy";

  const breakEvenMonths = monthlySaaS > 0
    ? Math.ceil(buildMid / (monthlySaaS * 12) * 12)
    : null;

  return {
    verdict,
    buildScore: Math.round(buildScore * 100),
    totalBuildCost,
    totalSaaSCost,
    monthlySaaS,
    cheapestSaaS,
    breakEvenMonths,
    years,
    userCount,
  };
}
