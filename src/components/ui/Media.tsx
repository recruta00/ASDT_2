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
        "arch-top relative w-full overflow-hidden bg-ink",
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
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(70%_65%_at_50%_28%,rgba(224,163,78,0.35),transparent_72%)]"
        >
          {/* Warm sun + centered line-art glyph carrying the visual weight. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[26%] h-14 w-14 -translate-x-1/2 rounded-full bg-gold/40"
          />
          <Glyph className="relative w-2/3 max-w-[240px] text-bone/65" />
        </div>
      )}
    </div>
  );
}
