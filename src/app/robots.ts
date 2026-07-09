import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.domain.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Temporary design-comparison route; not for indexing.
      disallow: ["/direction-b"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
