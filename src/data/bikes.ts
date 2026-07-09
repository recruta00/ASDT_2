import type { Bike } from "./types";

/**
 * Motorcycle & scooter fleet. Seed data — the human confirms prices and adds
 * photos into /public/images/bikes/. All prices in MAD.
 * // TODO: confirm all pricePerDay / deposit values (see TODO.md).
 */
export const bikes: Bike[] = [
  {
    slug: "honda-pcx-125",
    name: "Honda PCX 125",
    category: "scooter",
    engineCc: 125,
    year: 2024,
    transmission: "automatique",
    pricePerDay: 200, // TODO: confirm
    deposit: 2000, // TODO: confirm
    helmetIncluded: true,
    kmPolicy: "Kilométrage illimité",
    shortDescription:
      "Le scooter urbain par excellence : souple, économe, parfait pour filer dans Marrakech.",
    description:
      "Confortable et léger, le PCX 125 se faufile partout et démarre au quart de tour. Selle basse, coffre sous la selle pour un casque, consommation minime : idéal pour découvrir la ville et la palmeraie sans se compliquer la vie.",
    included: [
      "Casque homologué",
      "Antivol U",
      "Assistance téléphonique 7j/7",
      "Plein d'essence au départ",
    ],
    images: [],
    featured: true,
  },
  {
    slug: "yamaha-nmax-155",
    name: "Yamaha NMAX 155",
    category: "scooter",
    engineCc: 155,
    year: 2024,
    transmission: "automatique",
    pricePerDay: 260, // TODO: confirm
    deposit: 2500, // TODO: confirm
    helmetIncluded: true,
    kmPolicy: "Kilométrage illimité",
    shortDescription:
      "Un peu plus de nerf pour enchaîner ville et sorties vers l'Atlas.",
    description:
      "Le NMAX 155 ajoute du couple pour les montées et les trajets un peu plus longs, tout en gardant la facilité d'un automatique. Freinage ABS, tableau de bord clair, position détendue : un compagnon rassurant pour les nouveaux comme les habitués.",
    included: [
      "Casque homologué",
      "ABS",
      "Antivol U",
      "Assistance téléphonique 7j/7",
    ],
    images: [],
    featured: true,
  },
  {
    slug: "honda-cb500x",
    name: "Honda CB500X",
    category: "moto",
    engineCc: 471,
    year: 2023,
    transmission: "manuelle",
    pricePerDay: 450, // TODO: confirm
    deposit: 4000, // TODO: confirm
    helmetIncluded: true,
    kmPolicy: "200 km/jour inclus, puis 2 MAD/km",
    shortDescription:
      "Trail routier polyvalent pour s'échapper vers l'Ourika ou Essaouira.",
    description:
      "La CB500X est faite pour avaler les routes : assez de puissance pour les longues lignes droites, une position haute et confortable, et un poids maîtrisé. Permis A2 compatible. La moto idéale pour une évasion d'une journée hors de la ville.",
    included: [
      "Casque homologué",
      "ABS",
      "Top-case",
      "Assistance téléphonique 7j/7",
    ],
    images: [],
    featured: true,
  },
  {
    slug: "royal-enfield-classic-350",
    name: "Royal Enfield Classic 350",
    category: "moto",
    engineCc: 349,
    year: 2023,
    transmission: "manuelle",
    pricePerDay: 380, // TODO: confirm
    deposit: 3500, // TODO: confirm
    helmetIncluded: true,
    kmPolicy: "200 km/jour inclus, puis 2 MAD/km",
    shortDescription:
      "Le charme rétro et le son inimitable d'un single, pour rouler avec style.",
    description:
      "Une moto au caractère affirmé, souple à bas régime et facile à prendre en main. La Classic 350 transforme chaque trajet en balade : cadre en acier, selle généreuse et look intemporel. Parfaite pour les photos et pour le plaisir de conduire tranquillement.",
    included: [
      "Casque homologué",
      "Antivol U",
      "Assistance téléphonique 7j/7",
      "Plein d'essence au départ",
    ],
    images: [],
    featured: false,
  },
  {
    slug: "vespa-primavera-125",
    name: "Vespa Primavera 125",
    category: "scooter",
    engineCc: 125,
    year: 2024,
    transmission: "automatique",
    pricePerDay: 280, // TODO: confirm
    deposit: 3000, // TODO: confirm
    helmetIncluded: true,
    kmPolicy: "Kilométrage illimité",
    shortDescription:
      "L'icône italienne : élégante, maniable, taillée pour les ruelles.",
    description:
      "Impossible de faire plus chic pour se déplacer. La Vespa Primavera allie ligne intemporelle et conduite douce, avec un gabarit parfait pour se garer partout. Un plaisir simple, entre le Guéliz et la médina.",
    included: [
      "Casque homologué",
      "Antivol U",
      "Assistance téléphonique 7j/7",
      "Plein d'essence au départ",
    ],
    images: [],
    featured: false,
  },
  {
    slug: "yamaha-tmax-560",
    name: "Yamaha T-Max 560",
    category: "scooter",
    engineCc: 562,
    year: 2023,
    transmission: "automatique",
    pricePerDay: 550, // TODO: confirm
    deposit: 5000, // TODO: confirm
    helmetIncluded: true,
    kmPolicy: "Kilométrage illimité",
    shortDescription:
      "Le maxi-scooter sportif : le confort d'un automatique, les sensations d'une moto.",
    description:
      "Le T-Max 560 combine puissance et facilité : accélérations franches, tenue de route rassurante et confort deux places. Pour ceux qui veulent la performance sans embrayage, sur route ouverte comme en ville.",
    included: [
      "Casque homologué",
      "ABS",
      "Top-case",
      "Assistance téléphonique 7j/7",
    ],
    images: [],
    featured: false,
  },
];

export function getBike(slug: string): Bike | undefined {
  return bikes.find((b) => b.slug === slug);
}

export function featuredBikes(): Bike[] {
  return bikes.filter((b) => b.featured).slice(0, 3);
}

/** Up to 3 other bikes for the "related" strip on a detail page. */
export function relatedBikes(slug: string): Bike[] {
  return bikes.filter((b) => b.slug !== slug).slice(0, 3);
}
