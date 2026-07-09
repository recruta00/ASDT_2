import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/** Visual breadcrumb for detail/catalog headers (JSON-LD is emitted separately). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 font-spec text-mist">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <li aria-hidden className="text-ember/60">/</li>}
            <li>
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-bone">
                  {item.label}
                </Link>
              ) : (
                <span className="text-bone/80" aria-current="page">
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
