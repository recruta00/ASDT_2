import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Reassurance } from "@/components/detail/Reassurance";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbList } from "@/lib/jsonld";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { flagshipBike } from "@/data/bikes";
import { whatsappUrl, bookingMessage } from "@/lib/whatsapp";
import { mad, approxEur } from "@/lib/price";

/** Shared shell for /guides articles: header, prose column, closing CTA. */
export function GuideShell({
  title,
  lead,
  crumbLabel,
  eyebrow,
  children,
  extraJsonLd,
}: {
  title: string;
  lead: string;
  crumbLabel: string;
  eyebrow: string;
  children: ReactNode;
  extraJsonLd?: object;
}) {
  const bike = flagshipBike();
  const crumbs = [
    { label: "Accueil", href: routes.home },
    { label: "Guides", href: routes.guides },
    { label: crumbLabel },
  ];

  return (
    <main id="main">
      <JsonLd
        data={extraJsonLd ? [breadcrumbList(crumbs), extraJsonLd] : [breadcrumbList(crumbs)]}
      />
      <PageHeader breadcrumb={crumbs} eyebrow={eyebrow} title={title} lead={lead} />
      <Container className="max-w-3xl pb-10 pt-14">
        <article className="space-y-10">{children}</article>
      </Container>

      {/* Closing conversion block — every guide ends at the machine */}
      <Container className="max-w-3xl pb-24">
        <div className="card-glass p-7 md:p-9">
          <p className="font-spec text-ink/70">Prêt à rouler ?</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-ink">
            Le {bike.name} se loue à {mad(bike.pricePerDay)}{" "}
            {approxEur(bike.pricePerDay)}/jour
          </h2>
          <p className="mt-2 text-ink/70">
            Casque offert, caution transparente, livraison à votre hôtel ou à
            l&apos;aéroport de {site.city}-Ménara.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonAnchor
              href={whatsappUrl(bookingMessage(bike.name))}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Je vérifie la disponibilité
            </ButtonAnchor>
            <ButtonLink href={routes.bike(bike.slug)} variant="secondary" size="lg">
              Découvrir la machine
            </ButtonLink>
          </div>
          <Reassurance />
        </div>
      </Container>
    </main>
  );
}

/** Prose section with a Seam-underlined h2. */
export function GuideSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-bold text-ink">
        {title}
      </h2>
      <span aria-hidden className="seam-rule mt-3" />
      <div className="mt-5 space-y-4 text-ink/80">{children}</div>
    </section>
  );
}

/** Mono fact box (km / durée / difficulté) for itinerary guides. */
export function FactBox({ facts }: { facts: Array<[string, string]> }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[16px] border border-ink/10 bg-ink/10 sm:grid-cols-3">
      {facts.map(([label, value]) => (
        <div key={label} className="bg-white px-5 py-4">
          <p className="font-spec text-ink/70">{label}</p>
          <p className="mt-1 font-medium text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}
