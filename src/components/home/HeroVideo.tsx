"use client";

import { useEffect, useState } from "react";

/**
 * Ambient hero video layer (RIDE panel). Progressive enhancement only:
 * mounts after idle, desktop-width viewports, never under reduced motion,
 * and only when a source is configured. The poster image beneath stays the
 * LCP element, so this never touches the performance budget.
 */
export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !desktop) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, [src]);

  if (!src || !ready) return null;

  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}
