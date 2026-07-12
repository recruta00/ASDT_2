import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { featuredProperties } from "@/data/properties";
import { routes } from "@/config/routes";

/** Featured stays — 3 property cards (spec §7.1.4). */
export function FeaturedStays() {
  const stays = featuredProperties();
  return (
    <section aria-labelledby="stays-title" className="py-20 md:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Nos adresses — location villa Marrakech"
            title="Appartements & villas d'exception"
            titleId="stays-title"
            lead="Six adresses seulement, choisies une à une — du studio élégant au Guéliz à la villa avec piscine dans la Palmeraie."
          />
          <ButtonLink href={routes.stays} variant="secondary" className="shrink-0">
            Tous les séjours
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stays.map((stay, i) => (
            <MotionReveal key={stay.slug} delay={i * 0.08}>
              <PropertyCard
                property={stay}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
