"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { Media } from "@/components/ui/Media";

type Kind = "bike" | "stay";

/** Detail-page gallery: main image + thumbnails. Falls back to line-art when
 *  no photos are attached yet (spec §10). */
export function Gallery({
  images,
  alt,
  kind,
}: {
  images: string[];
  alt: string;
  kind: Kind;
}) {
  const [active, setActive] = useState(0);
  const hasPhotos = images.length > 0;

  return (
    <div>
      <div className="overflow-hidden rounded-[20px] border border-[color:var(--line)]">
        <Media
          kind={kind}
          src={hasPhotos ? images[active] : undefined}
          alt={alt}
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          aspect="aspect-[4/3]"
        />
      </div>

      {hasPhotos && images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-current={active === i}
              className={cx(
                "overflow-hidden rounded-xl border transition-colors",
                active === i ? "border-ember" : "border-[color:var(--line)] hover:border-bone/40",
              )}
            >
              <Media
                kind={kind}
                src={img}
                alt={`${alt} — vue ${i + 1}`}
                sizes="20vw"
                aspect="aspect-square"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
