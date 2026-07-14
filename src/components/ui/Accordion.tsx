"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/cx";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Keyboard-operable accordion with ARIA (spec §11). Native <button> headers
 * toggle `aria-expanded`; panels are labelled by their trigger.
 */
export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cx("divide-y divide-ink/10", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-medium text-ink">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/15 text-ember transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-5 text-ink/70"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
