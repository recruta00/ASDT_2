/** Mono spec table for detail pages (spec §7.3) — one technical voice. */
export function SpecTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="overflow-hidden rounded-[20px] border border-ink/10 bg-white">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={
            "flex items-center justify-between gap-4 px-5 py-3.5" +
            (i > 0 ? " border-t border-ink/10" : "")
          }
        >
          <dt className="font-spec text-ink/70">{label}</dt>
          <dd className="text-right text-sm text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
