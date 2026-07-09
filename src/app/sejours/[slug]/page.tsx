import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { properties, getProperty, relatedProperties } from "@/data/properties";
import { propertyCardSpecs, propertySpecTable } from "@/lib/specs";
import { stayConditions } from "@/data/conditions";
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
import { PropertyCard } from "@/components/cards/PropertyCard";

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  const kind = property.type === "villa" ? "villa" : "appartement";
  return {
    title: `${property.name} — location ${kind} à ${site.city}`,
    description: `${property.shortDescription} Dès ${property.pricePerNight} ${site.currency}/nuit. Réservation sur WhatsApp.`,
    alternates: { canonical: routes.stay(property.slug) },
  };
}

export default async function StayDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const related = relatedProperties(slug);
  const kind = property.type === "villa" ? "villa" : "appartement";

  return (
    <main id="main" className="texture-noise relative overflow-hidden pt-28 md:pt-32">
      <Container>
        <Breadcrumb
          items={[
            { label: "Accueil", href: routes.home },
            { label: "Séjours", href: routes.stays },
            { label: property.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <Gallery
            images={property.images}
            alt={`${property.name} — location ${kind} ${site.city}`}
            kind="stay"
          />

          <div>
            <Eyebrow>Location {kind} {site.city}</Eyebrow>
            <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-bone">
              {property.name}
            </h1>
            <SpecList items={propertyCardSpecs(property)} className="mt-3" />
            <p className="mt-5 text-mist">{property.description}</p>

            <div className="mt-8">
              <BookingCta
                name={property.name}
                price={property.pricePerNight}
                unit="nuit"
                deposit={property.deposit}
              />
            </div>

            <div className="mt-6">
              <SpecTable rows={propertySpecTable(property)} />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Checklist title="Équipements & services" items={property.amenities} />
          <div>
            <h2 className="font-display text-xl font-bold text-bone">Conditions</h2>
            <Accordion items={stayConditions} className="mt-4" />
            <ButtonLink href={routes.conditions} variant="secondary" className="mt-6">
              Voir les conditions complètes
            </ButtonLink>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <Container className="mt-20 mb-24">
          <h2 className="font-display text-2xl font-bold text-bone">
            D&apos;autres adresses à découvrir
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PropertyCard
                key={p.slug}
                property={p}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ))}
          </div>
        </Container>
      ) : null}
    </main>
  );
}
