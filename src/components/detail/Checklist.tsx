function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-ember" aria-hidden fill="none">
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "Ce qui est inclus" style checklist (spec §7.3). */
export function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-bone">{title}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-bone/90">
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
