/** Fire-and-forget tool lead capture. Never throws, never blocks navigation. */
export function captureToolLead(data: {
  tool:        "cost-estimator" | "timeline-estimator" | "stack-picker" | "free-audit" | "ndpr-checker" | "mvp-scope";
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
