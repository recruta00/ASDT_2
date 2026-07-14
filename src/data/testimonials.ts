/**
 * Customer reviews — REAL ones only. The home-page section stays hidden while
 * this list is empty, so the site never shows fabricated social proof.
 *
 * TODO: paste genuine reviews here (and set `googleReviewsUrl` in
 * src/config/site.ts to link the Google Business Profile). Dated, named,
 * specific quotes convert best — e.g.:
 *
 *   {
 *     quote:
 *       "X-ADV impeccable, livré à notre riad en 20 minutes. La route de "
 *       + "l'Ourika en DCT, un régal. Caution rendue au retour sans discussion.",
 *     name: "Julien",
 *     origin: "France",
 *     date: "2026-04",
 *     context: "Honda X-ADV 750 · 5 jours",
 *   },
 */

export type Testimonial = {
  quote: string;
  name: string;
  origin?: string;
  date: string; // YYYY-MM
  context?: string; // what was rented, duration
};

export const testimonials: Testimonial[] = [];
