import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Standard max-width content wrapper. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
}) {
  return (
    <Tag className={cx("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>
      {children}
    </Tag>
  );
}
