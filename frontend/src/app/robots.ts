import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api/", "/login", "/register", "/forgot-password", "/notifications"],
    },
    sitemap: "https://shantichakrabloodsociety.rahatahmed.site/sitemap.xml",
  };
}
