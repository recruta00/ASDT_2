import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Content section on the light bone surface. The site is light-dominant, so
 * this is now a thin semantic wrapper (kept so a future dark section rhythm
 * can be reintroduced in one place).
 */
export function LightSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** kept for call-site compatibility; no divider on a light-on-light seam */
  seam?: boolean;
}) {
  return (
    <section className={cx("relative bg-bone text-ink", className)}>
      {children}
    </section>
  );
}
