import type { MetadataRoute } from "next";
import { STATIC_BLOG_ARTICLES } from "@/data/blog-articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shantichakrabloodsociety.rahatahmed.site";
  const routes = [
    "",
    "/donors",
    "/request-blood",
    "/requests",
    "/blood-seekers",
    "/become-donor",
    "/eligibility",
    "/emergency",
    "/about",
    "/impact",
    "/media",
    "/events",
    "/donate",
    "/contact",
    "/faq",
    "/gallery",
    "/blog",
    "/volunteer",
    "/privacy",
    "/terms",
  ];

  const pageEntries = routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: (r === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: r === "" ? 1 : 0.8,
  }));

  const blogEntries = STATIC_BLOG_ARTICLES.map((article) => ({
    url: `${base}/blog/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: "monthly" as "monthly",
    priority: 0.7,
  }));

  return [...pageEntries, ...blogEntries];
}

