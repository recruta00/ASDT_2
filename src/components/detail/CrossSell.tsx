import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import { flagshipBike } from "@/data/bikes";
import { properties } from "@/data/properties";
import { dualPrice } from "@/lib/price";

/**
 * Ride ⇄ Stay cross-sell band ("Pack Liberté") — the two-worlds offer no
 * mono-activity competitor can match. `on` is the world of the CURRENT page;
 * the band sells the other one. Photographic dark band, echoing FinalCta.
 */
export function CrossSell({ on }: { on: "ride" | "stay" }) {
  const flagship = flagshipBike();
  const stayFrom = Math.min(...properties.map((p) => p.pricePerNight));

  const content =
    on === "ride"
      ? {
          eyebrow: "Pack Liberté — moto + séjour",
          title: "Posez vos valises là où vous garez la moto",
          body: `Studios, riads et villas avec piscine dès ${dualPrice(stayFrom)}/nuit. Réservez les deux en un seul message WhatsApp — on s'occupe de tout.`,
          cta: "Découvrir les séjours",
          href: routes.stays,
          image: "/images/stays/hero-villa-dusk.webp",
        }
      : {
          eyebrow: "Pack Liberté — séjour + moto",
          title: "Ajoutez le Honda X-ADV 750 à votre séjour",
          body: `Le maxi-scooter aventure, livré directement à votre porte dès ${dualPrice(flagship.pricePerDay)}/jour. Un seul message WhatsApp pour tout organiser.`,
          cta: "Découvrir le X-ADV 750",
          href: routes.bike(flagship.slug),
          image: "/images/bikes/honda-x-adv-750-studio.webp",
        };

  return (
    <Container className="mt-16">
      <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-abyss p-8 shadow-[0_24px_60px_-24px_rgba(20,27,46,0.4)] md:p-12">
        <Image
          src={content.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/75 to-abyss/30" />
        <div className="relative max-w-2xl">
          <Eyebrow onDark>{content.eyebrow}</Eyebrow>
          <p className="font-display mt-3 text-2xl font-bold text-bone md:text-3xl">
            {content.title}
          </p>
          <p className="mt-3 text-bone/80">{content.body}</p>
          <ButtonLink href={content.href} size="lg" className="mt-6">
            {content.cta} <span aria-hidden>→</span>
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
