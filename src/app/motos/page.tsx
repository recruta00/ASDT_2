import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SpecList } from "@/components/ui/SpecList";
import { SpecTable } from "@/components/detail/SpecTable";
import { Checklist } from "@/components/detail/Checklist";
import { PriceTiers } from "@/components/detail/PriceTiers";
import { RentalConditions } from "@/components/detail/RentalConditions";
import { DecisionFaq } from "@/components/detail/DecisionFaq";
import { Reassurance } from "@/components/detail/Reassurance";
import { flagshipBike } from "@/data/bikes";
import { bikeSpecTable } from "@/lib/specs";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { whatsappUrl, bookingMessage } from "@/lib/whatsapp";
import { mad, approxEur } from "@/lib/price";

export const metadata: Metadata = {
  title: { absolute: `Location Moto Marrakech | Honda X-ADV 750 dès 800 MAD/j` },
  description: `Louez le Honda X-ADV 750 (2026) à ${site.city} : 800 MAD ≈ 75 €/jour, casque offert, caution claire, livraison hôtel & aéroport. Réservation sur WhatsApp.`,
  alternates: { canonical: routes.bikes },
};

const rideIdeas = [
  {
    title: "La ville, sans effort",
    body: "Boîte DCT automatique, position dominante, rangement sous la selle : le Guéliz et l'Hivernage se traversent comme un jeu.",
    href: null,
  },
  {
    title: "L'Ourika au lever du jour",
    body: "45 minutes de virages jusqu'aux premiers contreforts de l'Atlas. Le couple du 745 cm³ fait le reste.",
    href: "/guides/itineraire-moto-atlas-ourika",
  },
  {
    title: "Essaouira en journée",
    body: "180 km de ligne droite face à l'océan. Protection au vent généreuse, réservoir taillé pour l'aller-retour.",
    href: "/guides/marrakech-essaouira-a-moto",
  },
];

const decisionFaq = [
  {
    question: "Quel permis faut-il pour louer le X-ADV 750 ?",
    answer:
      "Un permis moto A2 ou A en cours de validité (la boîte DCT est automatique, mais un 745 cm³ reste une moto). Passeport ou pièce d'identité demandé à la remise. Notre guide permis détaille tous les cas, y compris les permis étrangers.",
  },
  {
    question: "Comment fonctionne la caution ?",
    answer:
      "8 000 MAD (≈ 740 €), bloquée à la remise en espèces ou par empreinte CB, et restituée intégralement le jour du retour si la moto revient en bon état. Montant, forme et moment : tout est annoncé avant votre réservation.",
  },
  {
    question: "Et en cas de panne ou de pépin ?",
    answer:
      "Assistance téléphonique 7j/7 : on vous dépanne ou on vous remplace la moto. Un retard ? Prévenez-nous sur WhatsApp, on trouve une solution.",
  },
  {
    question: "Puis-je annuler ?",
    answer:
      "Oui — annulation gratuite jusqu'à 48 h avant la location. Au-delà, on privilégie toujours le report quand c'est possible.",
  },
];

export default function MotosPage() {
  const bike = flagshipBike();

  return (
    <main id="main">
      <PageHeader
        breadcrumb={[
          { label: "Accueil", href: routes.home },
          { label: "Moto" },
        ]}
        eyebrow={`Location moto ${site.city}`}
        title="Une seule machine. La bonne."
        lead="Pas de flotte anonyme : nous louons le Honda X-ADV 750 (2026), le crossover qui réunit le confort d'un scooter et le caractère d'un trail. Révisé, assuré, livré avec casque."
      />

      <Container className="pb-24 pt-14">
        {/* The machine */}
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <MotionReveal className="rr-zoom-parent relative overflow-hidden rounded-[24px] border border-ink/10">
            <Image
              src={bike.images[0]}
              alt={`${bike.name} — location moto ${site.city}`}
              width={1920}
              height={1434}
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="rr-zoom h-auto w-full object-cover"
            />
            <span aria-hidden className="seam-rule absolute bottom-6 left-6" />
          </MotionReveal>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {bike.name} <span className="text-ink/70">{bike.year}</span>
            </h2>
            <SpecList
              items={["745 CC", "DCT automatique", "Casque inclus"]}
              className="mt-3"
            />
            <p className="mt-4 text-ink/70">{bike.shortDescription}</p>

            {/* Honest single-unit scarcity + availability */}
            <p className="mt-4 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/80">
              <span className="font-medium text-ink">
                Une seule X-ADV 750 dans la flotte
              </span>{" "}
              — premier arrivé, premier servi. {bike.availabilityNote}
            </p>

            {/* Degressive tiers — daily rate anchors, weekly looks smart */}
            <div className="mt-5">
              <PriceTiers bike={bike} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonAnchor
                href={whatsappUrl(bookingMessage(bike.name))}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Je vérifie la disponibilité
              </ButtonAnchor>
              <ButtonLink
                href={routes.bike(bike.slug)}
                variant="secondary"
                size="lg"
              >
                Fiche technique complète
              </ButtonLink>
            </div>
            <p className="mt-3 font-spec text-ink/70">
              {site.whatsappResponse} · 7j/7 · sans engagement
            </p>
            <Reassurance />
          </div>
        </div>

        {/* Conditions claires — the clarity no competitor offers */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <MotionReveal>
            <RentalConditions bike={bike} />
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <Checklist title="Ce qui est inclus" items={bike.included} />
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink">
                Caractéristiques
              </h2>
              <div className="mt-4">
                <SpecTable rows={bikeSpecTable(bike)} />
              </div>
            </div>
          </MotionReveal>
        </div>

        {/* Indexable price-context block — "louer moto marrakech prix" */}
        <section aria-labelledby="prix-marche" className="mt-20">
          <h2 id="prix-marche" className="font-display text-2xl font-bold text-ink">
            Prix d&apos;une location moto à Marrakech
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <p className="mt-6 max-w-3xl text-ink/70">
            À Marrakech, un scooter 125 se loue entre 250 et 400 MAD par jour, un
            maxi-scooter type TMAX entre 500 et 1 000 MAD, et les gros trails
            dépassent souvent 1 200 MAD. Le X-ADV 750 — la polyvalence d&apos;un
            trail avec la facilité d&apos;un scooter — est proposé ici à{" "}
            <strong className="text-ink">
              {mad(bike.pricePerDay)} ({approxEur(bike.pricePerDay)}) par jour
            </strong>
            , casque offert et caution annoncée à l&apos;avance : le meilleur
            rapport plaisir/prix de sa catégorie en ville, moins cher que les
            plateformes internationales pour la même machine.
          </p>
        </section>

        {/* Indexable delivery block — a differentiator competitors market */}
        <section aria-labelledby="livraison" className="mt-14">
          <h2 id="livraison" className="font-display text-2xl font-bold text-ink">
            Livraison à votre hôtel, riad ou à l&apos;aéroport de
            Marrakech-Ménara
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <p className="mt-6 max-w-3xl text-ink/70">
            Nous livrons et récupérons le X-ADV partout à Marrakech — Guéliz,
            Hivernage, médina, Palmeraie — et à l&apos;aéroport de Ménara.
            Indiquez votre adresse et l&apos;heure souhaitée lors de la
            réservation WhatsApp : vous recevez la moto avec le plein, le casque
            et le contrat, prête à rouler en 10 minutes.
          </p>
        </section>

        {/* Ride ideas → itinerary guides (SEO cross-links) */}
        <section aria-labelledby="rides-title" className="mt-20">
          <h2 id="rides-title" className="font-display text-2xl font-bold text-ink">
            Trois idées de virées
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {rideIdeas.map((idea, i) => (
              <MotionReveal key={idea.title} delay={i * 0.06}>
                <div className="card-glass flex h-full flex-col p-7">
                  <span className="font-spec font-medium text-ink/70">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-3 text-lg font-bold text-ink">
                    {idea.title}
                  </h3>
                  <p className="mt-2 flex-1 text-ink/70">{idea.body}</p>
                  {idea.href ? (
                    <Link
                      href={idea.href}
                      className="mt-4 font-spec text-ink underline-offset-4 hover:underline"
                    >
                      Voir l&apos;itinéraire →
                    </Link>
                  ) : null}
                </div>
              </MotionReveal>
            ))}
          </div>
        </section>

        {/* Objection-killers at the decision point */}
        <div className="mt-20">
          <DecisionFaq items={decisionFaq} itemName={bike.name} />
        </div>
      </Container>
    </main>
  );
}
