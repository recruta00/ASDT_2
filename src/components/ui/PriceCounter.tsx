"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";

/**
 * Price that ticks up when the card enters view (spec §5.5), in the mono voice.
 * Uses a framer-motion MotionValue (not React state) so there is no
 * setState-in-effect. SEO/no-JS safe: the real value renders on the server;
 * the count-up is a client-only enhancement, disabled under reduced motion.
 */
export function PriceCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(value);
  const formatted = useTransform(count, (v) =>
    new Intl.NumberFormat("fr-FR").format(Math.round(v)),
  );

  useEffect(() => {
    if (reduce || !inView) return;
    count.set(0);
    const controls = animate(count, value, { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduce, value, count]);

  return (
    <motion.span ref={ref} className={cx("tabular-nums", className)}>
      {formatted}
    </motion.span>
  );
}
