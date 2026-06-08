export const post = {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (R: any) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R: any) => R.required() },
    { name: "author", title: "Author", type: "reference", to: [{ type: "teamMember" }] },
    { name: "mainImage", title: "Cover Image", type: "image", options: { hotspot: true } },
    { name: "category", title: "Category", type: "reference", to: [{ type: "category" }] },
    { name: "publishedAt", title: "Published At", type: "datetime" },
    { name: "estimatedReadingTime", title: "Reading Time (min)", type: "number" },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image" }] },
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "mainImage" },
    prepare: ({ title, author, media }: any) => ({ title, subtitle: author, media }),
  },
};
