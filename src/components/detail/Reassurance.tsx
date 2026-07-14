/**
 * Honest reassurance row placed next to booking CTAs — answers the three
 * anxieties that block a rental order (cancellation, deposit, support).
 * `kind` adapts the deposit line: a bike comes back ("au retour"), a stay
 * ends ("en fin de séjour").
 */
export function Reassurance({ kind = "bike" }: { kind?: "bike" | "stay" }) {
  const items = [
    "Annulation gratuite jusqu'à 48 h",
    kind === "stay"
      ? "Caution restituée en fin de séjour"
      : "Caution restituée au retour",
    "Assistance 7j/7",
  ];

  return (
    <ul className="mt-4 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm text-ink/70">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-ember"
            aria-hidden
            fill="none"
          >
            <path
              d="M4 10.5l4 4 8-9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
