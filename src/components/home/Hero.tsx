"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroVideo } from "./HeroVideo";

type Side = "ride" | "stay" | null;

const TILT = 6; // half-run in % width — reads as ≈−12° at a 16:9 hero

/**
 * The fused hero — "Showroom Nocturne" split (direction A) carrying the
 * editorial mono spec-sheet layer from direction B. Photographic panels:
 * the Honda X-ADV 750 studio shot vs. the villa pool at dusk, stitched by
 * the Seam. Content animates with CSS so the LCP paints at first paint.
 */
function RideContent() {
  return (
    <div className="max-w-md">
      <div className="rr-rise" style={{ animationDelay: "0.05s" }}>
        <Eyebrow onDark>Honda X-ADV 750 — {site.city}</Eyebrow>
      </div>
      <p
        className="font-display rr-rise mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-none text-bone"
        style={{ animationDelay: "0.12s" }}
      >
        RIDE
      </p>
      <p className="rr-rise mt-4 text-bone/80" style={{ animationDelay: "0.19s" }}>
        Le maxi-scooter aventure 745 cm³, boîte automatique DCT. Livré avec
        casque, prêt en 10 minutes.
      </p>
      <span
        className="rr-rise mt-7 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-abyss"
        style={{ animationDelay: "0.26s" }}
      >
        Découvrir la machine <span aria-hidden>→</span>
      </span>
    </div>
  );
}

function StayContent() {
  return (
    <div className="max-w-md">
      <div className="rr-rise" style={{ animationDelay: "0.05s" }}>
        <Eyebrow onDark>Appartements &amp; villas</Eyebrow>
      </div>
      <p
        className="font-display rr-rise mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-none text-bone"
        style={{ animationDelay: "0.12s" }}
      >
        STAY
      </p>
      <p className="rr-rise mt-4 text-bone/80" style={{ animationDelay: "0.19s" }}>
        Des adresses élégantes, du studio à la villa avec piscine.
      </p>
      <span
        className="rr-rise mt-7 inline-flex items-center gap-2 rounded-full border border-bone/40 bg-abyss/30 px-6 py-3 text-sm font-medium text-bone backdrop-blur-sm"
        style={{ animationDelay: "0.26s" }}
      >
        Voir les séjours <span aria-hidden>→</span>
      </span>
    </div>
  );
}

/** Mono spec-sheet corner labels — the editorial layer (desktop only). */
function SpecLayer() {
  return (
    <div
      aria-hidden
      className="rr-rise pointer-events-none absolute inset-0 z-20 hidden md:block"
      style={{ animationDelay: "0.5s" }}
    >
      <span className="font-spec absolute left-8 top-24 text-bone/60">
        {site.city} · {site.country}
      </span>
      <span className="font-spec absolute right-8 top-24 text-bone/60">
        N {site.geo.latitude}° · W {Math.abs(site.geo.longitude)}°
      </span>
      <span className="font-spec absolute bottom-8 left-8 text-bone/60">
        745 CC · DCT · 2026
      </span>
      <span className="font-spec absolute bottom-8 right-24 text-bone/60">
        Studio → Villa · {site.tagline}
      </span>
    </div>
  );
}

export function Hero() {
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
        {site.name} — location Honda X-ADV 750, appartements et villas à{" "}
        {site.city}
      </h1>

      {/* ================= Desktop: interactive Seam split ================= */}
      <div className="relative hidden h-[100svh] min-h-[600px] w-full overflow-hidden md:block">
        {/* RIDE panel — the machine */}
        <div
          className="rr-in-left absolute inset-0"
          style={{ clipPath: leftClip, transition: `clip-path ${glide}` }}
        >
          <Image
            src="/images/bikes/honda-x-adv-750-studio.webp"
            alt=""
            fill
            priority
            quality={70}
            sizes="(min-width: 768px) 66vw, 100vw"
            className="rr-kenburns object-cover object-[62%_center]"
          />
          {site.heroVideoSrc ? (
            <HeroVideo
              src={site.heroVideoSrc}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          {/* Legibility + brand grade */}
          <div className="absolute inset-0 bg-gradient-to-r from-abyss/90 via-abyss/35 to-abyss/20" />
          <div className="texture-noise absolute inset-0" />
        </div>

        {/* STAY panel — the address. No priority/eager: it lazy-loads the
            moment it intersects (immediately on desktop), and never downloads
            on mobile where this panel is display:none. */}
        <div
          className="rr-in-right absolute inset-0"
          style={{ clipPath: rightClip, transition: `clip-path ${glide}` }}
        >
          <Image
            src="/images/stays/hero-villa-dusk.webp"
            alt=""
            fill
            quality={70}
            sizes="(min-width: 768px) 66vw, 100vw"
            className="rr-kenburns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-abyss/85 via-abyss/40 to-abyss/25" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_25%,rgba(255,138,80,0.10),transparent_70%)]" />
          <div className="texture-noise absolute inset-0" />
        </div>

        {/* The Seam — glides with the split, soft glow pulse */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-10%] z-10 h-[120%] w-[2px]"
          style={{
            left: `${f * 100}%`,
            transform: "translateX(-50%) rotate(-12deg)",
            transition: `left ${glide}`,
          }}
        >
          <div className="rr-draw rr-seam-glow h-full w-full bg-gradient-to-b from-transparent via-ember to-transparent" />
        </div>

        <SpecLayer />

        {/* Clickable panels + content */}
        <div className="absolute inset-0 z-10 grid grid-cols-2">
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

        {/* Scroll indicator */}
        <div aria-hidden className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <span className="rr-tick block h-8 w-px bg-ember" />
        </div>
      </div>

      {/* ================= Mobile: stacked with a diagonal Seam ================= */}
      <div className="md:hidden">
        <Link
          href={routes.bikes}
          className="relative flex min-h-[58svh] flex-col justify-center overflow-hidden px-6 pb-16 pt-28"
        >
          <Image
            src="/images/bikes/honda-x-adv-750-studio.webp"
            alt=""
            fill
            priority
            quality={70}
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-abyss/65 to-abyss/40" />
          <div className="texture-noise absolute inset-0" />
          <div className="relative">
            <RideContent />
          </div>
        </Link>
        <div className="relative -mt-8">
          <Link
            href={routes.stays}
            className="seam-divider relative flex min-h-[52svh] flex-col justify-center overflow-hidden px-6 pb-16 pt-16"
          >
            <Image
              src="/images/stays/hero-villa-dusk.webp"
              alt=""
              fill
              quality={70}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-abyss/65 to-abyss/40" />
            <div className="texture-noise absolute inset-0" />
            <span aria-hidden className="seam-rule absolute left-6 top-6 !w-16" />
            <div className="relative">
              <StayContent />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
