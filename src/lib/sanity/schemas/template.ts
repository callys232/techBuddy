export const template = {
  name: "template",
  title: "Template",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (R: any) => R.required() },
    { name: "type", title: "Type", type: "string", options: { list: ["landing", "saas", "ecommerce", "portfolio", "blog", "dashboard", "mobile"] } },
    { name: "screenshot", title: "Screenshot", type: "image", options: { hotspot: true } },
    { name: "price", title: "Price Label", type: "string" },
    { name: "features", title: "Features", type: "array", of: [{ type: "string" }] },
    { name: "deliveryTime", title: "Delivery Time", type: "string" },
  ],
};
