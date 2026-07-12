import Link from "next/link";
import type { Property } from "@/data/types";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { propertyCardSpecs } from "@/lib/specs";
import { Media } from "@/components/ui/Media";
import { SpecList } from "@/components/ui/SpecList";
import { PriceCounter } from "@/components/ui/PriceCounter";

export function PropertyCard({
  property,
  priority = false,
  sizes,
}: {
  property: Property;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <article className="card-glass group rr-zoom-parent flex flex-col overflow-hidden">
      <Link
        href={routes.stay(property.slug)}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        <Media
          kind="stay"
          src={property.images[0]}
          alt={`${property.name} — location ${property.type === "villa" ? "villa" : "appartement"} ${site.city}`}
          priority={priority}
          sizes={sizes}
          aspect="aspect-[4/3]"
        />
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-bold text-ink">
            {property.name}
          </h3>
          <SpecList items={propertyCardSpecs(property)} className="mt-2" />
          <p className="mt-3 flex-1 text-sm text-ink/70">
            {property.shortDescription}
          </p>
          <div className="mt-5 flex items-end justify-between">
            <p className="font-spec text-ink">
              <PriceCounter
                value={property.pricePerNight}
                className="text-ink"
              />
              <span className="text-ink"> {site.currency}</span>
              <span className="text-ink/70"> / nuit</span>
            </p>
            <span className="font-spec text-ink transition-transform group-hover:translate-x-1">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
