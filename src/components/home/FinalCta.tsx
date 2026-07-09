import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BikeGlyph, VillaGlyph } from "@/components/art/Glyphs";
import { routes } from "@/config/routes";

/** Final CTA band — Seam-split again in miniature (spec §7.1.8). */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="py-20 md:py-28">
      <Container>
        <h2 id="final-cta-title" className="sr-only">
          Réservez votre moto ou votre séjour
        </h2>
        <div className="glow-ember texture-noise relative grid overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-ink md:grid-cols-2">
          {/* The miniature Seam between the two worlds. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ember to-transparent md:block"
            style={{ transform: "translateX(-50%) rotate(-12deg) scale(1.15)" }}
          />
          {/* RIDE */}
          <div className="relative flex flex-col items-start gap-5 p-10 md:p-14">
            <BikeGlyph aria-hidden className="absolute right-6 top-6 h-16 w-24 text-bone/10" />
            <Eyebrow>Roulez libre</Eyebrow>
            <p className="font-display text-3xl font-bold text-bone">
              Prêt à rouler ?
            </p>
            <ButtonLink href={routes.bikes} size="lg">
              Voir les motos
            </ButtonLink>
          </div>
          {/* STAY */}
          <div className="relative flex flex-col items-start gap-5 border-t border-[color:var(--line)] p-10 md:border-l md:border-t-0 md:p-14">
            <VillaGlyph aria-hidden className="absolute right-6 top-6 h-16 w-24 text-bone/10" />
            <Eyebrow>Vivez grand</Eyebrow>
            <p className="font-display text-3xl font-bold text-bone">
              Prêt à poser vos valises ?
            </p>
            <ButtonLink href={routes.stays} size="lg">
              Voir les séjours
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
