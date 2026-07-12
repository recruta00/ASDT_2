import type { FaqEntry, FaqGroup } from "./types";

/**
 * Frequently asked questions — real, specific answers grouped by theme (spec §7.6).
 * The human should adjust any figure marked below to match their actual policy.
 */
export const faq: FaqEntry[] = [
  // --- Motos ---
  {
    group: "Motos",
    question: "Quels documents faut-il pour louer le X-ADV 750 ?",
    answer:
      "Une pièce d'identité ou un passeport en cours de validité et un permis moto A2 ou A. La boîte DCT est automatique — aucun embrayage à gérer — mais le permis moto reste obligatoire pour un 745 cm³. Nous vérifions simplement le permis avant la remise des clés.",
  },
  {
    group: "Motos",
    question: "Le casque est-il fourni ?",
    answer:
      "Oui, un casque homologué est inclus avec chaque location, ainsi qu'un antivol. Un deuxième casque pour votre passager est offert, sans supplément.",
  },
  {
    group: "Motos",
    question: "Comment fonctionne le carburant ?",
    answer:
      "Le véhicule vous est remis avec le plein. Il vous suffit de le rendre avec le plein également ; sinon, nous facturons le carburant manquant au prix de la station, sans frais additionnels.",
  },
  {
    group: "Motos",
    question: "Que se passe-t-il en cas de panne ou de retard ?",
    answer:
      "Une assistance téléphonique est joignable 7j/7 : en cas de souci mécanique, nous vous dépannons ou remplaçons le véhicule. Si vous prévoyez un retard sur l'heure de retour, prévenez-nous sur WhatsApp — nous trouvons presque toujours une solution.",
  },
  {
    group: "Motos",
    question: "Livrez-vous la moto à mon hôtel ou riad ?",
    answer:
      "Oui, nous livrons et récupérons le X-ADV à Marrakech (Guéliz, Hivernage, médina et environs). Indiquez-nous votre adresse au moment de la réservation pour confirmer la zone et l'horaire.",
  },

  // --- Séjours ---
  {
    group: "Séjours",
    question: "À quelle heure puis-je arriver et repartir ?",
    answer:
      "L'arrivée se fait à partir de 15h (16h pour les villas) et le départ jusqu'à 11h. Nous faisons de notre mieux pour assouplir ces horaires selon les réservations qui précèdent et suivent la vôtre — demandez-nous.",
  },
  {
    group: "Séjours",
    question: "Le ménage et le linge sont-ils inclus ?",
    answer:
      "Oui, le logement est nettoyé avant votre arrivée et le linge de maison (draps, serviettes) est fourni. Pour les longs séjours, un ménage intermédiaire peut être organisé sur demande.",
  },
  {
    group: "Séjours",
    question: "Les animaux sont-ils acceptés ?",
    answer:
      "Cela dépend du logement : certains acceptent les animaux de compagnie, d'autres non. Précisez-le nous avant de réserver et nous vous confirmerons ce qui est possible.",
  },
  {
    group: "Séjours",
    question: "Combien de nuits minimum faut-il réserver ?",
    answer:
      "Le minimum varie de 2 à 4 nuits selon le logement — il est indiqué sur chaque fiche. Pour des durées plus longues, contactez-nous : des tarifs dégressifs sont possibles.",
  },

  // --- Paiement & caution ---
  {
    group: "Paiement & caution",
    question: "Comment régler ma location ?",
    answer:
      "La réservation se confirme sur WhatsApp. Le règlement se fait ensuite à la remise des clés ou du véhicule, en espèces ou par virement. Il n'y a pas de paiement en ligne pour le moment — aucune donnée bancaire ne transite par le site.",
  },
  {
    group: "Paiement & caution",
    question: "Comment fonctionne la caution et son remboursement ?",
    answer:
      "Une caution est demandée au début de la location ; son montant est indiqué clairement sur chaque fiche. Elle vous est intégralement restituée au retour du véhicule ou en fin de séjour, dès lors que tout est en ordre.",
  },
  {
    group: "Paiement & caution",
    question: "Quelle est votre politique d'annulation ?",
    answer:
      "L'annulation est gratuite jusqu'à 48h avant le début de la location ou du séjour. Passé ce délai, contactez-nous : nous privilégions toujours le report plutôt que la pénalité quand c'est possible.",
  },
];

export const faqGroups: FaqGroup[] = ["Motos", "Séjours", "Paiement & caution"];

/** FAQ entries for one theme. */
export function faqByGroup(group: FaqGroup): FaqEntry[] {
  return faq.filter((f) => f.group === group);
}

/** Top N questions for the home-page teaser (spec §7.1.7). */
export function faqTeaser(n = 4): FaqEntry[] {
  return faq.slice(0, n);
}
