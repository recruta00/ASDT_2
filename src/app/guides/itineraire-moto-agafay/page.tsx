import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell, GuideSection, FactBox } from "@/components/guides/GuideShell";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "Le désert d'Agafay à moto : la demi-journée parfaite" },
  description:
    "À 45 minutes de Marrakech, le désert de pierre d'Agafay : itinéraire moto, coucher de soleil, dîner sous tente. Km, timing, conseils — guide par des locaux.",
  alternates: { canonical: routes.guideAgafay },
};

export default function AgafayGuidePage() {
  return (
    <GuideShell
      title="Le désert d'Agafay à moto"
      lead="Pas besoin de traverser l'Atlas pour toucher le désert : Agafay, son plateau de pierre lunaire et ses camps sous tente sont à 45 minutes de votre hôtel."
      crumbLabel="Désert d'Agafay"
      eyebrow="Itinéraire — demi-journée"
    >
      <FactBox
        facts={[
          ["Distance", "≈ 80 km aller-retour"],
          ["Durée", "Demi-journée (idéal 15h → 21h)"],
          ["Difficulté", "Facile — goudron, derniers km en piste dure"],
        ]}
      />

      <GuideSection id="route" title="La route">
        <p>
          Sortez de Marrakech par la route d&apos;Amizmiz (R203), puis bifurquez
          sur la R212 direction le lac Lalla Takerkoust. La circulation tombe
          vite, le paysage se dénude, et d&apos;un coup c&apos;est le plateau
          d&apos;Agafay : des collines de pierre beige à perte de vue, l&apos;Atlas
          enneigé en toile de fond.
        </p>
        <p>
          Les derniers kilomètres vers les camps se font sur piste dure et bien
          damée — rien de technique. Le X-ADV y est parfaitement à l&apos;aise :
          garde au sol généreuse, mode G du DCT pour la motricité, et roues à
          rayons qui encaissent sans broncher. Restez sur les pistes principales
          et tout roule, au sens propre.
        </p>
      </GuideSection>

      <GuideSection id="pauses" title="Les pauses qui valent le coup">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Le lac Lalla Takerkoust</strong> — un
            détour de 15 minutes pour un café au bord de l&apos;eau, barrage et
            montagnes en fond. Idéal à l&apos;aller.
          </li>
          <li>
            <strong className="text-ink">Le point de vue du plateau</strong> —
            juste après le village d&apos;Agafay, arrêtez-vous au premier
            belvédère : la photo moto + désert + Atlas se fait là.
          </li>
          <li>
            <strong className="text-ink">Un camp au coucher du soleil</strong> —
            thé à la menthe ou dîner sous tente pendant que la pierre passe du
            beige au rose. Réservez le dîner à l&apos;avance en haute saison.
          </li>
        </ul>
      </GuideSection>

      <GuideSection id="conseils" title="Conseils de locaux">
        <p>
          Le créneau magique : partir vers 15h, arriver au plateau pour la
          lumière dorée, dîner au camp et rentrer de nuit — la route est courte
          et bien revêtue, mais roulez prudemment, l&apos;éclairage public
          s&apos;arrête vite après Marrakech. Emportez une couche en plus :
          le désert perd 10 °C dès que le soleil passe derrière l&apos;Atlas.
          Et faites le plein avant de partir — pas de station fiable après
          Lalla Takerkoust.
        </p>
        <p>
          Envie de faire durer ? Combinez Agafay au coucher du soleil avec une
          nuit au calme dans l&apos;une de nos{" "}
          <Link href={routes.stays} className="font-medium text-ink underline underline-offset-4">
            villas avec piscine
          </Link>{" "}
          côté Route de l&apos;Ourika ou Palmeraie — retour tardif sans stress.
        </p>
      </GuideSection>
    </GuideShell>
  );
}
