import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { BikeCard } from "@/components/cards/BikeCard";
import { featuredBikes } from "@/data/bikes";
import { routes } from "@/config/routes";

/** Featured fleet — 3 bike cards (spec §7.1.3). */
export function FeaturedFleet() {
  const bikes = featuredBikes();
  return (
    <section aria-labelledby="fleet-title" className="py-20 md:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={`Notre flotte — location moto Marrakech`}
            title="Motos & scooters prêts à rouler"
            titleId="fleet-title"
            lead="Des véhicules révisés, assurés et livrés avec casque. Choisissez, on s'occupe du reste."
          />
          <ButtonLink href={routes.bikes} variant="secondary" className="shrink-0">
            Toutes les motos
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike, i) => (
            <MotionReveal key={bike.slug} delay={i * 0.08}>
              <BikeCard bike={bike} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
