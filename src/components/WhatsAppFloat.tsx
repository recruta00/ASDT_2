"use client";

import { motion, useReducedMotion } from "framer-motion";
import { whatsappUrl, generalMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

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
