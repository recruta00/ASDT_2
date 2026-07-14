import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/** Visual breadcrumb for detail/catalog headers (JSON-LD is emitted separately). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 font-spec text-ink/70">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <li aria-hidden className="text-ember">/</li>}
            <li>
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
