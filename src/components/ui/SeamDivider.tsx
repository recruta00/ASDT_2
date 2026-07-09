import { cx } from "@/lib/cx";

/**
 * The Seam as a section boundary (spec §5.1) — a diagonal edge on a section
 * background. Render as the first child of a section with `position: relative`;
 * it paints the tilted top edge in the given color, plus a hairline ember line.
 */
export function SeamDivider({
  color = "var(--abyss)",
  flip = false,
  className,
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute inset-x-0 top-0 -translate-y-full", className)}
    >
      <svg
        className="block h-[4vw] min-h-[36px] w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        role="presentation"
      >
        {/* Filled diagonal wedge that visually seams into the next section. */}
        <polygon
          points={flip ? "0,0 1440,80 1440,80 0,80" : "0,80 1440,0 1440,80 0,80"}
          fill={color}
        />
        {/* The ember Seam line riding the diagonal. */}
        <line
          x1={flip ? 0 : 0}
          y1={flip ? 0 : 80}
          x2={flip ? 1440 : 1440}
          y2={flip ? 80 : 0}
          stroke="var(--ember)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
