export const project = {
  name: "project",
  title: "Portfolio Project",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (R: any) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "screenshot", title: "Screenshot", type: "image", options: { hotspot: true } },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
    { name: "stack", title: "Tech Stack", type: "array", of: [{ type: "string" }] },
    { name: "liveUrl", title: "Live URL", type: "url" },
    { name: "caseStudy", title: "Has Case Study", type: "boolean", initialValue: false },
    { name: "challenge", title: "Challenge", type: "text" },
    { name: "solution", title: "Solution", type: "text" },
    { name: "results", title: "Results", type: "text" },
    { name: "clientTestimonial", title: "Client Testimonial", type: "text" },
    { name: "category", title: "Category", type: "string", options: { list: ["web", "mobile", "saas", "fintech", "ecommerce", "internal"] } },
  ],
};
