import Link from "next/link";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Arch-framed warm SVG scene — sun, villa, scooter, palm (the Solaire visual). */
function ArchScene() {
  return (
    <svg
      viewBox="0 0 420 520"
      className="h-full w-full"
      role="img"
      aria-label={`Location de motos et de villas à ${site.city}`}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E7C9" />
          <stop offset="0.55" stopColor="#EBD3AE" />
          <stop offset="1" stopColor="#E7C79B" />
        </linearGradient>
        <clipPath id="arch">
          <path d="M70 512 L70 220 Q70 108 210 58 Q350 108 350 220 L350 512 Z" />
        </clipPath>
      </defs>

      {/* Arch interior */}
      <g clipPath="url(#arch)">
        <rect x="60" y="40" width="300" height="480" fill="url(#sky)" />
        {/* sun */}
        <circle cx="210" cy="182" r="52" fill="#E0A34E" opacity="0.85" />
        {/* dunes / horizon */}
        <path d="M60 372 Q150 344 240 366 Q320 384 360 360 L360 520 L60 520 Z" fill="#D98E52" opacity="0.5" />
        <path d="M60 404 Q170 384 260 402 Q320 414 360 400 L360 520 L60 520 Z" fill="#C97A3F" opacity="0.5" />
        {/* villa */}
        <g fill="none" stroke="#3B2519" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M96 372 L96 320 L156 320 L156 372" />
          <path d="M88 320 L162 320" />
          <rect x="108" y="336" width="16" height="16" />
          <path d="M132 372 L132 352 L148 352 L148 372" />
        </g>
        {/* scooter */}
        <g fill="none" stroke="#A6482A" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
          <circle cx="238" cy="418" r="20" />
          <circle cx="316" cy="418" r="20" />
          <path d="M238 418 L262 384 L300 384 L316 402" />
          <path d="M262 384 q8 -12 26 -10 l14 10" />
          <path d="M300 384 L312 372 L326 372" />
        </g>
        {/* palm */}
        <g fill="none" stroke="#6E7B5B" strokeWidth="2.4" strokeLinecap="round">
          <path d="M300 372 L300 300" />
          <path d="M300 300 q-22 -8 -32 -22 M300 300 q22 -8 32 -22 M300 300 q-6 -22 0 -32 M300 300 q14 -16 28 -18" />
        </g>
      </g>

      {/* Arch frames */}
      <path d="M70 512 L70 220 Q70 108 210 58 Q350 108 350 220 L350 512" fill="none" stroke="#A6482A" strokeWidth="3" />
      <path d="M84 512 L84 224 Q84 122 210 76 Q336 122 336 224 L336 512" fill="none" stroke="#E0A34E" strokeWidth="1.4" opacity="0.8" />
    </svg>
  );
}

export function HeroA() {
  return (
    <section
      aria-label="Recruta Rent — motos et séjours à Marrakech"
      className="glow-ember texture-noise relative overflow-hidden pt-28 md:pt-32"
    >
      <Container className="grid items-center gap-10 pb-16 md:grid-cols-2 md:gap-14 md:pb-24">
        <div className="relative z-10 max-w-xl">
          <div className="rr-rise" style={{ animationDelay: "0.05s" }}>
            <Eyebrow>Location moto &amp; villas — {site.city}</Eyebrow>
          </div>

          <h1
            className="font-display rr-rise mt-5 text-[clamp(2.8rem,6.5vw,5rem)] font-bold text-bone"
            style={{ animationDelay: "0.12s" }}
          >
            Roulez <span className="italic text-ember">libre.</span>
            <br />
            Vivez <span className="italic text-ember">grand.</span>
            <span className="sr-only"> — location de motos, scooters, appartements et villas à {site.city}</span>
          </h1>

          <p
            className="rr-rise mt-6 text-lg text-mist"
            style={{ animationDelay: "0.19s" }}
          >
            Deux univers, une seule adresse à {site.city} : scooters &amp; motos
            pour filer vers l&apos;Atlas, appartements &amp; villas pour poser vos
            valises. Choisissez, confirmez sur WhatsApp, profitez.
          </p>

          <div
            className="rr-rise mt-6 flex items-center gap-6 font-spec text-mist"
            style={{ animationDelay: "0.24s" }}
          >
            <span>
              <span className="text-ember">Ride</span> — motos &amp; scooters
            </span>
            <span aria-hidden className="h-4 w-px bg-[color:var(--line)]" />
            <span>
              <span className="text-ember">Stay</span> — appart. &amp; villas
            </span>
          </div>

          <div
            className="rr-rise mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href={routes.bikes}
              className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3.5 text-sm font-semibold text-abyss shadow-[0_10px_24px_-12px_rgba(166,72,42,0.8)] transition-colors hover:bg-ember-hi"
            >
              Voir les motos <span aria-hidden>→</span>
            </Link>
            <Link
              href={routes.stays}
              className="inline-flex items-center gap-2 rounded-full border border-ember/40 px-6 py-3.5 text-sm font-semibold text-bone transition-colors hover:border-ember hover:bg-ember/5"
            >
              Voir les séjours <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Arch-framed hero visual */}
        <div
          className="rr-in-right relative z-10 mx-auto w-full max-w-md"
          style={{ animationDelay: "0.15s" }}
        >
          <ArchScene />
        </div>
      </Container>
    </section>
  );
}
