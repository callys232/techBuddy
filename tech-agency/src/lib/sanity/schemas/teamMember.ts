export const teamMember = {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (R: any) => R.required() },
    { name: "role", title: "Role", type: "string" },
    { name: "image", title: "Photo", type: "image", options: { hotspot: true } },
    { name: "bio", title: "Bio", type: "text" },
    { name: "linkedin", title: "LinkedIn URL", type: "url" },
    { name: "twitter", title: "Twitter/X URL", type: "url" },
    { name: "order", title: "Display Order", type: "number" },
  ],
};
