import { groq } from "next-sanity";

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, publishedAt,
    "category": category->title,
    "author": author->{ name, "avatar": image.asset->url },
    "coverImage": mainImage.asset->url,
    excerpt,
    estimatedReadingTime
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, body,
    "category": category->title,
    "author": author->{ name, "avatar": image.asset->url },
    "coverImage": mainImage.asset->url,
    estimatedReadingTime
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id, name, slug,
    "image": screenshot.asset->url,
    tags, stack, liveUrl, caseStudy,
    challenge, solution, results
  }
`;

export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, slug, tagline, icon, tag, color,
    description, features, techStack, process,
    startingPrice, deliveryTime
  }
`;

export const allTemplatesQuery = groq`
  *[_type == "template"] | order(_createdAt desc) {
    _id, name, type, price,
    "image": screenshot.asset->url,
    features, deliveryTime
  }
`;

export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, name, role,
    "photo": image.asset->url,
    linkedin, twitter, bio
  }
`;

export const investSchemesQuery = groq`
  *[_type == "investScheme"] | order(order asc) {
    _id, name, type, description, eligibility, ctaText
  }
`;
