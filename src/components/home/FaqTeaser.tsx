import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { faqTeaser } from "@/data/faq";
import { routes } from "@/config/routes";

/** FAQ teaser — top 4 questions, link to full FAQ (spec §7.1.7). */
export function FaqTeaser() {
  const items = faqTeaser(4).map(({ question, answer }) => ({ question, answer }));
  return (
    <section
      aria-labelledby="faq-teaser-title"
      className="border-t border-ink/10 py-20 md:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeader
            eyebrow="Questions fréquentes"
            title="Tout ce qu'il faut savoir"
            titleId="faq-teaser-title"
            lead="Documents, caution, livraison, annulation — les réponses les plus demandées."
          />
          <ButtonLink href={routes.faq} variant="secondary" className="mt-8">
            Voir toutes les questions
          </ButtonLink>
        </div>
        <Accordion items={items} />
      </Container>
    </section>
  );
}
