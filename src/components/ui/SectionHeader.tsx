import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Eyebrow } from "./Eyebrow";

/**
 * Section header with the Seam as its underline (spec §7.1.3).
 * Renders an eyebrow, an <h2>, and an optional lead paragraph.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  titleId,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
}) {
  return (
    <div
      className={cx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={titleId}
        className="font-display mt-3 text-[clamp(2rem,4vw,3.25rem)] font-bold text-bone"
      >
        {title}
      </h2>
      {/* The Seam underline — thin ember rule at −12°. */}
      <span
        aria-hidden
        className={cx("seam-rule mt-5", align === "center" && "mx-auto")}
      />
      {lead ? <p className="mt-5 text-mist">{lead}</p> : null}
    </div>
  );
}
