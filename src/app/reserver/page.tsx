import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { TabSwitcher } from "@/components/ui/TabSwitcher";
import { BookingForm } from "@/components/booking/BookingForm";
import { bikes } from "@/data/bikes";
import { properties } from "@/data/properties";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Réserver une moto ou un séjour",
  description: `Réservez votre moto, scooter, appartement ou villa à ${site.city}. Choisissez, indiquez vos dates, et confirmez sur WhatsApp en quelques secondes.`,
  alternates: { canonical: routes.book },
};

export default function ReserverPage() {
  const bikeOptions = bikes.map((b) => ({ slug: b.slug, name: b.name }));
  const stayOptions = properties.map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <main id="main">
      <PageHeader
        breadcrumb={[{ label: "Accueil", href: routes.home }, { label: "Réserver" }]}
        eyebrow="Réservation en 60 secondes"
        title="Réservez en quelques clics"
        lead="Sélectionnez une moto ou un séjour, indiquez vos dates, et poursuivez la conversation sur WhatsApp. Rapide, humain, sans engagement."
      />
      <Container className="max-w-2xl pb-24 pt-14">
        <TabSwitcher
          tabs={[
            {
              id: "moto",
              label: "Moto",
              content: <BookingForm options={bikeOptions} unitLabel="Choisir une moto" />,
            },
            {
              id: "sejour",
              label: "Séjour",
              content: (
                <BookingForm options={stayOptions} unitLabel="Choisir un séjour" />
              ),
            },
          ]}
        />
      </Container>
    </main>
  );
}
