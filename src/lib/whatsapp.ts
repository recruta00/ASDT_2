import { site } from "@/config/site";

/**
 * WhatsApp deep-link builder — the site's single conversion mechanism (spec §7.3).
 * Produces `https://wa.me/{number}?text={url-encoded French message}`.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled booking message for a named bike or property. */
export function bookingMessage(name: string): string {
  return `Bonjour ${site.name} 👋 Je souhaite réserver *${name}* du ___ au ___. Est-ce disponible ?`;
}

/** Pre-filled booking message that includes chosen dates (used by /reserver). */
export function bookingMessageWithDates(
  name: string,
  from: string,
  to: string,
): string {
  const start = from || "___";
  const end = to || "___";
  return `Bonjour ${site.name} 👋 Je souhaite réserver *${name}* du ${start} au ${end}. Est-ce disponible ?`;
}

/** Generic "start a conversation" message for the floating button / contact page. */
export function generalMessage(): string {
  return `Bonjour ${site.name} 👋 J'aimerais des informations sur vos locations.`;
}

/** Email fallback (mailto:) for the booking hub — prefilled subject + body. */
export function bookingMailto(name: string, from: string, to: string): string {
  const subject = `Demande de réservation — ${name}`;
  const body = `Bonjour ${site.name},\n\nJe souhaite réserver ${name} du ${from || "___"} au ${to || "___"}.\nMerci de me confirmer la disponibilité.\n\nCordialement,`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
