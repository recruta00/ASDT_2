"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient hero video layer. Progressive enhancement only: mounts after idle,
 * only when its `media` viewport query matches (so a CSS-hidden duplicate
 * panel never downloads bytes), never under reduced motion, and only when a
 * source is configured. The poster image beneath stays the LCP element, so
 * this never touches the performance budget.
 *
 * Listens for the global "rr:motion" CustomEvent<boolean> dispatched by
 * MotionToggle to pause/resume playback (WCAG 2.2.2).
 */
export function HeroVideo({
  src,
  mobileSrc,
  media,
  className,
}: {
  src: string;
  /** Lighter rendition served under 768px so cellular starts fast. */
  mobileSrc?: string;
  /** e.g. "(min-width: 768px)" — instance mounts only when this matches. */
  media?: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [effectiveSrc, setEffectiveSrc] = useState(src);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (media && !window.matchMedia(media).matches) return;
    // Respect Save-Data and very slow connections: poster only.
    type NetInfo = { saveData?: boolean; effectiveType?: string };
    const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
    if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setEffectiveSrc(mobile && mobileSrc ? mobileSrc : src);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 800 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(id);
  }, [src, mobileSrc, media]);

  // Kick playback explicitly once mounted — iOS Safari occasionally ignores
  // the autoplay attribute on late-mounted videos — and mark "playing" from
  // several redundant signals so the fade-in can never get stuck at opacity 0.
  useEffect(() => {
    if (!ready) return;
    const v = ref.current;
    if (!v) return;
    const mark = () => setPlaying(true);
    v.addEventListener("timeupdate", mark, { once: true });
    const p = v.play();
    if (p) p.then(mark).catch(() => {});
    return () => v.removeEventListener("timeupdate", mark);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const onToggle = (e: Event) => {
      const paused = (e as CustomEvent<boolean>).detail;
      const v = ref.current;
      if (!v) return;
      if (paused) v.pause();
      else v.play().catch(() => {});
    };
    window.addEventListener("rr:motion", onToggle);
    return () => window.removeEventListener("rr:motion", onToggle);
  }, [ready]);

  if (!src || !ready) return null;

  return (
    <video
      ref={ref}
      className={className}
      style={{ opacity: playing ? 1 : 0, transition: "opacity 600ms ease" }}
      src={effectiveSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      onPlaying={() => setPlaying(true)}
    />
  );
}
