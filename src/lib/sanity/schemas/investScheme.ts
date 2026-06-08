export const investScheme = {
  name: "investScheme",
  title: "Investment Scheme",
  type: "document",
  fields: [
    { name: "name", title: "Scheme Name", type: "string", validation: (R: any) => R.required() },
    { name: "type", title: "Type", type: "string", options: { list: ["Equity", "Revenue", "Incubation", "Advisory", "Partnership"] } },
    { name: "description", title: "Description", type: "text" },
    { name: "eligibility", title: "Eligibility", type: "string" },
    { name: "ctaText", title: "CTA Text", type: "string" },
    { name: "order", title: "Display Order", type: "number" },
  ],
};
