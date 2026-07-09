import Link from "next/link";
import { routes } from "@/config/routes";
import { cx } from "@/lib/cx";

/** Wordmark: "Recruta" + "Rent" stitched by a small −12° ember Seam tick. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      title="Accueil"
      className={cx(
        "group inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-5 w-[3px] rounded bg-ember"
        style={{ transform: "rotate(-12deg)" }}
      />
      <span className="font-display text-lg font-bold tracking-tight text-bone">
        Recruta<span className="text-ember">Rent</span>
      </span>
    </Link>
  );
}
