"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/cx";
import { site } from "@/config/site";

/** A labelled group wrapper for the filter bar. */
export function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-spec text-ink/60">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/** Segmented chip — behaves as a radio within its group (keyboard-operable button). */
export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-ember bg-ember text-abyss"
          : "border-ink/15 text-ink/80 hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}

/** A native checkbox toggle styled as a pill. */
export function FilterToggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cx(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors",
        checked ? "border-ember bg-ember text-abyss" : "border-ink/15 text-ink/80 hover:border-ink/40",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-ember"
      />
      {children}
    </label>
  );
}

/** Max-price slider with a visible current value (aria-labelled). */
export function PriceRange({
  id,
  label,
  min,
  max,
  value,
  onChange,
  unit,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-spec text-ink/60">
        {label} :{" "}
        <span className="text-ink">
          {formatPrice(value, site.currency)} {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-52 cursor-pointer accent-ember"
      />
    </div>
  );
}
