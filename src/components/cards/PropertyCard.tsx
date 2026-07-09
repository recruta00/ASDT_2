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
    <article className="card-glass group flex flex-col overflow-hidden">
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
          <h3 className="font-display text-xl font-bold text-bone">
            {property.name}
          </h3>
          <SpecList items={propertyCardSpecs(property)} className="mt-2" />
          <p className="mt-3 flex-1 text-sm text-mist">
            {property.shortDescription}
          </p>
          <div className="mt-5 flex items-end justify-between">
            <p className="font-spec text-bone">
              <PriceCounter
                value={property.pricePerNight}
                className="text-ember"
              />
              <span className="text-ember"> {site.currency}</span>
              <span className="text-mist"> / nuit</span>
            </p>
            <span className="font-spec text-ember transition-transform group-hover:translate-x-1">
              Voir →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
