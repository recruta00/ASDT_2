import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Mono "spec-sheet" eyebrow label (spec §5.3). Uppercase, letter-spaced.
 * On light surfaces the text is ink (AA contrast) with an ember Seam tick;
 * on dark photography (`onDark`) the ember text itself has enough contrast.
 */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
  onDark = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span";
  onDark?: boolean;
}) {
  return (
    <Tag
      className={cx(
        "font-spec inline-flex items-center gap-2",
        onDark ? "text-ember" : "text-ink/70",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-[2px] w-5 shrink-0 rounded bg-ember"
        style={{ transform: "rotate(-12deg)" }}
      />
      {children}
    </Tag>
  );
}
