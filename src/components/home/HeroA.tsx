"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState } from "react";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BikeGlyph, VillaGlyph } from "@/components/art/Glyphs";

type Side = "ride" | "stay" | null;

const TILT = 6; // half-run in % width — reads as ≈−12° at a 16:9 hero

/** Staggered content reveal for a panel's eyebrow → word → sub → CTA. */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function RideContent() {
  return (
    <motion.div variants={group} initial="hidden" animate="show" className="max-w-sm">
      <motion.div variants={rise}>
        <Eyebrow>Location moto — {site.city}</Eyebrow>
      </motion.div>
      <motion.p
        variants={rise}
        className="font-display mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-none text-bone"
      >
        RIDE
      </motion.p>
      <motion.p variants={rise} className="mt-4 text-mist">
        Scooters &amp; motos entretenus, prêts à rouler.
      </motion.p>
      <motion.span
        variants={rise}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-abyss"
      >
        Voir les motos <span aria-hidden>→</span>
      </motion.span>
    </motion.div>
  );
}

function StayContent() {
  return (
    <motion.div variants={group} initial="hidden" animate="show" className="max-w-sm">
      <motion.div variants={rise}>
        <Eyebrow>Appartements &amp; villas</Eyebrow>
      </motion.div>
      <motion.p
        variants={rise}
        className="font-display mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-none text-bone"
      >
        STAY
      </motion.p>
      <motion.p variants={rise} className="mt-4 text-mist">
        Des adresses élégantes, du studio à la villa avec piscine.
      </motion.p>
      <motion.span
        variants={rise}
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-bone/40 px-6 py-3 text-sm font-medium text-bone"
      >
        Voir les séjours <span aria-hidden>→</span>
      </motion.span>
    </motion.div>
  );
}

export function HeroA() {
  const [side, setSide] = useState<Side>(null);
  const reduce = useReducedMotion();

  const f = side === "ride" ? 0.66 : side === "stay" ? 0.34 : 0.5;
  const topX = f * 100 + TILT;
  const botX = f * 100 - TILT;
  const leftClip = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;
  const rightClip = `polygon(${topX}% 0, 100% 0, 100% 100%, ${botX}% 100%)`;
  const clipTransition = "clip-path 600ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <section aria-label="Choisissez : moto ou séjour" className="relative">
      <h1 className="sr-only">
        {site.name} — location de motos, scooters, appartements et villas à{" "}
        {site.city}
      </h1>

      {/* ================= Desktop: interactive Seam split ================= */}
      <div className="relative hidden h-[100svh] min-h-[600px] w-full overflow-hidden md:block">
        {/* RIDE panel — deep navy, motion world */}
        <motion.div
          className="glow-ember texture-noise absolute inset-0 bg-abyss"
          style={{ clipPath: leftClip, transition: clipTransition }}
          initial={reduce ? false : { opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <BikeGlyph
            aria-hidden
            className="absolute -bottom-6 left-4 h-64 w-[28rem] text-bone/[0.06]"
          />
          {/* subtle motion streaks */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(248,106,44,0.06)_50%,transparent_60%)]" />
        </motion.div>

        {/* STAY panel — warm dusk world */}
        <motion.div
          className="texture-noise absolute inset-0 bg-ink"
          style={{ clipPath: rightClip, transition: clipTransition }}
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_25%,rgba(255,138,80,0.12),transparent_70%)]" />
          <VillaGlyph
            aria-hidden
            className="absolute -bottom-6 right-4 h-64 w-[28rem] text-bone/[0.06]"
          />
        </motion.div>

        {/* The Seam — ember line riding exactly on the panel boundary.
            Draws itself top-to-bottom via an overflow-clipped wrapper (clean,
            no stroke-dash artifacts); endpoints glide with the split on hover. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
          initial={reduce ? false : { height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            className="absolute left-0 top-0 h-[100svh] min-h-[600px] w-full drop-shadow-[0_0_12px_rgba(248,106,44,0.6)]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.line
              y1={0}
              y2={100}
              stroke="var(--ember)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ x1: topX, x2: botX }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </motion.div>

        {/* Clickable panels + content (on top of the art layers) */}
        <div className="absolute inset-0 grid grid-cols-2">
          <Link
            href={routes.bikes}
            aria-label="Voir les motos"
            onMouseEnter={() => setSide("ride")}
            onMouseLeave={() => setSide(null)}
            onFocus={() => setSide("ride")}
            onBlur={() => setSide(null)}
            className="flex items-center justify-start p-10 lg:p-20 focus-visible:outline-none"
          >
            <RideContent />
          </Link>
          <Link
            href={routes.stays}
            aria-label="Voir les séjours"
            onMouseEnter={() => setSide("stay")}
            onMouseLeave={() => setSide(null)}
            onFocus={() => setSide("stay")}
            onBlur={() => setSide(null)}
            className="flex items-center justify-end p-10 text-right lg:p-20 focus-visible:outline-none"
          >
            <StayContent />
          </Link>
        </div>

        {/* Scroll indicator — thin ember tick animating downward */}
        <motion.div
          aria-hidden
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.span
            className="block h-8 w-px bg-ember"
            animate={reduce ? {} : { scaleY: [0.3, 1, 0.3], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* ================= Mobile: stacked with a diagonal Seam ================= */}
      <div className="md:hidden">
        <Link
          href={routes.bikes}
          className="glow-ember texture-noise relative flex min-h-[58svh] flex-col justify-center bg-abyss px-6 pb-16 pt-28"
        >
          <BikeGlyph aria-hidden className="absolute bottom-4 right-2 h-28 w-44 text-bone/[0.06]" />
          <RideContent />
        </Link>
        <div className="relative -mt-8">
          <Link
            href={routes.stays}
            className="seam-divider texture-noise relative flex min-h-[52svh] flex-col justify-center bg-ink px-6 pb-16 pt-16"
          >
            <span aria-hidden className="seam-rule absolute left-6 top-6 !w-16" />
            <VillaGlyph aria-hidden className="absolute bottom-4 right-2 h-28 w-44 text-bone/[0.06]" />
            <StayContent />
          </Link>
        </div>
      </div>
    </section>
  );
}
