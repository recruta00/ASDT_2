import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { SeamDivider } from "@/components/ui/SeamDivider";

/**
 * Light --bone content section (spec §5.2) with a Seam transition from the dark
 * header above it. Used for listings and legal pages so the site never reads as
 * a wall of black.
 */
export function LightSection({
  children,
  className,
  seam = true,
}: {
  children: ReactNode;
  className?: string;
  seam?: boolean;
}) {
  return (
    <section className={cx("relative bg-bone text-ink", className)}>
      {seam ? <SeamDivider color="var(--bone)" /> : null}
      {children}
    </section>
  );
}
