export interface InvestScheme {
  name: string;
  type: string;
  description: string;
  eligibility: string;
  ctaText: string;
}

export const INVEST_SCHEMES: InvestScheme[] = [
  {
    name: "Equity Build",
    type: "Equity",
    description:
      "We build your product in exchange for an equity stake. Best for strong ideas with traction.",
    eligibility: "Early-stage startups with validated idea",
    ctaText: "Express interest",
  },
  {
    name: "Revenue Share",
    type: "Revenue",
    description:
      "We build now, you pay from revenue. Zero upfront cost for vetted founders.",
    eligibility: "Founders with clear revenue model",
    ctaText: "Express interest",
  },
  {
    name: "Incubation Support",
    type: "Incubation",
    description:
      "Tech support at reduced rates for accelerator cohort companies.",
    eligibility: "Accelerator cohort members",
    ctaText: "Apply now",
  },
  {
    name: "Grant Navigator",
    type: "Advisory",
    description:
      "Advisory for available grants — we help you find and apply for non-dilutive funding.",
    eligibility: "All founders",
    ctaText: "Learn more",
  },
  {
    name: "Tech Partnership",
    type: "Partnership",
    description:
      "Long-term co-building arrangements for established companies expanding their tech.",
    eligibility: "Established businesses",
    ctaText: "Partner with us",
  },
];
