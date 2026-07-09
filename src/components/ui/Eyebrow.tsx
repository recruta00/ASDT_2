import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Mono "spec-sheet" eyebrow label (spec §5.3). Uppercase, letter-spaced. */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span";
}) {
  return <Tag className={cx("font-spec text-ember", className)}>{children}</Tag>;
}
