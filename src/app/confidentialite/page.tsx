import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LightSection } from "@/components/layout/LightSection";
import { Container } from "@/components/ui/Container";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment Recruta Rent traite vos données : aucune collecte automatisée sur le site, échanges par WhatsApp ou e-mail uniquement, pas de paiement en ligne.`,
  alternates: { canonical: routes.privacy },
};

const sections = [
  {
    title: "Quelles données nous recevons",
    body: "Ce site ne comporte ni formulaire de compte, ni paiement en ligne. Nous recevons uniquement les informations que vous nous transmettez volontairement lorsque vous nous contactez (WhatsApp, e-mail, téléphone) : votre nom, vos coordonnées et les détails de votre demande de location.",
  },
  {
    title: "Comment nous les utilisons",
    body: "Ces informations servent exclusivement à répondre à votre demande, organiser votre location et assurer le suivi. Nous ne les vendons ni ne les louons à des tiers.",
  },
  {
    title: "Messagerie WhatsApp",
    body: "Lorsque vous nous écrivez sur WhatsApp, l'échange est soumis à la politique de confidentialité de WhatsApp. Nous vous invitons à la consulter pour comprendre comment vos messages y sont traités.",
  },
  {
    title: "Cookies & mesure d'audience",
    body: "Le site n'installe pas de cookies publicitaires. Si un outil de mesure d'audience venait à être ajouté, cette page serait mise à jour et votre consentement recueilli le cas échéant.",
  },
  {
    title: "Conservation & vos droits",
    body: "Nous conservons vos informations le temps nécessaire au traitement de votre location. Vous pouvez demander à tout moment leur consultation, leur rectification ou leur suppression en nous écrivant.",
  },
];

export default function ConfidentialitePage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[
          { label: "Accueil", href: routes.home },
          { label: "Confidentialité" },
        ]}
        eyebrow="Infos légales"
        title="Politique de confidentialité"
        lead="Nous collectons le minimum, et uniquement pour organiser votre location."
      />
      <LightSection className="pb-24">
        <Container className="max-w-3xl pt-14">
          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-xl font-bold text-ink">{s.title}</h2>
                <p className="mt-2 text-ink/70">{s.body}</p>
              </section>
            ))}
            <section>
              <h2 className="font-display text-xl font-bold text-ink">Nous contacter</h2>
              <p className="mt-2 text-ink/70">
                Pour toute question relative à vos données, écrivez-nous à{" "}
                <a href={`mailto:${site.email}`} className="text-ink underline">
                  {site.email}
                </a>{" "}
                ou par WhatsApp au {site.phoneDisplay}.
              </p>
            </section>
          </div>
        </Container>
      </LightSection>
    </main>
  );
}
