import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechBuddy — Software Development & Free Business Tools",
    short_name: "TechBuddy",
    description:
      "Founder-led digital product studio and software development company building web apps, mobile apps, fintech platforms, and AI tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1528",
    theme_color: "#1E3A8A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}

