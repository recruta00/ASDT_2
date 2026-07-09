import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LightSection } from "@/components/layout/LightSection";
import { Container } from "@/components/ui/Container";
import { BikeCatalog } from "@/components/catalog/BikeCatalog";
import { bikes } from "@/data/bikes";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `Location moto & scooter à ${site.city}`,
  description: `Louez une moto ou un scooter à ${site.city} : scooters 125, maxi-scooters et trails, révisés et livrés avec casque. Réservation rapide sur WhatsApp.`,
  alternates: { canonical: routes.bikes },
};

export default function MotosPage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[
          { label: "Accueil", href: routes.home },
          { label: "Motos" },
        ]}
        eyebrow={`Location moto ${site.city}`}
        title="Motos & scooters à louer"
        lead="Du scooter 125 facile à vivre au maxi-scooter sportif : une flotte récente, révisée et livrée avec casque partout à Marrakech."
      />
      <LightSection className="pb-24">
        <Container className="pt-14">
          <BikeCatalog bikes={bikes} />
        </Container>
      </LightSection>
    </main>
  );
}
