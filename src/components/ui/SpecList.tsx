import { cx } from "@/lib/cx";

/**
 * The mono "spec-sheet" line (spec §5.3) — e.g. `125CC · 2024 · CASQUE INCLUS`
 * for bikes and `2 CH · 2 SDB · 95 M² · PISCINE` for stays. One technical voice.
 */
export function SpecList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <p className={cx("font-spec text-ink/70", className)}>
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5 text-ember">·</span>}
          {item}
        </span>
      ))}
    </p>
  );
}
