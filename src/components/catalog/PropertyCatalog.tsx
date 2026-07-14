"use client";

import { useMemo, useState } from "react";
import type { Property, PropertyType } from "@/data/types";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Button } from "@/components/ui/Button";
import {
  FilterGroup,
  FilterChip,
  FilterToggle,
  PriceRange,
} from "./FilterControls";

type Type = "all" | PropertyType;
type Beds = "all" | "1" | "2" | "3" | "4";

export function PropertyCatalog({ properties }: { properties: Property[] }) {
  const priceMax = useMemo(
    () => Math.max(...properties.map((p) => p.pricePerNight)),
    [properties],
  );
  const priceMin = useMemo(
    () => Math.min(...properties.map((p) => p.pricePerNight)),
    [properties],
  );

  const [type, setType] = useState<Type>("all");
  const [beds, setBeds] = useState<Beds>("all");
  const [pool, setPool] = useState(false);
  const [maxPrice, setMaxPrice] = useState(priceMax);

  const filtered = properties.filter(
    (p) =>
      (type === "all" || p.type === type) &&
      (beds === "all" || p.bedrooms >= Number(beds)) &&
      (!pool || p.pool) &&
      p.pricePerNight <= maxPrice,
  );

  function reset() {
    setType("all");
    setBeds("all");
    setPool(false);
    setMaxPrice(priceMax);
  }

  return (
    <div>
      <h2 className="sr-only">Nos appartements et villas à louer</h2>
      <div className="sticky top-16 z-30 -mx-5 mb-10 border-y border-ink/10 bg-bone/90 px-5 py-5 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-6">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
          <FilterGroup label="Type">
            {(["all", "apartment", "villa"] as Type[]).map((t) => (
              <FilterChip key={t} active={type === t} onClick={() => setType(t)}>
                {t === "all" ? "Tous" : t === "apartment" ? "Appartement" : "Villa"}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Chambres">
            {(["all", "1", "2", "3", "4"] as Beds[]).map((b) => (
              <FilterChip key={b} active={beds === b} onClick={() => setBeds(b)}>
                {b === "all" ? "Toutes" : `${b}+`}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Équipement">
            <FilterToggle checked={pool} onChange={setPool}>
              Avec piscine
            </FilterToggle>
          </FilterGroup>

          <PriceRange
            id="stay-price"
            label="Prix max / nuit"
            min={priceMin}
            max={priceMax}
            value={maxPrice}
            onChange={setMaxPrice}
            unit="/ nuit"
          />

          <p className="ml-auto font-spec text-ink/70" aria-live="polite">
            {filtered.length} logement{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-white/40 px-6 py-16 text-center">
          <p className="text-ink/70">
            Aucun résultat pour ces filtres — élargissez votre recherche.
          </p>
          <Button onClick={reset} variant="secondary" className="mt-5 border-ink/30 text-ink hover:bg-ink/5">
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property, i) => (
            <PropertyCard
              key={property.slug}
              property={property}
              priority={i < 3}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}
