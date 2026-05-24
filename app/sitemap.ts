import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const base = SITE.url.replace(/\/$/, "");
  const sections = [
    "",
    "#services",
    "#skills",
    "#portfolio",
    "#team",
    "#testimonials",
    "#contact",
  ];
  return sections.map((s) => ({
    url: `${base}/${s}`,
    lastModified,
    changeFrequency: "monthly",
    priority: s === "" ? 1 : 0.7,
  }));
}
