import type { AccordionItem } from "@/components/ui/Accordion";

/**
 * Rental-conditions summaries — reused by detail-page accordions and the
 * /conditions page. The full terms live in the signed rental agreements.
 */

export const bikeConditions: AccordionItem[] = [
  {
    question: "Permis & âge minimum",
    answer:
      "Permis adapté à la cylindrée (A1 pour un 125, A2/A au-delà) et âge minimum de 21 ans. Une pièce d'identité valide est demandée à la remise.",
  },
  {
    question: "Caution",
    answer:
      "Une caution est bloquée au départ (montant indiqué ci-dessus) et restituée intégralement au retour du véhicule en bon état.",
  },
  {
    question: "Carburant",
    answer:
      "Le véhicule part avec le plein et se rend avec le plein. Le carburant manquant est facturé au prix de la station.",
  },
  {
    question: "Retard & dommages",
    answer:
      "Prévenez-nous en cas de retard sur WhatsApp. Les dommages éventuels sont évalués selon le contrat de location signé au départ.",
  },
];

export const stayConditions: AccordionItem[] = [
  {
    question: "Caution",
    answer:
      "Une caution est demandée à l'arrivée (montant indiqué ci-dessus) et restituée en fin de séjour si le logement est rendu en bon état.",
  },
  {
    question: "Arrivée & départ",
    answer:
      "Arrivée et départ aux horaires indiqués. Nous assouplissons quand c'est possible — demandez-nous selon les réservations qui encadrent la vôtre.",
  },
  {
    question: "Ménage & règles du logement",
    answer:
      "Le ménage de fin de séjour est inclus. Merci de respecter le voisinage et les règles propres au logement (fêtes, fumée, animaux) précisées à la réservation.",
  },
  {
    question: "Annulation",
    answer:
      "Annulation gratuite jusqu'à 48h avant le début du séjour. Au-delà, nous privilégions le report quand c'est possible.",
  },
];

/** Key points summarised on the /conditions page. */
export const conditionsSummary = [
  {
    title: "Caution",
    body: "Un montant clair est annoncé sur chaque fiche, bloqué au départ et restitué intégralement au retour si tout est en ordre.",
  },
  {
    title: "Carburant (motos)",
    body: "Le véhicule part et se rend avec le plein ; le carburant manquant est facturé au prix de la station.",
  },
  {
    title: "Retard de retour",
    body: "Prévenez-nous sur WhatsApp. Un retard non signalé peut entraîner la facturation d'une journée supplémentaire.",
  },
  {
    title: "Dommages",
    body: "Tout dommage est constaté à la restitution et traité selon le contrat de location signé au départ.",
  },
];
