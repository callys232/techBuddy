/* MVP Scope Generator — questions and feature generation rules ─────────── */

export interface MVPQuestion {
  id:       string;
  question: string;
  subtitle: string;
  type:     "select" | "text" | "multiselect";
  options?: { id: string; label: string; hint?: string }[];
  placeholder?: string; /* for text inputs */
  maxLength?:   number;
}

export const MVP_QUESTIONS: MVPQuestion[] = [
  {
    id:          "description",
    type:        "text",
    question:    "Describe your product idea in one sentence",
    subtitle:    "Be specific. \"An app for farmers\" is too vague. \"A platform that connects smallholder farmers in Lagos State with wholesale buyers\" is perfect.",
    placeholder: "e.g. A platform that connects smallholder farmers in Lagos with wholesale buyers",
    maxLength:   160,
  },
  {
    id:       "user",
    type:     "select",
    question: "Who is your primary user?",
    subtitle: "Choose the one that describes the person who will use your product most.",
    options: [
      { id: "consumer",   label: "Individual consumer (B2C)", hint: "Regular people — shoppers, patients, students, workers" },
      { id: "sme",        label: "Small or medium business (B2B)", hint: "Business owners, managers, teams at growing companies" },
      { id: "enterprise", label: "Large enterprise or corporate", hint: "Banks, telcos, large manufacturers, government agencies" },
      { id: "ngo",        label: "NGO, school, or public sector", hint: "Non-profits, educational institutions, government bodies" },
    ],
  },
  {
    id:          "core-action",
    type:        "text",
    question:    "What is the ONE thing a user must be able to do on day one?",
    subtitle:    "If your users could only do one thing on your platform, what would make them come back? This is the heart of your MVP.",
    placeholder: "e.g. Post a produce listing and get contacted by a buyer",
    maxLength:   140,
  },
  {
    id:       "revenue",
    type:     "select",
    question: "How will you make money?",
    subtitle: "Choose your primary revenue model for Phase 1.",
    options: [
      { id: "subscription", label: "Subscription",          hint: "Monthly or annual fee to access the platform" },
      { id: "commission",   label: "Commission / marketplace", hint: "Take a % of each transaction that happens on your platform" },
      { id: "one-time",     label: "One-time purchase",     hint: "Users pay once to unlock features, templates, or downloads" },
      { id: "freemium",     label: "Freemium",              hint: "Free tier to grow users, paid tier for power features" },
      { id: "free",         label: "Free / grant-funded",   hint: "Phase 1 is free — monetisation comes later or via grants" },
    ],
  },
  {
    id:       "payments",
    type:     "select",
    question: "Do users need to pay each other or make purchases through your platform?",
    subtitle: "This determines whether payment processing is in your Phase 1 or can wait.",
    options: [
      { id: "yes",     label: "Yes — payments are core",     hint: "Your product doesn't work without money moving through it" },
      { id: "phase2",  label: "Not in Phase 1",              hint: "Payments can wait — you want to test the core flow first" },
      { id: "unsure",  label: "Not sure yet" },
    ],
  },
  {
    id:       "users-interact",
    type:     "select",
    question: "How do users interact with each other on your platform?",
    subtitle: "This shapes your data model and the complexity of Phase 1.",
    options: [
      { id: "solo",        label: "They don't — it's a single-user tool", hint: "Each user works in their own private space" },
      { id: "marketplace", label: "They connect as buyers and sellers",    hint: "Two-sided market: producers and consumers, employers and job-seekers" },
      { id: "team",        label: "They share a team or organisation account", hint: "Multiple people in the same company / school / clinic" },
      { id: "social",      label: "They follow, message, or collaborate",  hint: "Community, social network, or collaborative workspace" },
    ],
  },
  {
    id:       "platform",
    type:     "select",
    question: "Which platform are you building for?",
    subtitle: "Platform choice significantly affects timeline. Mobile adds 40–60% to scope.",
    options: [
      { id: "web",      label: "Web only",              hint: "Browser-based — desktop and mobile browsers" },
      { id: "mobile",   label: "Mobile app only",       hint: "iOS + Android native app" },
      { id: "both",     label: "Web + mobile",          hint: "Full web platform and a companion mobile app" },
      { id: "whatsapp", label: "WhatsApp / USSD",       hint: "Conversational interface — no app download needed" },
    ],
  },
  {
    id:       "existing-users",
    type:     "select",
    question: "Do you already have users or customers?",
    subtitle: "This affects how much validation your MVP needs to do.",
    options: [
      { id: "paying",  label: "Yes — paying customers already", hint: "You have a business, you're digitising or scaling it" },
      { id: "free",    label: "Yes — free users or a waitlist",  hint: "People have signed up or expressed interest" },
      { id: "none",    label: "No — pre-launch",                 hint: "The MVP is how you'll find and validate your first users" },
    ],
  },
];

/* ── Feature generation ──────────────────────────────────────────────────── */

export type Phase = 1 | 2 | "never";

export interface GeneratedFeature {
  feature:     string;
  reason:      string;
  phase:       Phase;
}

export function generateMVPScope(answers: Record<string, string>): {
  phase1:    GeneratedFeature[];
  phase2:    GeneratedFeature[];
  neverBuild: string[];
  stackHint:  string;
  weekRange:  string;
  insights:   string[];
} {
  const p1: GeneratedFeature[] = [];
  const p2: GeneratedFeature[] = [];

  const add = (phase: Phase, feature: string, reason: string) => {
    if (phase === 1) p1.push({ feature, reason, phase });
    else if (phase === 2) p2.push({ feature, reason, phase });
  };

  /* ── Always in Phase 1 ──────────────────────────────────────────────── */
  add(1, "User registration & email authentication", "Every product needs a way to identify its users.");
  add(1, answers["core-action"] ? `Core feature: ${answers["core-action"]}` : "Core value-delivery feature", "This is the reason your product exists. It must work perfectly in Phase 1.");
  add(1, "Basic user profile (name, email, photo)", "Users need to manage their own information from day one.");
  add(1, "Email notifications for key events", "Users need to know when something important happens, even if they're not in the app.");
  if (answers.platform !== "whatsapp") {
    add(1, "Mobile-responsive design", "Over 85% of Nigerian internet users access the web on mobile.");
  }

  /* ── Revenue model features ─────────────────────────────────────────── */
  if (answers.revenue === "subscription") {
    const needsPayments = answers.payments !== "phase2";
    if (needsPayments) {
      add(1, "Subscription billing (Paystack)", "Your revenue model depends on recurring payments — this must work in Phase 1.");
    } else {
      add(1, "Subscription tier logic (no payment yet)", "Define your tiers and limits so you can add billing in Phase 2 without rewriting the feature system.");
      add(2, "Paystack subscription billing", "Activate payments once your free users prove the value.");
    }
    add(1, "Plan upgrade / downgrade flow", "Users need to be able to manage their subscription.");
  }

  if (answers.revenue === "commission" || answers.payments === "yes") {
    add(1, "Payment processing via Paystack", "Your platform collects money — this is Phase 1, not Phase 2.");
    add(1, "Transaction history for both parties", "Buyers and sellers both need a record of what happened.");
    add(2, "Payout scheduling & reporting", "Automate the payout side once transaction volume justifies it.");
  }

  if (answers.revenue === "freemium") {
    add(1, "Feature gating (free vs. paid)", "Decide which features are free and which are paid — and enforce it in the code.");
    add(2, "Paystack / upgrade flow", "Monetise after you've proven people stay in the free tier.");
  }

  if (answers.revenue === "one-time") {
    add(1, "One-time purchase checkout (Paystack)", "Single purchase flow must work before you can sell anything.");
    add(1, "Post-purchase access unlock / download", "The thing they paid for must be delivered immediately and reliably.");
  }

  /* ── User interaction model ─────────────────────────────────────────── */
  if (answers["users-interact"] === "marketplace") {
    add(1, "Listing creation and management", "Sellers need to publish what they're offering.");
    add(1, "Search and browsing for buyers", "Buyers can't buy what they can't find.");
    add(1, "Enquiry / contact between parties", "The marketplace needs a way for both sides to connect.");
    add(2, "Reviews and ratings system", "Trust signals matter once you have volume — not before.");
    add(2, "Saved listings / watchlist", "Nice to have once users are regularly returning.");
  }

  if (answers["users-interact"] === "team") {
    add(1, "Organisation / team account creation", "Teams need a shared workspace, not individual logins.");
    add(1, "Invite members by email", "Team growth depends on easy onboarding of colleagues.");
    add(1, "Role-based permissions (admin / member)", "Not everyone should see or edit everything.");
    add(2, "Audit log / activity history", "Useful once teams are large enough that accountability matters.");
    add(2, "SSO / Google Workspace login", "Enterprise sales often require this — not needed in Phase 1.");
  }

  if (answers["users-interact"] === "social") {
    add(1, "User profiles with public page", "Social products need identity — a page others can visit.");
    add(1, "Follow / connect mechanism", "The core social graph must exist in Phase 1.");
    add(2, "Direct messaging", "Expensive to build well — add it once you've proven the core engagement loop.");
    add(2, "Notifications feed", "Users can't engage with what they can't see.");
    add(2, "Content algorithm / recommendations", "Algorithm comes after you have enough content to rank.");
  }

  /* ── Platform-specific features ─────────────────────────────────────── */
  if (answers.platform === "mobile" || answers.platform === "both") {
    add(1, "React Native mobile app (iOS + Android)", "Single codebase — both stores from one development effort.");
    add(1, "Push notifications", "Mobile users expect native push — critical for re-engagement.");
    add(1, "Offline mode for core features", "Nigerian 3G/4G is intermittent — your app must not break without signal.");
    add(2, "App store optimisation (ASO)", "Improve discoverability after your initial user base proves the concept.");
  }

  if (answers.platform === "web" || answers.platform === "both") {
    add(1, "PWA manifest + service worker", "Allows install on home screen and basic offline on web — low cost, high value.");
  }

  if (answers.platform === "whatsapp") {
    add(1, "WhatsApp Business API integration", "The core delivery channel for your product.");
    add(1, "Conversational flow builder", "Define your chat flows — the product's UX lives here.");
    add(1, "Webhook handler for incoming messages", "Your backend needs to respond to user messages reliably.");
    add(2, "AI / NLP for open-ended questions", "Add intelligence to your bot once the core flows are proven.");
  }

  /* ── User type features ─────────────────────────────────────────────── */
  if (answers.user === "enterprise") {
    add(1, "Multi-admin account management", "Enterprise clients always need more than one admin.");
    add(2, "Custom branding / white-label", "Enterprise often needs their logo — Phase 2.");
    add(2, "SLA dashboard and uptime reporting", "Enterprise SLAs need dashboards — after contract is signed.");
  }

  if (answers.user === "ngo") {
    add(1, "Beneficiary / participant tracking", "NGOs need to record who they're serving.");
    add(2, "Impact reporting and data export", "Reporting to funders is important but can start with CSV exports.");
  }

  /* ── Existing users ─────────────────────────────────────────────────── */
  if (answers["existing-users"] === "paying") {
    add(1, "Data migration from current system", "Your existing clients' data must move into the new system.");
    add(1, "Parallel operation / import tools", "Support existing workflows while the new system beds in.");
  }

  if (answers["existing-users"] === "none") {
    add(1, "Landing page with waitlist / email capture", "Before anything else — start capturing demand.");
  }

  /* ── Always Phase 2 ─────────────────────────────────────────────────── */
  add(2, "Admin dashboard with analytics", "Build this after you know which metrics actually matter.");
  add(2, "Advanced search filters", "Add filters once users tell you what they're searching for.");
  add(2, "Bulk import / export (CSV)", "Power users want this — build it after Phase 1 validates.");
  add(2, "In-app help centre / knowledge base", "Documentation is not a Phase 1 feature.");
  add(2, "Referral and affiliate programme", "Growth mechanics come after product-market fit.");

  /* ── Never in Phase 1 ───────────────────────────────────────────────── */
  const neverBuild = [
    "\"Perfect\" UI — polish is a Phase 2 concern; Phase 1 must prove the value, not the aesthetics",
    "Multi-language / localisation — nail one language and market before expanding",
    "Dark mode — a nice touch that costs a week; not a reason to choose or keep your product",
    "Complex admin panel — start with direct database access or a basic table view",
    "Native iOS and Android separate codebases — use React Native; you can split later if volume justifies",
    "Third-party integrations beyond one payment gateway — add integrations when users ask, not before",
    "Perfect test coverage — ship, then write tests on the parts that break",
  ];

  /* ── Stack recommendation ───────────────────────────────────────────── */
  const stackHint =
    answers.platform === "mobile"   ? "React Native + Expo + Supabase" :
    answers.platform === "whatsapp" ? "Node.js + WhatsApp Cloud API + Supabase" :
    answers.platform === "both"     ? "Next.js (web) + React Native (mobile) + Supabase" :
    answers.user === "enterprise"   ? "Next.js + Django + PostgreSQL (complex auth + permissions)" :
                                      "Next.js + Supabase (fastest path to production)";

  /* ── Time estimate ──────────────────────────────────────────────────── */
  const baseWeeks = p1.length <= 7 ? "6–10" : p1.length <= 12 ? "10–16" : "14–20";
  const weekRange =
    answers.platform === "both" ? baseWeeks.split("–").map((w) => Math.round(parseInt(w) * 1.5)).join("–") :
    answers["existing-users"] === "paying" ? baseWeeks.split("–").map((w) => Math.round(parseInt(w) * 1.3)).join("–") :
    baseWeeks;

  /* ── Strategic insights ─────────────────────────────────────────────── */
  const insights: string[] = [];

  if (p1.length > 13)
    insights.push("Your Phase 1 scope is ambitious. Consider cutting to the 5–6 most essential features and treating this as a very fast pilot — you'll learn more in 8 weeks of real users than 6 months of building.");

  if (answers.payments === "yes" && answers["existing-users"] === "none")
    insights.push("You're asking users to pay without any existing trust. Plan a strong onboarding flow and consider a free trial period in Phase 1 to reduce the friction of that first payment.");

  if (answers.platform === "both")
    insights.push("Building web + mobile simultaneously doubles scope and complexity. Unless mobile is truly the core experience, consider launching web first and adding the app once you have paying users.");

  if (answers["users-interact"] === "marketplace" && answers["existing-users"] === "none")
    insights.push("Marketplaces have a chicken-and-egg problem: buyers want sellers, sellers want buyers. Plan to manually seed one side (often sellers) before launch. Don't build a marketplace engine before you have your first 10 suppliers.");

  if (answers.platform === "whatsapp")
    insights.push("WhatsApp products have the fastest adoption in Nigeria but the least flexibility in UI. Make sure your core user journey can be completed in a conversational format before committing to this architecture.");

  return { phase1: p1, phase2: p2, neverBuild, stackHint, weekRange, insights };
}
