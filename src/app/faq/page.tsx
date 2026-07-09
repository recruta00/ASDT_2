import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { faqGroups, faqByGroup } from "@/data/faq";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: `Documents, caution, carburant, casques, livraison, annulation : toutes les réponses pour louer une moto ou un séjour à ${site.city} chez Recruta Rent.`,
  alternates: { canonical: routes.faq },
};

export default function FaqPage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[{ label: "Accueil", href: routes.home }, { label: "FAQ" }]}
        eyebrow="Questions fréquentes"
        title="Vos questions, nos réponses"
        lead="Tout ce qu'il faut savoir avant de réserver. Une question sans réponse ici ? Écrivez-nous sur WhatsApp."
      />
      <Container className="max-w-3xl pb-24 pt-14">
        <div className="space-y-12">
          {faqGroups.map((group) => (
            <section key={group} aria-labelledby={`faq-${group}`}>
              <h2
                id={`faq-${group}`}
                className="font-display text-xl font-bold text-bone"
              >
                {group}
              </h2>
              <span aria-hidden className="seam-rule mt-3" />
              <Accordion items={faqByGroup(group)} className="mt-5" />
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
