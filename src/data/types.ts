/**
 * Content types — deliberately CMS-shaped so these local seed files can be
 * swapped for a headless CMS later (spec §4) without touching components.
 */

export type BikeCategory = "scooter" | "moto";

export type PriceTier = {
  label: string; // "1 jour", "3 jours et +", "7 jours et +"
  perDay: number; // MAD per day at this tier
  minDays: number;
};

export type Bike = {
  slug: string;
  name: string;
  category: BikeCategory;
  engineCc: number;
  year: number;
  transmission: "automatique" | "manuelle";
  pricePerDay: number; // in MAD (1-day anchor rate)
  priceTiers: PriceTier[]; // degressive rates — longer = cheaper per day
  deposit: number; // in MAD
  depositTerms: string; // how it is held & returned — transparency converts
  licence: string; // exact licence requirement (agency policy)
  minAge: number;
  availabilityNote: string; // honest, owner-edited before each rebuild (SSG)
  helmetIncluded: boolean;
  kmPolicy: string;
  fuelPolicy: string;
  cancellation: string;
  documents: string[]; // what to bring at pickup
  shortDescription: string;
  description: string;
  included: string[];
  images: string[]; // paths under /public — empty renders the line-art fallback
  featured: boolean;
};

export type PropertyType = "apartment" | "villa";

export type Property = {
  slug: string;
  name: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  amenities: string[];
  pool: boolean;
  pricePerNight: number; // in MAD
  deposit: number; // in MAD
  minNights: number;
  checkIn: string;
  checkOut: string;
  shortDescription: string;
  description: string;
  images: string[];
  featured: boolean;
};

export type FaqGroup = "Motos" | "Séjours" | "Paiement & caution";

export type FaqEntry = {
  group: FaqGroup;
  question: string;
  answer: string;
};
