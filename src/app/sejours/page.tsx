import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LightSection } from "@/components/layout/LightSection";
import { Container } from "@/components/ui/Container";
import { PropertyCatalog } from "@/components/catalog/PropertyCatalog";
import { properties } from "@/data/properties";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `Location Villa avec Piscine à ${site.city} | ${site.name}` },
  description: `Appartements et villas à louer à ${site.city} : du studio au Guéliz à la villa avec piscine dans la Palmeraie. Adresses choisies, réservation sur WhatsApp.`,
  alternates: { canonical: routes.stays },
};

export default function SejoursPage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[
          { label: "Accueil", href: routes.home },
          { label: "Séjours" },
        ]}
        eyebrow={`Location villa ${site.city}`}
        title="Appartements & villas à louer"
        lead="Six adresses seulement, choisies une à une — du studio élégant au Guéliz à la villa avec piscine dans la Palmeraie. Chaque maison est visitée, équipée et suivie par nous."
      />
      <LightSection className="pb-24">
        <Container className="pt-14">
          <PropertyCatalog properties={properties} />
        </Container>
      </LightSection>
    </main>
  );
}
