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
    question: "Livrez-vous à l'hôtel, au riad ou à l'aéroport de Marrakech-Ménara ?",
    answer:
      "Oui. Nous livrons et récupérons le X-ADV partout à Marrakech — Guéliz, Hivernage, médina, Palmeraie — et à l'aéroport de Marrakech-Ménara. Indiquez votre adresse (ou votre vol) au moment de la réservation pour caler la zone et l'horaire.",
  },

  {
    group: "Motos",
    question: "Mon permis étranger est-il valable au Maroc ?",
    answer:
      "Oui : un permis national en alphabet latin (français, belge, suisse, espagnol…) est accepté au Maroc pour un séjour touristique. Le permis international n'est pas obligatoire mais reste recommandé pour les longs séjours. Le X-ADV 750 demande un permis moto A2 ou A — en cas de doute, envoyez-nous une photo de votre permis sur WhatsApp et on vous confirme tout de suite.",
  },
  {
    group: "Motos",
    question: "Peut-on sortir de Marrakech — Atlas, Agafay, Essaouira ?",
    answer:
      "Oui, c'est même ce qu'on recommande : la vallée de l'Ourika, le désert d'Agafay ou la route d'Essaouira se prêtent parfaitement au X-ADV. Le kilométrage est illimité ; consultez nos guides d'itinéraires pour préparer la virée. Le passage de frontière n'est en revanche pas autorisé.",
  },
  {
    group: "Motos",
    question: "Est-ce difficile de conduire à Marrakech ?",
    answer:
      "La circulation est dense mais prévisible une fois qu'on en comprend le rythme. À la remise des clés, on vous briefe sur les usages locaux, les axes à privilégier et les parkings deux-roues gardés. L'ABS, le contrôle de couple du X-ADV et un casque bien ajusté font le reste — la plupart de nos clients sont surpris de la facilité.",
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
    question: "Y a-t-il des tarifs dégressifs pour plusieurs jours ?",
    answer:
      "Oui, et ils sont affichés clairement : le prix par jour du X-ADV baisse dès 3 jours, puis encore dès 7 jours. Pour une longue durée (au mois) ou un pack moto + logement, contactez-nous sur WhatsApp — on construit un tarif sur mesure.",
  },
  {
    group: "Paiement & caution",
    question: "Peut-on payer en euros ou par carte ?",
    answer:
      "Les espèces (MAD ou EUR au taux du jour) et le virement sont acceptés. Pour un paiement par carte, demandez-nous sur WhatsApp au moment de la réservation. Aucune donnée bancaire ne transite par le site.",
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
/** Curated: the four biggest booking objections — documents, delivery,
 *  deposit, cancellation — rather than simply the first four entries. */
const teaserQuestions = [
  "Quels documents faut-il pour louer le X-ADV 750 ?",
  "Livrez-vous à l'hôtel, au riad ou à l'aéroport de Marrakech-Ménara ?",
  "Comment fonctionne la caution et son remboursement ?",
  "Quelle est votre politique d'annulation ?",
];

export function faqTeaser(n = 4): FaqEntry[] {
  const picked = teaserQuestions
    .map((q) => faq.find((f) => f.question === q))
    .filter((f): f is FaqEntry => Boolean(f));
  return picked.slice(0, n);
}
