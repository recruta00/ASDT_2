import type { SVGProps } from "react";

/**
 * Hand-drawn line-art glyphs for the zero-photo fallback art direction (spec §10).
 * Consistent 1.5px bone strokes on a shared grid so bikes and stays feel drawn
 * in one hand. Purely decorative — always paired with an aria-label on the parent.
 */

const common: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function BikeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 140" {...common} {...props}>
      {/* wheels */}
      <circle cx="52" cy="98" r="26" />
      <circle cx="188" cy="98" r="26" />
      <circle cx="52" cy="98" r="4" />
      <circle cx="188" cy="98" r="4" />
      {/* frame */}
      <path d="M52 98 L96 62 L150 62 L172 84" />
      <path d="M96 62 L118 98 L188 98" />
      <path d="M118 98 L150 62" />
      {/* tank + seat */}
      <path d="M96 62 q10 -14 34 -12 l20 12 Z" />
      <path d="M150 62 q22 -4 30 6" />
      {/* handlebar + fork */}
      <path d="M150 62 L164 44 L182 44" />
      <path d="M96 62 L70 84" />
      {/* headlight */}
      <path d="M182 44 l14 6" />
      <circle cx="200" cy="52" r="5" />
    </svg>
  );
}

export function VillaGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 140" {...common} {...props}>
      {/* ground / pool line */}
      <path d="M18 118 L222 118" />
      {/* villa mass */}
      <path d="M60 118 L60 56 L150 56 L150 118" />
      <path d="M150 118 L150 74 L196 74 L196 118" />
      {/* flat roofs */}
      <path d="M54 56 L156 56" />
      <path d="M144 74 L202 74" />
      {/* windows / door */}
      <rect x="76" y="72" width="20" height="20" />
      <rect x="112" y="72" width="20" height="20" />
      <path d="M92 118 L92 100 L112 100 L112 118" />
      <rect x="162" y="86" width="18" height="18" />
      {/* palm — a nod to Marrakech */}
      <path d="M34 118 L34 82" />
      <path d="M34 82 q-16 -6 -22 -18 M34 82 q16 -6 22 -18 M34 82 q-4 -18 0 -26 M34 82 q10 -14 20 -16" />
      {/* pool shimmer */}
      <path d="M150 118 q18 -8 36 0 q18 8 36 0" opacity="0.6" />
    </svg>
  );
}
