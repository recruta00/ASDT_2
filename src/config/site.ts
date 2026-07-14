/**
 * Recruta Rent — central site configuration.
 *
 * Every placeholder value the human must confirm lives HERE (and only here),
 * so swapping real contact details later is a one-file edit.
 * Values marked `// TODO` are spec example placeholders — see TODO.md.
 */

export const site = {
  name: "Recruta Rent",
  legalName: "Recruta Rent",
  tagline: "Roulez libre. Vivez grand.",
  taglineEn: "Ride the city. Stay in style.",
  description:
    "Location du Honda X-ADV 750, d'appartements et de villas à Marrakech. Réservation rapide sur WhatsApp, caution transparente, contrats clairs.",

  // Indicative EUR conversion for tourist price anchoring (build-time, approx).
  eurRate: 0.093, // TODO: confirm/refresh occasionally (1 MAD ≈ 0.093 €)

  city: "Marrakech",
  country: "Maroc",
  countryCode: "MA",
  currency: "MAD",
  currencyLabel: "MAD",
  locale: "fr",

  // --- Contact (placeholders — confirm in TODO.md) ---
  phoneDisplay: "+212 6 00 00 00 00", // TODO: confirm
  whatsappNumber: "212600000000", // TODO: confirm (digits only, international format)
  email: "contact@recrutarent.com", // TODO: confirm
  address: "Guéliz, Marrakech", // TODO: confirm
  addressLocality: "Marrakech",
  addressRegion: "Marrakech-Safi",
  postalCode: "40000", // TODO: confirm
  streetAddress: "Guéliz", // TODO: confirm
  instagramUrl: "https://instagram.com/recrutarent", // TODO: confirm
  domain: "https://recrutarent.com", // TODO: confirm
  mapEmbedUrl: "", // TODO: confirm — paste a Google Maps embed URL, or leave empty to hide the map

  // Approximate geo for Marrakech (Guéliz) — refine with real coordinates.
  geo: { latitude: 31.6295, longitude: -7.9811 }, // TODO: confirm

  // Business hours — used in copy and LocalBusiness schema.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "20:00" },
    { days: ["Sunday"], opens: "10:00", closes: "18:00" },
  ],
  openingHoursLabel: "Lun–Sam 9h–20h · Dim 10h–18h",

  // Response-time claim — kept honest per the spec voice rules.
  whatsappResponse: "Réponse rapide sur WhatsApp",

  // Google Business Profile reviews URL. Leave empty until the profile exists —
  // the reviews section's Google link stays hidden while this is "".
  googleReviewsUrl: "" as string, // TODO: paste the Google Maps reviews link

  // Ambient hero video (RIDE panel, desktop only). Drop an mp4 into /public/videos
  // and set the path here, e.g. "/videos/hero-xadv.mp4". Empty = poster image only.
  heroVideoSrc: "/videos/hero-xadv.mp4", // Veo 3.1 ultra — studio arc around the X-ADV 750 (image-to-video from the hero still)
} as const;

export type Site = typeof site;
