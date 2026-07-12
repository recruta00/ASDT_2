"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

export type Tab = { id: string; label: string; content: ReactNode };

/**
 * Tab switcher with the Seam as the active indicator (spec §7.4).
 * Follows the ARIA tabs pattern: roving focus, arrow-key navigation.
 */
export function TabSwitcher({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % tabs.length
        : (i - 1 + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Type de location"
        className="inline-flex gap-2 rounded-full border border-ink/10 bg-white p-1.5"
      >
        {tabs.map((tab, i) => {
          const selected = active === i;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                "relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors",
                selected ? "text-abyss" : "text-ink/70 hover:text-ink",
              )}
            >
              {selected && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-ember"
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={active !== i}
          className="mt-8"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
