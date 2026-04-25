import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_FARETTA_SITE_URL ?? "https://faretta.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    "/",
    "/about",
    "/pricing",
    "/contact",
    "/privacy",
    "/embed",
    "/login",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : 0.6,
  }));
}
