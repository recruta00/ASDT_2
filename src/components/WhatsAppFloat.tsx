import { whatsappUrl, generalMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp button, site-wide, ember, single non-looping pulse (§7.7).
 * CSS-only intro pulse (no framer) — under reduced motion it simply appears.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl(generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="rr-pulse fixed bottom-5 right-5 z-40 hidden h-14 w-14 md:grid place-items-center rounded-full bg-ember text-abyss shadow-[0_10px_30px_-8px_rgba(248,106,44,0.7)] transition-colors hover:bg-ember-hi focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
