import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink, ButtonAnchor } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { HeroVideo } from "./HeroVideo";
import { SpecList } from "@/components/ui/SpecList";
import { PriceCounter } from "@/components/ui/PriceCounter";
import { flagshipBike } from "@/data/bikes";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { whatsappUrl, bookingMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/cx";
import { approxEur } from "@/lib/price";

/**
 * "La Machine" — the moto side of the business is one flagship, presented
 * like one: a full spotlight instead of a card grid (spec §7.1.3, adapted
 * to the single-model fleet).
 */
export function MachineSpotlight() {
  const bike = flagshipBike();

  return (
    <section aria-labelledby="machine-title" className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow={`La machine — location moto ${site.city}`}
          title="Honda X-ADV 750"
          titleId="machine-title"
          lead={bike.shortDescription}
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <MotionReveal className="rr-zoom-parent relative overflow-hidden rounded-[24px] border border-ink/10">
            <Image
              src={bike.images[0]}
              alt={`${bike.name} — location moto ${site.city}`}
              width={1920}
              height={1434}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="rr-zoom h-auto w-full object-cover"
            />
            {site.heroVideoSrc ? (
              <HeroVideo
                src={site.heroVideoSrc}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <span aria-hidden className="seam-rule absolute bottom-6 left-6" />
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <SpecList
              items={["745 CC", "DCT automatique", "2026", "Casque inclus"]}
            />
            <p className="mt-5 text-ink/70">{bike.description}</p>

            <div className="mt-8 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-ink">
                <PriceCounter value={bike.pricePerDay} />
              </span>
              <span className="font-display text-2xl font-bold text-ink">
                {site.currency}
              </span>
              <span className="font-spec text-ink/70">
                {approxEur(bike.pricePerDay)} / jour
              </span>
            </div>
            <p className="mt-1 font-spec text-ink/70">
              Caution {formatPrice(bike.deposit, site.currency)}{" "}
              {approxEur(bike.deposit)} — restituée au retour · {bike.kmPolicy}
            </p>
            <p className="mt-3 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink/80">
              <span className="font-medium text-ink">Une seule X-ADV en flotte</span>{" "}
              — {bike.availabilityNote}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonAnchor
                href={whatsappUrl(bookingMessage(bike.name))}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Je vérifie la disponibilité
              </ButtonAnchor>
              <ButtonLink href={routes.bike(bike.slug)} variant="secondary" size="lg">
                Fiche complète
              </ButtonLink>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
