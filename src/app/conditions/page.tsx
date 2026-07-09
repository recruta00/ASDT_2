import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LightSection } from "@/components/layout/LightSection";
import { Container } from "@/components/ui/Container";
import { conditionsSummary } from "@/data/conditions";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Conditions de location",
  description: `Les conditions de location de Recruta Rent à ${site.city} : caution, carburant, retard de retour, dommages. Résumé clair, avant signature du contrat.`,
  alternates: { canonical: routes.conditions },
};

export default function ConditionsPage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[
          { label: "Accueil", href: routes.home },
          { label: "Conditions de location" },
        ]}
        eyebrow="Infos légales"
        title="Conditions de location"
        lead="Un résumé clair des règles principales. Les conditions complètes figurent dans le contrat de location signé au départ."
      />
      <LightSection className="pb-24">
        <Container className="max-w-3xl pt-14">
          <div className="grid gap-6 sm:grid-cols-2">
            {conditionsSummary.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-[color:var(--line)] bg-ink p-6"
              >
                <h2 className="font-display text-lg font-bold text-bone">{c.title}</h2>
                <p className="mt-2 text-mist">{c.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-bone">
              Contrats de location
            </h2>
            <p className="mt-3 text-mist">
              Chaque location est encadrée par un contrat signé au moment de la remise,
              qui détaille l&apos;ensemble des conditions, l&apos;assurance et les
              responsabilités de chacun :
            </p>
            <ul className="mt-4 space-y-2 text-bone/90">
              <li>· Contrat de location moto &amp; scooter</li>
              <li>· Contrat de location appartement &amp; villa</li>
            </ul>
            {/*
              TODO (human): attach the signed rental-agreement PDFs and expose them here.
              Drop the files in /public/contrats/ and uncomment:

              <div className="mt-4 flex flex-wrap gap-3">
                <a href="/contrats/contrat-location-moto.pdf" className="underline">
                  Télécharger le contrat moto (PDF)
                </a>
                <a href="/contrats/contrat-location-villa.pdf" className="underline">
                  Télécharger le contrat appartement & villa (PDF)
                </a>
              </div>
            */}
            <p className="mt-4 text-mist">
              Une question sur les conditions ? Écrivez-nous, nous vous expliquons tout
              avant de réserver.
            </p>
          </div>
        </Container>
      </LightSection>
    </main>
  );
}
