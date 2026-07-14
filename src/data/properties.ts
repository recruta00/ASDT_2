import type { Property } from "./types";

/**
 * Apartments & villas. Seed data — the human confirms prices and adds photos
 * into /public/images/stays/. Names adapted to Marrakech. All prices in MAD.
 * // TODO: confirm all pricePerNight / deposit values (see TODO.md).
 */
export const properties: Property[] = [
  {
    slug: "studio-gueliz-moderne",
    name: "Studio Guéliz Moderne",
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    areaM2: 38,
    amenities: ["Wi-Fi fibre", "Climatisation", "Cuisine équipée", "Ascenseur"],
    pool: false,
    pricePerNight: 480, // TODO: confirm
    deposit: 2000, // TODO: confirm
    minNights: 2,
    checkIn: "15h00",
    checkOut: "11h00",
    shortDescription:
      "Un studio lumineux au cœur du Guéliz, à deux pas des cafés et des boutiques.",
    description:
      "Idéal pour un séjour court ou un télétravail au calme : lit confortable, coin cuisine complet et connexion fibre. Le quartier du Guéliz met restaurants, salles de sport et supermarchés à portée de pied.",
    images: ["/images/stays/studio-gueliz-moderne.webp"],
    featured: true,
  },
  {
    slug: "appartement-hivernage-2ch",
    name: "Appartement Hivernage 2 Ch",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 95,
    amenities: [
      "Wi-Fi fibre",
      "Climatisation",
      "Balcon",
      "Parking privé",
      "Cuisine équipée",
    ],
    pool: true,
    pricePerNight: 850, // TODO: confirm
    deposit: 3000, // TODO: confirm
    minNights: 3,
    checkIn: "15h00",
    checkOut: "11h00",
    shortDescription:
      "Deux chambres spacieuses dans une résidence avec piscine, quartier Hivernage.",
    description:
      "Parfait pour une famille ou deux couples : deux vraies chambres, deux salles de bains, un salon ouvert sur un balcon ensoleillé. La résidence dispose d'une piscine partagée et d'un parking sécurisé, à quelques minutes des palais et des jardins.",
    images: ["/images/stays/appartement-hivernage-2ch.webp"],
    featured: true,
  },
  {
    slug: "duplex-rooftop-medina",
    name: "Duplex Rooftop Médina",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 110,
    amenities: [
      "Terrasse sur le toit",
      "Wi-Fi fibre",
      "Climatisation",
      "Vue médina",
      "Cuisine équipée",
    ],
    pool: false,
    pricePerNight: 1150, // TODO: confirm
    deposit: 3500, // TODO: confirm
    minNights: 2,
    checkIn: "15h00",
    checkOut: "11h00",
    shortDescription:
      "Un duplex avec terrasse panoramique sur les toits de la médina.",
    description:
      "Le charme de la vieille ville avec le confort moderne. Deux niveaux, une terrasse privée avec vue sur les minarets et l'Atlas au loin, parfaite pour le coucher de soleil. À quelques ruelles de la place Jemaa el-Fna.",
    images: ["/images/stays/duplex-rooftop-medina.webp"],
    featured: true,
  },
  {
    slug: "villa-palmeraie-piscine",
    name: "Villa Palmeraie Piscine",
    type: "villa",
    bedrooms: 3,
    bathrooms: 3,
    areaM2: 240,
    amenities: [
      "Piscine privée",
      "Jardin",
      "Wi-Fi fibre",
      "Climatisation",
      "Parking privé",
      "Barbecue",
    ],
    pool: true,
    pricePerNight: 3200, // TODO: confirm
    deposit: 6000, // TODO: confirm
    minNights: 3,
    checkIn: "16h00",
    checkOut: "11h00",
    shortDescription:
      "Une villa au calme dans la Palmeraie, avec piscine privée et grand jardin.",
    description:
      "L'évasion à quinze minutes de la ville : trois chambres en suite, un vaste séjour ouvert sur la terrasse, et une piscine entourée de palmiers. Idéale pour une famille ou un groupe d'amis qui cherchent l'intimité et le soleil.",
    images: ["/images/stays/villa-palmeraie-piscine.webp"],
    featured: true,
  },
  {
    slug: "villa-familiale-4ch",
    name: "Villa Familiale 4 Ch",
    type: "villa",
    bedrooms: 4,
    bathrooms: 4,
    areaM2: 320,
    amenities: [
      "Piscine privée",
      "Grand jardin",
      "Wi-Fi fibre",
      "Climatisation",
      "Parking privé",
      "Cuisine d'été",
    ],
    pool: true,
    pricePerNight: 4200, // TODO: confirm
    deposit: 8000, // TODO: confirm
    minNights: 4,
    checkIn: "16h00",
    checkOut: "11h00",
    shortDescription:
      "Quatre chambres, grand jardin et piscine : la villa des grandes tablées.",
    description:
      "Pensée pour les familles nombreuses et les longs séjours : quatre chambres confortables, plusieurs espaces de vie, une cuisine d'été et un jardin où les enfants ont de la place. La piscine privée est le centre de gravité des journées d'été.",
    images: ["/images/stays/villa-familiale-4ch.webp"],
    featured: false,
  },
  {
    slug: "riad-medina-authentique",
    name: "Riad Médina Authentique",
    type: "villa",
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      "Patio central",
      "Bassin de fraîcheur (plunge pool)",
      "Terrasse",
      "Wi-Fi fibre",
      "Climatisation",
    ],
    areaM2: 180,
    pool: true,
    pricePerNight: 1800, // TODO: confirm
    deposit: 4000, // TODO: confirm
    minNights: 2,
    checkIn: "15h00",
    checkOut: "11h00",
    shortDescription:
      "Un riad traditionnel restauré, patio, zellige et fraîcheur au cœur de la médina.",
    description:
      "L'expérience marrakchie authentique : un patio central avec son bassin, des chambres tout autour, du zellige, du bois sculpté et une terrasse sur le toit. Le calme absolu derrière une porte discrète, à quelques pas de l'animation des souks.",
    images: ["/images/stays/riad-medina-authentique.webp"],
    featured: false,
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function featuredProperties(): Property[] {
  return properties.filter((p) => p.featured).slice(0, 3);
}

/** Up to 3 other properties for the "related" strip on a detail page. */
export function relatedProperties(slug: string): Property[] {
  return properties.filter((p) => p.slug !== slug).slice(0, 3);
}
