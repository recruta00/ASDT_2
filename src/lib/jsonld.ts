import { site } from "@/config/site";
import { routes } from "@/config/routes";
import { bikes } from "@/data/bikes";
import { properties } from "@/data/properties";
import type { Bike, Property } from "@/data/types";
import type { Crumb } from "@/components/ui/Breadcrumb";

/**
 * GoodRelations vocabulary: marks an Offer as a RENTAL, not a sale.
 * Without it, search engines assume Product offers mean "for sale".
 */
const LEASE_OUT = "http://purl.org/goodrelations/v1#LeaseOut";

/** Absolute URL from a site-relative path. */
function abs(path: string): string {
  return new URL(path, site.domain).toString();
}

const dayNameMap: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.streetAddress,
  addressLocality: site.addressLocality,
  addressRegion: site.addressRegion,
  postalCode: site.postalCode,
  addressCountry: site.countryCode,
};

/** Site-wide LocalBusiness (spec §9.3) — typed for both activities:
 *  AutoRental (closest schema.org type to motorcycle rental) + LodgingBusiness. */
export function localBusiness() {
  const prices = [
    ...bikes.map((b) => b.pricePerDay),
    ...properties.map((p) => p.pricePerNight),
  ];
  return {
    "@context": "https://schema.org",
    "@type": ["AutoRental", "LodgingBusiness"],
    "@id": `${site.domain}#business`,
    name: site.name,
    description: site.description,
    url: site.domain,
    telephone: site.phoneDisplay,
    email: site.email,
    image: abs("/images/brand/og.jpg"),
    priceRange: `${site.currency} ${Math.min(...prices)} – ${Math.max(...prices)}`,
    knowsLanguage: ["fr", "en"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "reservations",
      telephone: site.phoneDisplay,
      availableLanguage: ["fr", "en"],
    },
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: { "@type": "City", name: site.city },
    openingHoursSpecification: site.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => dayNameMap[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [site.instagramUrl],
  };
}

/** Site-wide WebSite (spec §9.3). */
export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}#website`,
    name: site.name,
    url: site.domain,
    inLanguage: "fr",
    publisher: { "@id": `${site.domain}#business` },
  };
}

/** Bike detail — Product + Offer marked as a rental (spec §9.3). */
export function bikeProduct(bike: Bike) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    additionalType: "https://schema.org/Motorcycle",
    name: bike.name,
    description: bike.shortDescription,
    category: "Location de moto",
    image: bike.images.length ? bike.images.map(abs) : [abs("/images/brand/og.jpg")],
    brand: { "@type": "Brand", name: bike.name.split(" ")[0] },
    offers: {
      "@type": "Offer",
      businessFunction: LEASE_OUT,
      price: bike.pricePerDay,
      priceCurrency: site.currency,
      availability: "https://schema.org/InStock",
      url: abs(routes.bike(bike.slug)),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: bike.pricePerDay,
        priceCurrency: site.currency,
        unitCode: "DAY",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
      seller: { "@id": `${site.domain}#business` },
    },
  };
}

/** Property detail — Accommodation + Offer (spec §9.3). */
export function propertyAccommodation(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Accommodation"],
    name: property.name,
    description: property.shortDescription,
    image: property.images.length
      ? property.images.map(abs)
      : [abs("/images/brand/og.jpg")],
    numberOfBedroomsTotal: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.areaM2,
      unitCode: "MTK",
    },
    amenityFeature: property.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    offers: {
      "@type": "Offer",
      businessFunction: LEASE_OUT,
      price: property.pricePerNight,
      priceCurrency: site.currency,
      availability: "https://schema.org/InStock",
      url: abs(routes.stay(property.slug)),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: property.pricePerNight,
        priceCurrency: site.currency,
        unitCode: "DAY",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
      seller: { "@id": `${site.domain}#business` },
    },
  };
}

/** FAQPage (spec §9.3). */
export function faqPage(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** BreadcrumbList (spec §9.3). */
export function breadcrumbList(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  };
}
