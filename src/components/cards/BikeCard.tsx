import Link from "next/link";
import type { Bike } from "@/data/types";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { approxEur } from "@/lib/price";
import { bikeCardSpecs } from "@/lib/specs";
import { Media } from "@/components/ui/Media";
import { SpecList } from "@/components/ui/SpecList";
import { PriceCounter } from "@/components/ui/PriceCounter";

export function BikeCard({
  bike,
  priority = false,
  sizes,
}: {
  bike: Bike;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <article className="card-glass group rr-zoom-parent flex flex-col overflow-hidden">
      <Link
        href={routes.bike(bike.slug)}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        <Media
          kind="bike"
          src={bike.images[0]}
          alt={`${bike.name} — location moto ${site.city}`}
          priority={priority}
          sizes={sizes}
          aspect="aspect-[4/3]"
        />
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-bold text-ink">{bike.name}</h3>
          <SpecList items={bikeCardSpecs(bike)} className="mt-2" />
          <p className="mt-3 flex-1 text-sm text-ink/70">{bike.shortDescription}</p>
          <div className="mt-5 flex items-end justify-between">
            <p className="font-spec text-ink">
              <PriceCounter value={bike.pricePerDay} className="text-ink" />
              <span className="text-ink"> {site.currency}</span>
              <span className="text-ink/70"> {approxEur(bike.pricePerDay)} / jour</span>
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
