"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";

const items = [
  "Réponse rapide sur WhatsApp",
  "Caution transparente",
  "Contrats clairs",
  "Assistance 7j/7",
  "Livraison à Marrakech",
  "Casque offert",
];

/**
 * Trust strip in the mono voice (spec §7.1.2), presented as a slow marquee.
 * The track is duplicated for a seamless loop. WCAG 2.2.2: a visible
 * pause/play toggle stops the motion for keyboard and touch users (hover
 * also pauses); under reduced motion it never moves at all.
 */
export function TrustStrip() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Nos engagements"
      className={cx(
        "rr-marquee relative overflow-hidden border-y border-ink/10 bg-white/60",
        paused && "rr-marquee-paused",
      )}
    >
      <div className="relative py-5 pr-14">
        <div className="rr-marquee-track gap-0">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {items.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="font-spec whitespace-nowrap px-6 text-ink/70">
                    {item}
                  </span>
                  <span aria-hidden className="text-ember">
                    ·
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label={paused ? "Relancer le défilement" : "Mettre le défilement en pause"}
        onClick={() => setPaused((v) => !v)}
        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-white text-ink/70 transition-colors hover:text-ink"
      >
        <span aria-hidden className="text-[0.6rem] leading-none">
          {paused ? "▶" : "⏸"}
        </span>
      </button>
    </section>
  );
}
