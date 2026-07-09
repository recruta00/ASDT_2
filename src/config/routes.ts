/**
 * Central route map — single source of truth for every path on the site.
 *
 * Why this exists: v1 ships French-only, but the spec requires that adding an
 * English locale (`/en/...`) + `hreflang` later must NOT require touching every
 * component. All internal links read from here, so a future i18n pass swaps this
 * one map (e.g. `routes.fr` / `routes.en`) without hunting hard-coded strings.
 */

export const routes = {
  home: "/",
  bikes: "/motos",
  bike: (slug: string) => `/motos/${slug}`,
  stays: "/sejours",
  stay: (slug: string) => `/sejours/${slug}`,
  book: "/reserver",
  about: "/a-propos",
  faq: "/faq",
  contact: "/contact",
  conditions: "/conditions",
  privacy: "/confidentialite",
} as const;

/** Primary navigation shown in the navbar. */
export const primaryNav = [
  { label: "Motos", href: routes.bikes },
  { label: "Séjours", href: routes.stays },
  { label: "Réserver", href: routes.book },
  { label: "À propos", href: routes.about },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
] as const;

/** Footer link groups — ensures no orphan pages (spec §9.7). */
export const footerNav = [
  {
    title: "Louer",
    links: [
      { label: "Louer une moto", href: routes.bikes },
      { label: "Louer un séjour", href: routes.stays },
      { label: "Réserver", href: routes.book },
    ],
  },
  {
    title: "Agence",
    links: [
      { label: "À propos", href: routes.about },
      { label: "FAQ", href: routes.faq },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Infos légales",
    links: [
      { label: "Conditions de location", href: routes.conditions },
      { label: "Confidentialité", href: routes.privacy },
    ],
  },
] as const;

/** All statically-known routes, for sitemap generation. */
export const staticRoutes = [
  routes.home,
  routes.bikes,
  routes.stays,
  routes.book,
  routes.about,
  routes.faq,
  routes.contact,
  routes.conditions,
  routes.privacy,
] as const;
