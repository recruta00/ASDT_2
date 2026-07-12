import Image from "next/image";
import { cx } from "@/lib/cx";
import { BikeGlyph, VillaGlyph } from "@/components/art/Glyphs";

type Kind = "bike" | "stay";

/**
 * Image slot with a built-in fallback (spec §10). When `src` is present it renders
 * next/image; otherwise it paints the finished-looking line-art panel so nothing
 * ever shows a broken slot. Drop a real photo path into the data and it appears.
 */
export function Media({
  src,
  alt,
  kind,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  aspect = "aspect-[4/3]",
}: {
  src?: string;
  alt: string;
  kind: Kind;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: string;
}) {
  const Glyph = kind === "bike" ? BikeGlyph : VillaGlyph;
  return (
    <div
      className={cx(
        "relative w-full overflow-hidden bg-ink",
        aspect,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="rr-zoom object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="glow-ember texture-noise absolute inset-0 flex items-center justify-center"
        >
          {/* Radial vignette + centered glyph carrying the visual weight. */}
          <Glyph className="w-2/3 max-w-[240px] text-bone/70" />
          <span
            aria-hidden
            className="seam-rule absolute bottom-5 left-5 !w-10 opacity-80"
          />
        </div>
      )}
    </div>
  );
}
