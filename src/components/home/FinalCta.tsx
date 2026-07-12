import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { routes } from "@/config/routes";

/**
 * Final CTA band — the dark cinematic anchor before the footer, Seam-split in
 * miniature (spec §7.1.8). Photographic halves over abyss.
 */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="py-20 md:py-28">
      <Container>
        <h2 id="final-cta-title" className="sr-only">
          Réservez votre moto ou votre séjour
        </h2>
        <div className="relative grid overflow-hidden rounded-[28px] border border-ink/10 bg-abyss shadow-[0_24px_60px_-24px_rgba(20,27,46,0.4)] md:grid-cols-2">
          {/* The miniature Seam between the two worlds. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-px bg-gradient-to-b from-transparent via-ember to-transparent md:block"
            style={{ transform: "translateX(-50%) rotate(-12deg) scale(1.15)" }}
          />
          {/* RIDE */}
          <div className="relative flex flex-col items-start gap-5 overflow-hidden p-10 md:p-14">
            <Image
              src="/images/bikes/honda-x-adv-750-studio.webp"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/70 to-abyss/40" />
            <div className="relative">
              <Eyebrow onDark>Roulez libre</Eyebrow>
              <p className="font-display mt-3 text-3xl font-bold text-bone">
                Prêt à rouler ?
              </p>
              <ButtonLink href={routes.bikes} size="lg" className="mt-5">
                Découvrir le X-ADV
              </ButtonLink>
            </div>
          </div>
          {/* STAY */}
          <div className="relative flex flex-col items-start gap-5 overflow-hidden border-t border-bone/10 p-10 md:border-l md:border-t-0 md:p-14">
            <Image
              src="/images/stays/hero-villa-dusk.webp"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-abyss via-abyss/70 to-abyss/40" />
            <div className="relative">
              <Eyebrow onDark>Vivez grand</Eyebrow>
              <p className="font-display mt-3 text-3xl font-bold text-bone">
                Prêt à poser vos valises ?
              </p>
              <ButtonLink href={routes.stays} size="lg" className="mt-5">
                Voir les séjours
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
