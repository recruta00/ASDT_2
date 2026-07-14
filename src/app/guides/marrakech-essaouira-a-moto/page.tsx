import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell, GuideSection, FactBox } from "@/components/guides/GuideShell";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "Marrakech → Essaouira à moto : itinéraire & conseils" },
  description:
    "190 km jusqu'à l'océan : la route Marrakech–Essaouira à moto, les pauses arganiers et chèvres, le vent de la côte, le timing idéal. Guide par des locaux.",
  alternates: { canonical: routes.guideEssaouira },
};

export default function EssaouiraGuidePage() {
  return (
    <GuideShell
      title="Marrakech → Essaouira à moto"
      lead="Troquer la fournaise rouge de Marrakech contre l'air iodé de l'Atlantique en une matinée de route : c'est l'aller-retour mythique du coin."
      crumbLabel="Marrakech → Essaouira"
      eyebrow="Itinéraire — journée ou week-end"
    >
      <FactBox
        facts={[
          ["Distance", "≈ 190 km par la R207 (2h45)"],
          ["Durée", "Journée longue, idéal sur 2 jours"],
          ["Difficulté", "Facile — nationale roulante, vent côtier"],
        ]}
      />

      <GuideSection id="route" title="La route">
        <p>
          Prenez la R207 direction ouest : une nationale large et roulante qui
          traverse plaines d&apos;oliviers puis, passé Chichaoua, le pays des
          arganiers. Le X-ADV y est dans son élément — bulle haute, régulateur
          naturel du DCT, et assez de réserve pour l&apos;aller-retour avec un
          seul plein.
        </p>
        <p>
          À 30 km de la côte, l&apos;air fraîchit d&apos;un coup et le vent se
          lève : c&apos;est Essaouira qui s&apos;annonce. Garez la moto près de
          Bab Doukkala, la médina se visite à pied.
        </p>
      </GuideSection>

      <GuideSection id="pauses" title="Les pauses qui valent le coup">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Les chèvres dans les arganiers</strong>{" "}
            — après Ounagha, le grand classique. Les coopératives
            d&apos;huile d&apos;argan au bord de la route valent un vrai arrêt.
          </li>
          <li>
            <strong className="text-ink">Sidi Mokhtar</strong> — café-station à
            mi-parcours, parfait pour un café noir et dégourdir les jambes.
          </li>
          <li>
            <strong className="text-ink">Le port d&apos;Essaouira</strong> —
            sardines grillées face aux barques bleues, avant de remonter par les
            remparts de la Skala.
          </li>
        </ul>
      </GuideSection>

      <GuideSection id="conseils" title="Conseils de locaux">
        <p>
          Le vent d&apos;Essaouira (l&apos;alizé) souffle fort l&apos;après-midi
          — sur les 30 derniers kilomètres, roulez souple et anticipez les
          rafales latérales aux sorties de virages. Partez à 8h, déjeunez au
          port, repartez à 16h : vous rentrez avant la nuit. En été,
          l&apos;écart de température surprend : 38 °C à Marrakech, 24 °C sur la
          côte — la doublure du blouson n&apos;est pas de trop au retour.
        </p>
        <p>
          Le bon plan : dormir sur place et rentrer le lendemain matin, lumière
          rasante sur la R207 pour vous tout seul. Jetez un œil à nos{" "}
          <Link href={routes.stays} className="font-medium text-ink underline underline-offset-4">
            adresses à Marrakech
          </Link>{" "}
          pour caler la nuit d&apos;avant ou d&apos;après.
        </p>
      </GuideSection>
    </GuideShell>
  );
}
