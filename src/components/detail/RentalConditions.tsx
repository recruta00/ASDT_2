import type { Bike } from "@/data/types";
import { dualPrice } from "@/lib/price";

/**
 * "Conditions claires" — the exact answers competitors hide (licence, age,
 * deposit mechanics, fuel, km, cancellation) stated at the decision point.
 * No local rival shows these together; clarity is our conversion weapon.
 */
export function RentalConditions({ bike }: { bike: Bike }) {
  const rows: Array<[string, string]> = [
    ["Permis", bike.licence],
    ["Âge minimum", `${bike.minAge} ans`],
    ["Caution", `${dualPrice(bike.deposit)} — ${bike.depositTerms}`],
    ["Kilométrage", bike.kmPolicy],
    ["Carburant", bike.fuelPolicy],
    ["Annulation", bike.cancellation],
    ["À présenter", bike.documents.join(" + ")],
  ];

  return (
    <section aria-labelledby="conditions-claires">
      <h2 id="conditions-claires" className="font-display text-xl font-bold text-ink">
        Conditions claires, zéro surprise
      </h2>
      <span aria-hidden className="seam-rule mt-3" />
      <dl className="mt-5 overflow-hidden rounded-[20px] border border-ink/10 bg-white">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={
              "flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4" +
              (i > 0 ? " border-t border-ink/10" : "")
            }
          >
            <dt className="font-spec shrink-0 text-ink/70">{label}</dt>
            <dd className="text-sm text-ink sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
