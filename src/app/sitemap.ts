import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { staticRoutes, routes } from "@/config/routes";
import { bikes } from "@/data/bikes";
import { properties } from "@/data/properties";

/** Covers every static and generated route (spec §9.4). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain.replace(/\/$/, "");

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : 0.7,
  }));

  const bikeEntries: MetadataRoute.Sitemap = bikes.map((b) => ({
    url: `${base}${routes.bike(b.slug)}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const stayEntries: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${base}${routes.stay(p.slug)}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...bikeEntries, ...stayEntries];
}
