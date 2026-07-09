/** Mono spec table for detail pages (spec §7.3) — one technical voice. */
export function SpecTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="overflow-hidden rounded-[20px] border border-[color:var(--line)]">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={
            "flex items-center justify-between gap-4 px-5 py-3.5" +
            (i > 0 ? " border-t border-[color:var(--line)]" : "")
          }
        >
          <dt className="font-spec text-mist">{label}</dt>
          <dd className="text-right text-sm text-bone">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
