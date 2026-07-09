"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BikeGlyph, VillaGlyph } from "@/components/art/Glyphs";

type Side = "ride" | "stay" | null;

const TILT = 6; // half-run in % width — reads as ≈−12° at a 16:9 hero

/**
 * Content is animated with CSS (not framer), so the LCP words paint at first
 * paint instead of waiting for hydration. Stagger via small animation-delays.
 */
function RideContent() {
  return (
    <div className="max-w-sm">
      <div className="rr-rise" style={{ animationDelay: "0.05s" }}>
        <Eyebrow>Location moto — {site.city}</Eyebrow>
      </div>
      <p
        className="font-display rr-rise mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-none text-bone"
        style={{ animationDelay: "0.12s" }}
      >
        RIDE
      </p>
      <p className="rr-rise mt-4 text-mist" style={{ animationDelay: "0.19s" }}>
        Scooters &amp; motos entretenus, prêts à rouler.
      </p>
      <span
        className="rr-rise mt-7 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-abyss"
        style={{ animationDelay: "0.26s" }}
      >
        Voir les motos <span aria-hidden>→</span>
      </span>
    </div>
  );
}

function StayContent() {
  return (
    <div className="max-w-sm">
      <div className="rr-rise" style={{ animationDelay: "0.05s" }}>
        <Eyebrow>Appartements &amp; villas</Eyebrow>
      </div>
      <p
        className="font-display rr-rise mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-none text-bone"
        style={{ animationDelay: "0.12s" }}
      >
        STAY
      </p>
      <p className="rr-rise mt-4 text-mist" style={{ animationDelay: "0.19s" }}>
        Des adresses élégantes, du studio à la villa avec piscine.
      </p>
      <span
        className="rr-rise mt-7 inline-flex items-center gap-2 rounded-full border border-bone/40 px-6 py-3 text-sm font-medium text-bone"
        style={{ animationDelay: "0.26s" }}
      >
        Voir les séjours <span aria-hidden>→</span>
      </span>
    </div>
  );
}

export function HeroA() {
  const [side, setSide] = useState<Side>(null);

  const f = side === "ride" ? 0.66 : side === "stay" ? 0.34 : 0.5;
  const topX = f * 100 + TILT;
  const botX = f * 100 - TILT;
  const leftClip = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;
  const rightClip = `polygon(${topX}% 0, 100% 0, 100% 100%, ${botX}% 100%)`;
  const glide = "600ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <section aria-label="Choisissez : moto ou séjour" className="relative">
      <h1 className="sr-only">
        {site.name} — location de motos, scooters, appartements et villas à{" "}
        {site.city}
      </h1>

      {/* ================= Desktop: interactive Seam split ================= */}
      <div className="relative hidden h-[100svh] min-h-[600px] w-full overflow-hidden md:block">
        {/* RIDE panel — deep navy, motion world */}
        <div
          className="glow-ember texture-noise rr-in-left absolute inset-0 bg-abyss"
          style={{ clipPath: leftClip, transition: `clip-path ${glide}` }}
        >
          <BikeGlyph
            aria-hidden
            className="absolute -bottom-6 left-4 h-64 w-[28rem] text-bone/[0.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(248,106,44,0.06)_50%,transparent_60%)]" />
        </div>

        {/* STAY panel — warm dusk world */}
        <div
          className="texture-noise rr-in-right absolute inset-0 bg-ink"
          style={{ clipPath: rightClip, transition: `clip-path ${glide}` }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_25%,rgba(255,138,80,0.12),transparent_70%)]" />
          <VillaGlyph
            aria-hidden
            className="absolute -bottom-6 right-4 h-64 w-[28rem] text-bone/[0.06]"
          />
        </div>

        {/* The Seam — a rotated ember line that glides with the split on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-10%] h-[120%] w-[2px] drop-shadow-[0_0_12px_rgba(248,106,44,0.6)]"
          style={{ left: `${f * 100}%`, transform: "translateX(-50%) rotate(-12deg)", transition: `left ${glide}` }}
        >
          <div className="rr-draw h-full w-full bg-gradient-to-b from-transparent via-ember to-transparent" />
        </div>

        {/* Clickable panels + content */}
        <div className="absolute inset-0 grid grid-cols-2">
          <Link
            href={routes.bikes}
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
            onMouseEnter={() => setSide("stay")}
            onMouseLeave={() => setSide(null)}
            onFocus={() => setSide("stay")}
            onBlur={() => setSide(null)}
            className="flex items-center justify-end p-10 text-right lg:p-20 focus-visible:outline-none"
          >
            <StayContent />
          </Link>
        </div>

        {/* Scroll indicator — thin ember tick pulsing downward (CSS) */}
        <div aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <span className="rr-tick block h-8 w-px bg-ember" />
        </div>
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
