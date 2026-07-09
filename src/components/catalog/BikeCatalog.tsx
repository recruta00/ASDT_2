"use client";

import { useMemo, useState } from "react";
import type { Bike, BikeCategory } from "@/data/types";
import { BikeCard } from "@/components/cards/BikeCard";
import { Button } from "@/components/ui/Button";
import {
  FilterGroup,
  FilterChip,
  PriceRange,
} from "./FilterControls";

type Cat = "all" | BikeCategory;
type Engine = "all" | "small" | "mid" | "big";

const engineLabels: Record<Engine, string> = {
  all: "Toutes",
  small: "≤ 125 cc",
  mid: "126–400 cc",
  big: "> 400 cc",
};

function matchesEngine(cc: number, e: Engine) {
  if (e === "all") return true;
  if (e === "small") return cc <= 125;
  if (e === "mid") return cc > 125 && cc <= 400;
  return cc > 400;
}

export function BikeCatalog({ bikes }: { bikes: Bike[] }) {
  const priceMax = useMemo(
    () => Math.max(...bikes.map((b) => b.pricePerDay)),
    [bikes],
  );
  const priceMin = useMemo(
    () => Math.min(...bikes.map((b) => b.pricePerDay)),
    [bikes],
  );

  const [cat, setCat] = useState<Cat>("all");
  const [engine, setEngine] = useState<Engine>("all");
  const [maxPrice, setMaxPrice] = useState(priceMax);

  const filtered = bikes.filter(
    (b) =>
      (cat === "all" || b.category === cat) &&
      matchesEngine(b.engineCc, engine) &&
      b.pricePerDay <= maxPrice,
  );

  function reset() {
    setCat("all");
    setEngine("all");
    setMaxPrice(priceMax);
  }

  return (
    <div>
      <h2 className="sr-only">Nos motos et scooters à louer</h2>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 -mx-5 mb-10 border-y border-[color:var(--line)] bg-ink/90 px-5 py-5 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-6">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
          <FilterGroup label="Type">
            {(["all", "scooter", "moto"] as Cat[]).map((c) => (
              <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c === "all" ? "Tous" : c === "scooter" ? "Scooter" : "Moto"}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Cylindrée">
            {(["all", "small", "mid", "big"] as Engine[]).map((e) => (
              <FilterChip
                key={e}
                active={engine === e}
                onClick={() => setEngine(e)}
              >
                {engineLabels[e]}
              </FilterChip>
            ))}
          </FilterGroup>

          <PriceRange
            id="bike-price"
            label="Prix max / jour"
            min={priceMin}
            max={priceMax}
            value={maxPrice}
            onChange={setMaxPrice}
            unit="/ jour"
          />

          <p className="ml-auto font-spec text-mist" aria-live="polite">
            {filtered.length} véhicule{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--line)] bg-ink px-6 py-16 text-center">
          <p className="text-mist">
            Aucun résultat pour ces filtres — élargissez votre recherche.
          </p>
          <Button onClick={reset} variant="secondary" className="mt-5 border-[color:var(--line)] text-bone hover:bg-bone/5">
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bike, i) => (
            <BikeCard
              key={bike.slug}
              bike={bike}
              priority={i < 3}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}
