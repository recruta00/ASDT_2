import type { Bike } from "./types";

/**
 * La flotte moto — un seul modèle, assumé : le Honda X-ADV 750 (2026).
 * L'agence ne loue que cette machine ; pour ajouter un modèle plus tard,
 * ajoutez simplement un objet au tableau (tout le site s'adapte).
 * // TODO: confirm pricePerDay / deposit (see TODO.md).
 */
export const bikes: Bike[] = [
  {
    slug: "honda-x-adv-750",
    name: "Honda X-ADV 750",
    category: "moto",
    engineCc: 745,
    year: 2026,
    transmission: "automatique",
    pricePerDay: 800, // TODO: confirm
    priceTiers: [
      { label: "1 jour", perDay: 800, minDays: 1 }, // TODO: confirm
      { label: "3 jours et +", perDay: 750, minDays: 3 }, // TODO: confirm
      { label: "7 jours et +", perDay: 700, minDays: 7 }, // TODO: confirm
    ],
    deposit: 8000, // TODO: confirm
    depositTerms:
      "Bloquée à la remise (espèces ou empreinte CB), restituée intégralement le jour du retour.",
    licence: "Permis moto A2 ou A en cours de validité", // TODO: confirm agency policy
    minAge: 21, // TODO: confirm
    availabilityNote: "Vérifiez vos dates sur WhatsApp — réponse rapide.", // owner-edited before rebuild
    helmetIncluded: true,
    kmPolicy: "200 km/jour inclus, puis 2 MAD/km",
    fuelPolicy: "Remise avec le plein, à rendre avec le plein",
    cancellation: "Annulation gratuite jusqu'à 48 h avant la location",
    documents: ["Passeport ou pièce d'identité", "Permis moto (A2/A)"],
    shortDescription:
      "Le crossover qui fait tout : bicylindre 745 cm³, boîte DCT automatique, allure d'aventurière. La ville en semaine, l'Atlas le week-end.",
    description:
      "Le X-ADV 750 est unique en son genre : la facilité d'un scooter, le caractère d'un trail. Son bicylindre de 745 cm³ et sa boîte DCT automatique à double embrayage avalent le Guéliz comme les pistes de l'Ourika, sans jamais toucher un levier d'embrayage. Position haute, protection généreuse, ABS et contrôle de traction : la machine parfaite pour découvrir Marrakech et s'échapper au-delà.",
    included: [
      "Casque homologué (2e casque offert)",
      "ABS + contrôle de traction",
      "Coffre sous la selle",
      "Assistance téléphonique 7j/7",
      "Plein d'essence au départ",
    ],
    images: ["/images/bikes/honda-x-adv-750-studio.webp"],
    featured: true,
  },
];

export function getBike(slug: string): Bike | undefined {
  return bikes.find((b) => b.slug === slug);
}

export function featuredBikes(): Bike[] {
  return bikes.filter((b) => b.featured).slice(0, 3);
}

/** The flagship — the whole moto side of the business. */
export function flagshipBike(): Bike {
  return bikes[0];
}

/** Up to 3 other bikes for the "related" strip on a detail page. */
export function relatedBikes(slug: string): Bike[] {
  return bikes.filter((b) => b.slug !== slug).slice(0, 3);
}
