import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shantichakrabloodsocietysunamganj-g.vercel.app";
  const routes = ["", "/donors", "/request-blood", "/requests", "/become-donor", "/about", "/impact", "/media", "/events", "/donate", "/contact", "/faq", "/gallery", "/blog", "/login", "/register"];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));
}
