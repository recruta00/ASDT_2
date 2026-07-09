import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * Temporary A/B switcher (compare phase only). Lets the user flip between the
 * two hero design directions. Removed once a direction is chosen (Phase 8).
 */
export function DirectionSwitcher({ active }: { active: "a" | "b" }) {
  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-1 rounded-full border border-[color:var(--line)] bg-abyss/80 p-1 backdrop-blur-md">
      <span className="px-2 font-spec text-[0.6rem] text-mist">Design</span>
      <Link
        href="/"
        aria-current={active === "a" ? "true" : undefined}
        className={cx(
          "rounded-full px-3 py-1.5 font-spec text-[0.62rem] transition-colors",
          active === "a" ? "bg-ember text-abyss" : "text-mist hover:text-bone",
        )}
      >
        A · Nocturne
      </Link>
      <Link
        href="/direction-b"
        aria-current={active === "b" ? "true" : undefined}
        className={cx(
          "rounded-full px-3 py-1.5 font-spec text-[0.62rem] transition-colors",
          active === "b" ? "bg-ember text-abyss" : "text-mist hover:text-bone",
        )}
      >
        B · Éditorial
      </Link>
    </div>
  );
}
