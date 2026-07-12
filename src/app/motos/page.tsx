import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SpecList } from "@/components/ui/SpecList";
import { SpecTable } from "@/components/detail/SpecTable";
import { Checklist } from "@/components/detail/Checklist";
import { flagshipBike } from "@/data/bikes";
import { bikeSpecTable } from "@/lib/specs";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { whatsappUrl, bookingMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/cx";

export const metadata: Metadata = {
  title: `Location Honda X-ADV 750 à ${site.city}`,
  description: `Louez le Honda X-ADV 750 (2026) à ${site.city} : maxi-scooter 745 cm³, boîte DCT automatique, casque inclus, livraison en ville. Réservation sur WhatsApp.`,
  alternates: { canonical: routes.bikes },
};

const rideIdeas = [
  {
    title: "La ville, sans effort",
    body: "Boîte DCT automatique, position dominante, rangement sous la selle : le Guéliz et l'Hivernage se traversent comme un jeu.",
  },
  {
    title: "L'Ourika au lever du jour",
    body: "45 minutes de virages jusqu'aux premiers contreforts de l'Atlas. Le couple du 745 cm³ fait le reste.",
  },
  {
    title: "Essaouira en journée",
    body: "180 km de ligne droite face à l'océan. Protection au vent généreuse, réservoir taillé pour l'aller-retour.",
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
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
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
            <p className="mt-5 text-ink/70">{bike.description}</p>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-ink">
                {formatPrice(bike.pricePerDay, site.currency)}
              </span>
              <span className="font-spec text-ink/70">/ jour</span>
            </div>
            <p className="mt-1 font-spec text-ink/70">
              Caution {formatPrice(bike.deposit, site.currency)}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonAnchor
                href={whatsappUrl(bookingMessage(bike.name))}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Réserver sur WhatsApp
              </ButtonAnchor>
              <ButtonLink
                href={routes.bike(bike.slug)}
                variant="secondary"
                size="lg"
              >
                Fiche technique complète
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Spec + included */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <MotionReveal>
            <h2 className="font-display text-xl font-bold text-ink">
              Caractéristiques
            </h2>
            <div className="mt-5">
              <SpecTable rows={bikeSpecTable(bike)} />
            </div>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <Checklist title="Ce qui est inclus" items={bike.included} />
          </MotionReveal>
        </div>

        {/* Ride ideas — gives the page life beyond the single product */}
        <section aria-labelledby="rides-title" className="mt-20">
          <h2 id="rides-title" className="font-display text-2xl font-bold text-ink">
            Trois idées de virées
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {rideIdeas.map((idea, i) => (
              <MotionReveal key={idea.title} delay={i * 0.06}>
                <div className="card-glass h-full p-7">
                  <span className="font-spec font-medium text-ink/70">0{i + 1}</span>
                  <h3 className="font-display mt-3 text-lg font-bold text-ink">
                    {idea.title}
                  </h3>
                  <p className="mt-2 text-ink/70">{idea.body}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
