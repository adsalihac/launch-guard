import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://launchguard.dev",
      lastModified: new Date("2026-06-10"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
