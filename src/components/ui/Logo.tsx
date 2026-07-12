import Link from "next/link";
import { routes } from "@/config/routes";
import { cx } from "@/lib/cx";

/** The RR monogram — two R's stitched by the −12° Seam, on an ink tile. */
export function RRMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="11" fill="var(--abyss)" />
      <text
        x="9"
        y="33"
        fontFamily="var(--font-unbounded), system-ui, sans-serif"
        fontWeight="700"
        fontSize="19"
        fill="var(--bone)"
      >
        R
      </text>
      <text
        x="24"
        y="33"
        fontFamily="var(--font-unbounded), system-ui, sans-serif"
        fontWeight="700"
        fontSize="19"
        fill="var(--ember)"
      >
        R
      </text>
      {/* The Seam slashing through the monogram at −12° */}
      <rect
        x="22.6"
        y="4"
        width="2.2"
        height="40"
        rx="1.1"
        fill="var(--ember)"
        transform="rotate(-12 24 24)"
        opacity="0.9"
      />
    </svg>
  );
}

/** Wordmark + RR mark. `tone` adapts text to light or dark surfaces. */
export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href={routes.home}
      title="Accueil"
      className={cx(
        "group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember",
        className,
      )}
    >
      <RRMark className="h-9 w-9" />
      {/* Wordmark stays single-color for AA contrast on both tones — the
          ember lives in the RR mark itself. */}
      <span
        className={cx(
          "font-display text-lg font-bold tracking-tight",
          tone === "light" ? "text-ink" : "text-bone",
        )}
      >
        Recruta Rent
      </span>
    </Link>
  );
}
