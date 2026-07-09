import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bikes, getBike, relatedBikes } from "@/data/bikes";
import { bikeCardSpecs, bikeSpecTable } from "@/lib/specs";
import { bikeConditions } from "@/data/conditions";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SpecList } from "@/components/ui/SpecList";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Gallery } from "@/components/detail/Gallery";
import { SpecTable } from "@/components/detail/SpecTable";
import { BookingCta } from "@/components/detail/BookingCta";
import { Checklist } from "@/components/detail/Checklist";
import { BikeCard } from "@/components/cards/BikeCard";

export function generateStaticParams() {
  return bikes.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bike = getBike(slug);
  if (!bike) return {};
  return {
    title: `Location ${bike.name} à ${site.city}`,
    description: `Louez la ${bike.name} (${bike.engineCc} cc, ${bike.year}) à ${site.city} dès ${bike.pricePerDay} ${site.currency}/jour. Casque inclus, réservation sur WhatsApp.`,
    alternates: { canonical: routes.bike(bike.slug) },
  };
}

export default async function BikeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = getBike(slug);
  if (!bike) notFound();

  const related = relatedBikes(slug);

  return (
    <main id="main" className="texture-noise relative overflow-hidden pt-28 md:pt-32">
      <Container>
        <Breadcrumb
          items={[
            { label: "Accueil", href: routes.home },
            { label: "Motos", href: routes.bikes },
            { label: bike.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <Gallery
            images={bike.images}
            alt={`${bike.name} — location moto ${site.city}`}
            kind="bike"
          />

          <div>
            <Eyebrow>Location moto {site.city}</Eyebrow>
            <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-bone">
              {bike.name}
            </h1>
            <SpecList items={bikeCardSpecs(bike)} className="mt-3" />
            <p className="mt-5 text-mist">{bike.description}</p>

            <div className="mt-8">
              <BookingCta
                name={bike.name}
                price={bike.pricePerDay}
                unit="jour"
                deposit={bike.deposit}
              />
            </div>

            <div className="mt-6">
              <SpecTable rows={bikeSpecTable(bike)} />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Checklist title="Ce qui est inclus" items={bike.included} />
          <div>
            <h2 className="font-display text-xl font-bold text-bone">Conditions</h2>
            <Accordion items={bikeConditions} className="mt-4" />
            <ButtonLink href={routes.conditions} variant="secondary" className="mt-6">
              Voir les conditions complètes
            </ButtonLink>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <Container className="mt-20 mb-24">
          <h2 className="font-display text-2xl font-bold text-bone">
            D&apos;autres motos à découvrir
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((b) => (
              <BikeCard
                key={b.slug}
                bike={b}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ))}
          </div>
        </Container>
      ) : null}
    </main>
  );
}
