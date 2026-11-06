/** Fire-and-forget tool lead capture. Never throws, never blocks navigation. */
export function captureToolLead(data: {
  tool:        "cost-estimator" | "timeline-estimator" | "stack-picker" | "free-audit" | "ndpr-checker" | "mvp-scope" | "build-vs-buy" | "pmf-score" | "sport-predictor"
             | "qr-code-generator" | "invoice-generator" | "name-generator" | "cover-letter-generator" | "business-plan-generator" | "premium-audit" | "whatsapp-bot-builder"
             | "fintech-fees-calculator" | "downtime-cost-calculator" | "repo-health-scan" | "hire-rate-calculator" | "lead-magnet";
  source:      "email-capture" | "quote-click" | "whatsapp-click";
  email?:      string;
  selections:  Record<string, unknown>;
  result:      Record<string, unknown>;
}) {
  fetch("/api/tool-leads", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).catch(() => null); /* silent — user action must never wait on this */
}
