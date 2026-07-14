import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell, GuideSection, FactBox } from "@/components/guides/GuideShell";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "Itinéraire moto : Atlas & vallée de l'Ourika (1 jour)" },
  description:
    "La boucle moto d'une journée au départ de Marrakech : vallée de l'Ourika, villages berbères, virages de montagne. Km, timing, pauses — guide par des locaux.",
  alternates: { canonical: routes.guideOurika },
};

export default function OurikaGuidePage() {
  return (
    <GuideShell
      title="Atlas & vallée de l'Ourika à moto"
      lead="La sortie d'une journée la plus gratifiante au départ de Marrakech : en une heure vous échangez les avenues du Guéliz contre l'air frais de la montagne."
      crumbLabel="Itinéraire Atlas & Ourika"
      eyebrow="Itinéraire — journée"
    >
      <FactBox
        facts={[
          ["Distance", "≈ 130 km aller-retour"],
          ["Durée", "Journée (départ 8h30, retour 17h)"],
          ["Difficulté", "Facile — route goudronnée, virages"],
        ]}
      />

      <GuideSection id="route" title="La route">
        <p>
          Sortez de Marrakech par la P2017 direction Ourika. Les trente premiers
          kilomètres filent tout droit entre oliveraies et villages ; la
          circulation se calme dès Tnine Ourika. Ensuite, la route épouse
          l&apos;oued et commence à onduler — c&apos;est là que le X-ADV
          s&apos;amuse : le couple du bicylindre relance sans rétrograder, la
          position haute laisse voir par-dessus les murets.
        </p>
        <p>
          Poussez jusqu&apos;à Setti-Fatma, au bout de la vallée (1 500 m
          d&apos;altitude). Comptez 1h45 depuis Marrakech en roulant tranquille.
        </p>
      </GuideSection>

      <GuideSection id="pauses" title="Les pauses qui valent le coup">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Tnine Ourika</strong> — le lundi, son
            souk rural est un concentré de vallée : thé, épices, forgerons.
          </li>
          <li>
            <strong className="text-ink">Les terrasses au bord de l&apos;oued</strong>{" "}
            — entre Aghbalou et Setti-Fatma, déjeunez les pieds au-dessus de
            l&apos;eau (tajine + thé, comptez 80–120 MAD).
          </li>
          <li>
            <strong className="text-ink">Les cascades de Setti-Fatma</strong> —
            30 à 45 minutes de marche depuis le parking moto, gardez les
            chaussures fermées.
          </li>
        </ul>
      </GuideSection>

      <GuideSection id="conseils" title="Conseils de locaux">
        <p>
          Partez tôt : la lumière du matin sur l&apos;Atlas est superbe et vous
          roulez avant les minibus d&apos;excursion. Emportez une couche
          coupe-vent — il fait facilement 8 °C de moins qu&apos;à Marrakech en
          haut de vallée. Le carburant : faites le plein avant de quitter la
          ville, la dernière vraie station est à Tnine Ourika. Et le week-end,
          redescendez avant 16h30 pour éviter le retour groupé vers la ville.
        </p>
        <p>
          Envie de prolonger ? Dormez au calme et repartez à l&apos;aube — nos{" "}
          <Link href={routes.stays} className="font-medium text-ink underline underline-offset-4">
            villas avec piscine
          </Link>{" "}
          côté Route de l&apos;Ourika font une base parfaite.
        </p>
      </GuideSection>
    </GuideShell>
  );
}
