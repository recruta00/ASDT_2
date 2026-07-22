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
import { Gallery } from "@/components/detail/Gallery";
import { SpecTable } from "@/components/detail/SpecTable";
import { BookingCta } from "@/components/detail/BookingCta";
import { CrossSell } from "@/components/detail/CrossSell";
import { Checklist } from "@/components/detail/Checklist";
import { BikeCard } from "@/components/cards/BikeCard";
import { PriceTiers } from "@/components/detail/PriceTiers";
import { RentalConditions } from "@/components/detail/RentalConditions";
import { DecisionFaq } from "@/components/detail/DecisionFaq";
import { JsonLd } from "@/components/JsonLd";
import { bikeProduct, breadcrumbList } from "@/lib/jsonld";
import { mad, approxEur } from "@/lib/price";

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
    title: { absolute: `Location ${bike.name} à ${site.city} — ${bike.pricePerDay} MAD/jour` },
    description: `Louez le ${bike.name} (${bike.engineCc} cc, ${bike.year}) à ${site.city} dès ${bike.pricePerDay} ${site.currency}/jour. Casque inclus, réservation sur WhatsApp.`,
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
  const crumbs = [
    { label: "Accueil", href: routes.home },
    { label: "Motos", href: routes.bikes },
    { label: bike.name },
  ];

  return (
    <main id="main" className="relative pt-28 md:pt-32">
      <JsonLd data={[bikeProduct(bike), breadcrumbList(crumbs)]} />
      <Container>
        <Breadcrumb items={crumbs} />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <Gallery
            images={bike.images}
            alt={`${bike.name} — location moto ${site.city}`}
            kind="bike"
          />

          <div>
            <Eyebrow>Location moto {site.city}</Eyebrow>
            <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-ink">
              {bike.name}
            </h1>
            <SpecList items={bikeCardSpecs(bike)} className="mt-3" />
            <p className="mt-5 text-ink/70">{bike.description}</p>

            <p className="mt-4 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink/80">
              <span className="font-medium text-ink">Une seule X-ADV en flotte</span>{" "}
              — {bike.availabilityNote}
            </p>

            <div className="mt-5">
              <PriceTiers bike={bike} />
            </div>

            <div className="mt-6">
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
          <RentalConditions bike={bike} />
        </div>

        {/* Indexable "why this bike" content — the winnable long-tail:
            exact model + price vs international platforms + DCT + delivery. */}
        <section aria-labelledby="pourquoi-xadv" className="mt-20">
          <h2
            id="pourquoi-xadv"
            className="font-display text-2xl font-bold text-ink"
          >
            Pourquoi louer le {bike.name} chez Recruta Rent
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="card-glass p-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Le juste prix, sans surprise
              </h3>
              <p className="mt-2 text-ink/70">
                Les plateformes internationales affichent le même Honda X-ADV 750
                autour de 95&nbsp;€/jour. Ici, il est à{" "}
                <strong className="text-ink">
                  {mad(bike.pricePerDay)} ({approxEur(bike.pricePerDay)}) par jour
                </strong>
                , casque offert et caution annoncée à l&apos;avance — le meilleur
                rapport plaisir/prix de sa catégorie à {site.city}.
              </p>
            </div>
            <div className="card-glass p-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Boîte DCT automatique
              </h3>
              <p className="mt-2 text-ink/70">
                Aucun embrayage, aucun passage de vitesse : si vous savez tenir un
                scooter, vous savez conduire le X-ADV. Le confort d&apos;un
                maxi-scooter avec le caractère d&apos;un trail — parfait pour la
                ville comme pour les virages de l&apos;Atlas.
              </p>
            </div>
            <div className="card-glass p-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Livré où vous êtes
              </h3>
              <p className="mt-2 text-ink/70">
                Livraison et récupération partout à {site.city} — Guéliz,
                Hivernage, médina, Palmeraie — et à l&apos;aéroport de {site.city}
                -Ménara. Indiquez votre adresse ou votre vol au moment de la
                réservation sur WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16">
          <DecisionFaq
            items={bikeConditions.map((c) => ({ question: c.question, answer: c.answer }))}
            itemName={bike.name}
          />
          <p className="mt-4">
            <ButtonLink href={routes.conditions} variant="secondary">
              Voir les conditions complètes
            </ButtonLink>
          </p>
        </div>
      </Container>

      <CrossSell on="ride" />

      {related.length > 0 ? (
        <Container className="mt-20 mb-24">
          <h2 className="font-display text-2xl font-bold text-ink">
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
