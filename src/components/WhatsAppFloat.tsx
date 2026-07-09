"use client";

import { motion, useReducedMotion } from "framer-motion";
import { whatsappUrl, generalMessage } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.42 1.32-1.94 1.36-.5.05-.97.23-3.28-.68-2.77-1.09-4.53-3.92-4.67-4.1-.14-.18-1.12-1.49-1.12-2.84s.71-2.02.96-2.29c.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.57.82 1.98.89 2.12.07.14.12.31.02.49-.09.18-.14.29-.28.45-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.25 2.24 1.39.28.14.44.12.6-.07.18-.21.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.58.75 1.85.89.27.14.45.21.52.32.07.12.07.66-.17 1.34Z" />
    </svg>
  );
}

/** Floating WhatsApp button, site-wide, ember, single non-looping pulse (§7.7). */
export function WhatsAppFloat() {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={whatsappUrl(generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-ember text-abyss shadow-[0_10px_30px_-8px_rgba(248,106,44,0.7)] transition-colors hover:bg-ember-hi focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
      animate={
        reduce ? {} : { scale: [0.6, 1.12, 1], opacity: 1 }
      }
      transition={{ duration: 0.7, times: [0, 0.6, 1], delay: 0.4 }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </motion.a>
  );
}
