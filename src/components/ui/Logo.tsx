import Link from "next/link";
import { routes } from "@/config/routes";
import { cx } from "@/lib/cx";

/** Wordmark: "Recruta" + "Rent" with a small keyhole-arch mark (Solaire theme). */
export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={routes.home}
      title="Accueil"
      className={cx(
        "group inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember",
        className,
      )}
    >
      {/* Little Moroccan arch mark */}
      <svg
        viewBox="0 0 16 20"
        aria-hidden
        className={cx("h-5 w-4", light ? "text-gold" : "text-ember")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M2 19V9a6 6 0 0 1 12 0v10" />
      </svg>
      <span
        className={cx(
          "font-display text-lg font-bold tracking-tight",
          light ? "text-abyss" : "text-bone",
        )}
      >
        Recruta
        <span className={light ? "text-gold" : "text-ember"}>Rent</span>
      </span>
    </Link>
  );
}
