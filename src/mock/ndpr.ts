/* NDPR Compliance Checker — question bank and scoring ───────────────────── */

export type NDPRAnswer = "yes" | "partial" | "no" | null;

export interface NDPRQuestion {
  id:           string;
  section:      string;
  question:     string;
  guidance:     string;        /* shown below the question */
  weight:       1 | 2 | 3;    /* 3 = critical provision */
  failAdvice:   string;        /* shown in results when no/partial */
  partialLabel: string;        /* what "Partial" means for this question */
}

export const NDPR_QUESTIONS: NDPRQuestion[] = [
  /* ── Section 1: Lawful Basis & Consent ──────────────────────────────────── */
  {
    id:           "lawful-basis",
    section:      "Lawful Basis",
    question:     "Do you have a documented lawful basis for every type of personal data you collect?",
    guidance:     "NDPR requires you to identify a lawful basis before processing personal data — consent, contract, legal obligation, vital interest, or legitimate interest.",
    weight:       3,
    partialLabel: "Some data types have a documented basis, others do not",
    failAdvice:   "Map all personal data you collect and assign a lawful basis to each. Document this in a data register. Without this, all processing is technically unlawful under NDPR.",
  },
  {
    id:           "consent",
    section:      "Lawful Basis",
    question:     "When you rely on consent, is it freely given, specific, informed, and unambiguous?",
    guidance:     "Pre-ticked boxes, bundled consent, or vague language (\"we may use your data\") do not meet the NDPR standard for valid consent.",
    weight:       3,
    partialLabel: "Consent is obtained but the language is vague or bundled with T&Cs",
    failAdvice:   "Redesign your consent flows. Use a separate, unticked checkbox with a plain-English description of exactly what you're collecting and why. Store records of when and how consent was given.",
  },
  {
    id:           "data-minimisation",
    section:      "Lawful Basis",
    question:     "Do you only collect personal data that is strictly necessary for your stated purpose?",
    guidance:     "Collecting a user's date of birth \"just in case\" when you only need their email is a data minimisation violation.",
    weight:       2,
    partialLabel: "Mostly, but some fields are collected out of habit rather than necessity",
    failAdvice:   "Audit every field in every form. Remove anything you don't actively use. This also reduces your breach exposure.",
  },

  /* ── Section 2: Privacy Notice ───────────────────────────────────────────── */
  {
    id:           "privacy-policy",
    section:      "Privacy Notice",
    question:     "Do you have a clear, published Privacy Policy that is easy for users to find?",
    guidance:     "The policy must be accessible from every page where you collect data (sign-up forms, contact pages, checkout). A link in the footer is the minimum.",
    weight:       2,
    partialLabel: "A privacy policy exists but it is hard to find or uses legal boilerplate that users can't understand",
    failAdvice:   "Write a plain-language privacy policy and link to it from your footer, sign-up forms, and cookie banner. It must explain what you collect, why, how long you keep it, and who you share it with.",
  },
  {
    id:           "retention-policy",
    section:      "Privacy Notice",
    question:     "Do you have a documented data retention schedule specifying how long each type of data is kept?",
    guidance:     "Keeping data indefinitely \"in case it's useful\" violates NDPR's storage limitation principle. You must define and enforce retention periods.",
    weight:       1,
    partialLabel: "A general retention policy exists but it is not enforced technically (data is still kept longer)",
    failAdvice:   "Create a data retention schedule — e.g., support tickets deleted after 2 years, user accounts after 5 years of inactivity. Implement automated deletion or anonymisation at those points.",
  },

  /* ── Section 3: Data Subject Rights ─────────────────────────────────────── */
  {
    id:           "access-right",
    section:      "Data Subject Rights",
    question:     "Can users request and receive a copy of all personal data you hold about them within 72 hours?",
    guidance:     "This is the right of access. NDPR requires you to provide data in a commonly used, machine-readable format without charging a fee for the first request.",
    weight:       2,
    partialLabel: "Users can request data but the process is manual, slow, or incomplete",
    failAdvice:   "Build or buy a Subject Access Request (SAR) process. At minimum, a form that routes to a responsible person who can pull and deliver all stored data within 72 hours.",
  },
  {
    id:           "deletion-right",
    section:      "Data Subject Rights",
    question:     "Can users request deletion of their personal data (the right to erasure)?",
    guidance:     "You must be able to delete all personal data about a user upon request unless you have a legal obligation to retain it (e.g., financial records for 7 years).",
    weight:       2,
    partialLabel: "Deletion can be done but it requires manual intervention and may miss some systems",
    failAdvice:   "Map every system where user data is stored (database, email platform, analytics, backups) and create a deletion workflow that covers all of them. Backups are a common gap.",
  },
  {
    id:           "correction-right",
    section:      "Data Subject Rights",
    question:     "Can users correct or update inaccurate personal data held about them?",
    guidance:     "Most apps satisfy this with an editable profile page. The gap is usually in data held in other systems (support tickets, logs).",
    weight:       1,
    partialLabel: "Users can update their profile but data in other systems (CRM, logs, email) cannot be corrected",
    failAdvice:   "Ensure corrections made in your app propagate to all downstream systems. At minimum, document the process for manual correction of records in systems that don't sync automatically.",
  },

  /* ── Section 4: Security ─────────────────────────────────────────────────── */
  {
    id:           "encryption",
    section:      "Security",
    question:     "Is personal data encrypted at rest (in the database) and in transit (HTTPS)?",
    guidance:     "HTTPS is the baseline. At-rest encryption means your database and file storage are encrypted, not just the connection to them.",
    weight:       3,
    partialLabel: "HTTPS is in place but data at rest is not encrypted",
    failAdvice:   "Enable database encryption immediately. On Supabase or PostgreSQL, use pgcrypto for sensitive columns. Ensure all S3/file storage buckets are encrypted. This is both an NDPR and a PCI requirement.",
  },
  {
    id:           "breach-plan",
    section:      "Security",
    question:     "Do you have a documented data breach response plan, and can you detect a breach within 72 hours?",
    guidance:     "NDPR requires notifying NITDA within 72 hours of discovering a breach. Without monitoring in place, you may not even know a breach has occurred.",
    weight:       2,
    partialLabel: "A plan exists on paper but detection tooling (alerts, logs) is not in place",
    failAdvice:   "Set up database query logging, failed authentication alerting, and unusual traffic monitoring. Write a breach response runbook: who gets called, what gets shut down, what NITDA is notified. Test it annually.",
  },
  {
    id:           "access-controls",
    section:      "Security",
    question:     "Are access controls in place so employees only see the personal data they need for their role?",
    guidance:     "A customer service rep should not be able to query raw payment data. A marketing intern should not have database access. Role-based access control (RBAC) is required.",
    weight:       2,
    partialLabel: "Some access restrictions exist but are inconsistently applied (e.g., shared admin credentials)",
    failAdvice:   "Implement role-based access control at the application and database level. Audit who has admin access. Remove or restrict accounts of former employees. Log all administrative actions.",
  },

  /* ── Section 5: Data Governance ─────────────────────────────────────────── */
  {
    id:           "dpo",
    section:      "Data Governance",
    question:     "Have you appointed a Data Protection Officer (DPO) or designated a responsible person for data protection?",
    guidance:     "Organisations processing personal data of more than 1,000 individuals per month must appoint a DPO. Smaller organisations should still designate a responsible person.",
    weight:       2,
    partialLabel: "Someone is informally responsible for data protection but has no formal mandate or training",
    failAdvice:   "Formally appoint a DPO (or responsible person for smaller orgs). Provide NDPR training. Register them with NITDA. This person must have direct access to senior management and cannot be overruled on data protection matters.",
  },
  {
    id:           "third-party-agreements",
    section:      "Data Governance",
    question:     "Do you have written Data Processing Agreements (DPAs) with all third parties that process personal data on your behalf?",
    guidance:     "This includes cloud providers (AWS, Supabase), email platforms (Mailchimp, Resend), analytics tools (PostHog, GA), payment processors, and any contractor who touches user data.",
    weight:       2,
    partialLabel: "Agreements exist with major vendors but not all third parties (e.g., contractors, SaaS tools)",
    failAdvice:   "Audit all vendors who touch your user data. Most major platforms provide standard DPA documents. Sign and store them. For contractors, add a data processing clause to your service agreements.",
  },
  {
    id:           "international-transfer",
    section:      "Data Governance",
    question:     "If you transfer personal data outside Nigeria, do you have appropriate safeguards in place?",
    guidance:     "Using AWS US-East, Stripe, or US-based analytics tools means data leaves Nigeria. NDPR requires adequate safeguards (e.g., Standard Contractual Clauses, adequacy decisions).",
    weight:       2,
    partialLabel: "We use international services but have not formally documented transfer safeguards",
    failAdvice:   "Map all international data flows. For each, identify the safeguard: DPA with SCC, EU adequacy decision, or equivalent. Document this in your data register. Hosting in an African or EU region where possible reduces this exposure.",
  },

  /* ── Section 6: NITDA Compliance ────────────────────────────────────────── */
  {
    id:           "nitda-audit",
    section:      "NITDA Filing",
    question:     "Have you filed your annual Data Protection Audit report with NITDA (or commissioned a licensed auditor)?",
    guidance:     "All organisations processing personal data in Nigeria must file an annual Data Protection Audit report with NITDA. Failure to file attracts a fine of ₦2M or 2% of annual gross revenue.",
    weight:       3,
    partialLabel: "We have started the process but have not yet filed",
    failAdvice:   "This is the most direct NDPR compliance action with a financial penalty. Engage a NITDA-licensed Data Protection Compliance Organisation (DPCO) to conduct your audit and file on your behalf. We can refer you to one.",
  },
  {
    id:           "dpia",
    section:      "NITDA Filing",
    question:     "Have you conducted a Data Protection Impact Assessment (DPIA) for high-risk processing activities?",
    guidance:     "A DPIA is required before starting any processing that is likely to result in a high risk to individuals — e.g., large-scale health data, biometric processing, or systematic tracking of individuals.",
    weight:       1,
    partialLabel: "A DPIA has been done for some activities but not all high-risk ones",
    failAdvice:   "Identify all high-risk processing activities in your product. For each, conduct a DPIA: document the purpose, necessity, risks, and mitigations. File with your DPO. This is both a legal requirement and genuinely good risk management.",
  },
];

/* ── Scoring ─────────────────────────────────────────────────────────────── */

export function scoreNDPR(answers: Record<string, NDPRAnswer>): {
  score:       number;  /* 0–100 */
  maxPoints:   number;
  earnedPoints: number;
  grade:       "critical" | "at-risk" | "progressing" | "compliant";
  gradeLabel:  string;
  gradeColor:  string;
  passed:      NDPRQuestion[];
  partial:     NDPRQuestion[];
  failed:      NDPRQuestion[];
  critical:    NDPRQuestion[]; /* weight 3 + failed */
} {
  const POINTS = { yes: 1, partial: 0.5, no: 0 };

  let earned = 0;
  let max    = 0;
  const passed: NDPRQuestion[] = [];
  const partial: NDPRQuestion[] = [];
  const failed: NDPRQuestion[] = [];
  const critical: NDPRQuestion[] = [];

  for (const q of NDPR_QUESTIONS) {
    const a = answers[q.id] ?? "no";
    const pts = POINTS[a] * q.weight;
    earned += pts;
    max    += q.weight;
    if (a === "yes")          passed.push(q);
    else if (a === "partial") partial.push(q);
    else {
      failed.push(q);
      if (q.weight === 3) critical.push(q);
    }
  }

  const score = Math.round((earned / max) * 100);

  const grade =
    score < 40  ? "critical"    :
    score < 65  ? "at-risk"     :
    score < 85  ? "progressing" : "compliant";

  const gradeLabel =
    grade === "critical"    ? "High Risk — Immediate Action Required" :
    grade === "at-risk"     ? "At Risk — Significant Gaps Present"    :
    grade === "progressing" ? "Progressing — Key Gaps Remain"         :
                              "Largely Compliant — Maintain & Improve";

  const gradeColor =
    grade === "critical"    ? "text-rose-400"   :
    grade === "at-risk"     ? "text-amber-400"  :
    grade === "progressing" ? "text-sky-400"    : "text-emerald-400";

  return { score, maxPoints: max, earnedPoints: earned, grade, gradeLabel, gradeColor, passed, partial, failed, critical };
}

export const NDPR_SECTIONS = [...new Set(NDPR_QUESTIONS.map((q) => q.section))];
