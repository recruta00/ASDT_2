import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  // Primary = ember pill with ink text, hover brightens + soft glow (§5.4).
  primary:
    "bg-ember text-abyss hover:bg-ember-hi hover:shadow-[0_8px_30px_-8px_rgba(248,106,44,0.7)]",
  // Secondary = 1px bone outline, transparent fill.
  secondary:
    "border border-bone/40 text-bone hover:border-bone hover:bg-bone/5",
  ghost: "text-bone/80 hover:text-bone",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

/** Internal link button. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/** External / WhatsApp link button (renders <a>). */
export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"a">) {
  return (
    <a className={cx(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </a>
  );
}

/** Plain button element (for client interactions). */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cx(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
