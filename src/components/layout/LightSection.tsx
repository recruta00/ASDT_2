import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Content section on the warm sand surface. In the Solaire theme the whole site
 * is light, so this is simply the standard section wrapper (cream cards pop on it).
 */
export function LightSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Kept for call-site compatibility; no longer renders a divider. */
  seam?: boolean;
}) {
  return (
    <section className={cx("relative bg-abyss text-bone", className)}>
      {children}
    </section>
  );
}
