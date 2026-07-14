"use client";

import { useState } from "react";

/**
 * WCAG 2.2.2 — one discreet control that pauses ALL ambient motion on the
 * page: hero/spotlight videos (via the "rr:motion" event HeroVideo listens
 * to) and the CSS animation loops (via the `rr-motion-paused` class on
 * <html>, see globals.css). Fixed bottom-left, mirroring the WhatsApp FAB.
 */
export function MotionToggle() {
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.documentElement.classList.toggle("rr-motion-paused", next);
    window.dispatchEvent(new CustomEvent<boolean>("rr:motion", { detail: next }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={
        paused ? "Reprendre les animations" : "Mettre les animations en pause"
      }
      className="fixed bottom-5 left-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 bg-abyss/60 text-bone backdrop-blur-sm transition-colors hover:bg-abyss/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
    >
      {paused ? (
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
          <path d="M4 2l10 6-10 6V2z" />
        </svg>
      ) : (
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
          <path d="M3 2h4v12H3V2zm6 0h4v12H9V2z" />
        </svg>
      )}
    </button>
  );
}
