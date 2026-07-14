import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell, GuideSection } from "@/components/guides/GuideShell";
import { faqPage } from "@/lib/jsonld";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Quel permis pour louer une moto à Marrakech ? (2026)" },
  description:
    "50 cm³, scooter 125, maxi-scooter, X-ADV 750 : quel permis faut-il pour conduire à Marrakech en tant que visiteur ? Permis étrangers, documents, notre politique.",
  alternates: { canonical: routes.guidePermis },
};

// The exact questions tourists search before renting — FAQPage schema included.
const permitFaq = [
  {
    question: "Mon permis européen est-il valable au Maroc ?",
    answer:
      "Oui pour un séjour touristique : les permis de l'UE, du Royaume-Uni, de Suisse et du Canada sont reconnus au Maroc pour la catégorie correspondante. Un permis international n'est pas exigé pour la location courte durée, mais il ne fait jamais de mal de l'avoir.",
  },
  {
    question: "Puis-je conduire le X-ADV 750 avec un permis voiture (B) ?",
    answer:
      "Non. Malgré sa boîte automatique DCT, le X-ADV 750 (745 cm³) est une moto : il exige un permis moto A2 ou A en cours de validité. C'est la loi — et notre politique, sans exception, pour votre sécurité et la validité de l'assurance.",
  },
  {
    question: "Quels documents sont vérifiés à la remise ?",
    answer:
      "Deux documents : votre passeport ou pièce d'identité, et votre permis moto (A2/A). Nous les vérifions en 2 minutes à la remise, avec le contrat et l'état des lieux de la moto.",
  },
  {
    question: "Quel âge minimum pour louer chez Recruta Rent ?",
    answer:
      "21 ans, avec un permis moto valide. C'est la condition de notre assurance pour un 745 cm³.",
  },
];

export default function PermisGuidePage() {
  return (
    <GuideShell
      title="Quel permis pour louer une moto à Marrakech ?"
      lead="La question qu'on nous pose le plus. Voici les règles pour les visiteurs, catégorie par catégorie — et notre politique d'agence, noir sur blanc."
      crumbLabel="Permis moto au Maroc"
      eyebrow="Guide pratique — 2026"
      extraJsonLd={faqPage(permitFaq)}
    >
      <GuideSection id="regles" title="Les règles, catégorie par catégorie">
        <p>
          Au Maroc, la catégorie de permis suit la cylindrée — comme en Europe.
          Pour un visiteur, cela se résume ainsi :
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Moins de 50 cm³</strong> — accessible
            dès 16 ans avec la catégorie AM (ou équivalent). Certaines agences
            louent sans permis moto ; vérifiez toujours l&apos;assurance.
          </li>
          <li>
            <strong className="text-ink">125 cm³</strong> — permis A1 ou A. Un
            permis B seul ne suffit pas officiellement pour un visiteur, même si
            la tolérance varie d&apos;une agence à l&apos;autre.
          </li>
          <li>
            <strong className="text-ink">Au-delà de 125 cm³</strong> (TMAX,
            X-ADV, trails) — permis A2 ou A obligatoire, sans ambiguïté. La
            boîte automatique ne change rien : la cylindrée fait la catégorie.
          </li>
        </ul>
        <p className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm">
          Ces règles générales peuvent évoluer — en cas de doute, demandez-nous
          sur WhatsApp avant de réserver : nous vous répondons avec votre cas
          précis. {/* TODO: owner/legal review of this section before launch */}
        </p>
      </GuideSection>

      <GuideSection id="notre-politique" title="Notre politique pour le X-ADV 750">
        <p>
          Chez {site.name}, le{" "}
          <Link href={routes.bike("honda-x-adv-750")} className="font-medium text-ink underline underline-offset-4">
            Honda X-ADV 750
          </Link>{" "}
          se loue avec un <strong className="text-ink">permis A2 ou A en cours de
          validité</strong> et un âge minimum de <strong className="text-ink">21 ans</strong>.
          Pas d&apos;exception : c&apos;est la condition de validité de
          l&apos;assurance qui vous couvre, vous et votre passager.
        </p>
        <p>
          Bonne nouvelle pour les habitués du scooter : la boîte DCT automatique
          du X-ADV signifie zéro embrayage, zéro sélecteur au pied si vous
          restez en mode D. Si vous savez tenir un maxi-scooter, la prise en
          main se fait en dix minutes.
        </p>
      </GuideSection>

      <GuideSection id="controles" title="Contrôles routiers : à quoi s'attendre">
        <p>
          Les contrôles de gendarmerie sont fréquents aux entrées et sorties de
          ville et sur les axes touristiques (Ourika, route d&apos;Essaouira).
          Ayez toujours sur vous : permis, pièce d&apos;identité, et le contrat
          de location que nous vous remettons (il tient dans le coffre sous la
          selle). Casque obligatoire pour le pilote et le passager — les deux
          sont fournis avec la location.
        </p>
      </GuideSection>

      <GuideSection id="faq" title="Questions fréquentes">
        <dl className="space-y-5">
          {permitFaq.map((f) => (
            <div key={f.question}>
              <dt className="font-medium text-ink">{f.question}</dt>
              <dd className="mt-1.5">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </GuideSection>
    </GuideShell>
  );
}
