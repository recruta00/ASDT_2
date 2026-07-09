import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Scroll-reveal wrapper (spec §5.5): fade + rise once as it enters view.
 * Implemented with CSS scroll-driven animations (`animation-timeline: view()`)
 * — no JavaScript, no framer. Under reduced motion or without browser support,
 * content is simply shown. `delay` is accepted for call-site compatibility.
 */
export function MotionReveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  return <Tag className={cx("rr-reveal", className)}>{children}</Tag>;
}
