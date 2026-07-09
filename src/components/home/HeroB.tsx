"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import type { PointerEvent } from "react";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/cx";

const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HeroB() {
  const reduce = useReducedMotion();

  // Magnetic cursor parallax — normalized pointer position, spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const sy = useSpring(py, { stiffness: 120, damping: 20 });
  const wordX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const wordY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const labelX = useTransform(sx, [-0.5, 0.5], [14, -14]);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      aria-label="Recruta Rent — motos et séjours à Marrakech"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="glow-ember texture-noise relative flex min-h-[100svh] items-center overflow-hidden bg-abyss pt-24"
    >
      <h1 className="sr-only">
        {site.name} — location de motos, scooters, appartements et villas à{" "}
        {site.city}
      </h1>

      {/* Mono spec-sheet graphic layer */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: labelX }}
        className="pointer-events-none absolute inset-0"
      >
        <span className="font-spec absolute left-5 top-28 text-mist md:left-10">
          {site.city} · {site.country}
        </span>
        <span className="font-spec absolute right-5 top-28 text-mist md:right-10">
          N {site.geo.latitude}° · W {Math.abs(site.geo.longitude)}°
        </span>
        <span className="font-spec absolute bottom-10 right-5 hidden text-right text-mist sm:block md:right-10">
          Moto dès {formatPrice(200, site.currency)}/j · Villa dès{" "}
          {formatPrice(480, site.currency)}/nuit
        </span>
      </motion.div>

      {/* The Seam — a single −12° ember line stitching the two words */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-[-20%] top-1/2 h-px w-[140%] origin-left bg-gradient-to-r from-transparent via-ember to-transparent drop-shadow-[0_0_10px_rgba(248,106,44,0.7)]"
        style={{ transform: "rotate(-12deg)" }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Oversized stacked wordmark, parallaxed */}
      <motion.div
        style={reduce ? undefined : { x: wordX, y: wordY }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10"
      >
        <motion.div variants={rise} custom={0} initial="hidden" animate="show">
          <p className="font-spec text-ember">Location moto — {site.city}</p>
          <Link
            href={routes.bikes}
            className="font-display block text-[clamp(3.25rem,13vw,10.5rem)] font-bold leading-[0.86] tracking-tight text-bone transition-colors hover:text-ember focus-visible:text-ember"
          >
            RIDE
          </Link>
        </motion.div>

        <motion.div
          variants={rise}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex flex-col items-end text-right"
        >
          <Link
            href={routes.stays}
            className="font-display block text-[clamp(3.25rem,13vw,10.5rem)] font-bold leading-[0.86] tracking-tight text-bone transition-colors hover:text-ember focus-visible:text-ember"
          >
            STAY
          </Link>
          <p className="font-spec mt-1 text-mist">
            Appartements &amp; villas — {site.tagline}
          </p>
        </motion.div>

        {/* CTA row */}
        <motion.div
          variants={rise}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <Link
            href={routes.bikes}
            className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-abyss transition-colors hover:bg-ember-hi"
          >
            Voir les motos <span aria-hidden>→</span>
          </Link>
          <Link
            href={routes.stays}
            className="inline-flex items-center gap-2 rounded-full border border-bone/40 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-bone hover:bg-bone/5"
          >
            Voir les séjours <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
