import { site } from "@/config/site";

/**
 * WhatsApp deep-link builders — the site's single conversion mechanism.
 * Every prefill names the exact item + intent so the first human reply can
 * already answer availability, and carries a discreet source tag so the
 * owner can see which page converts without any analytics backend.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Booking intent for a named bike or property (detail pages, cards). */
export function bookingMessage(name: string): string {
  return `Bonjour ${site.name} 👋 Je souhaite réserver *${name}* du ___ au ___. Est-ce disponible ?`;
}

/** Tier-specific booking intent ("3 jours et +" row clicked). */
export function bookingMessageForTier(name: string, tierLabel: string): string {
  return `Bonjour ${site.name} 👋 Je souhaite réserver *${name}* (${tierLabel}) du ___ au ___. Est-ce disponible ?`;
}

/** Booking with chosen dates (used by /reserver). */
export function bookingMessageWithDates(
  name: string,
  from: string,
  to: string,
): string {
  const start = from || "___";
  const end = to || "___";
  return `Bonjour ${site.name} 👋 Je souhaite réserver *${name}* du ${start} au ${end}. Est-ce disponible ?`;
}

/** Question intent — low-commitment entry next to the decision FAQ. */
export function questionMessage(name: string): string {
  return `Bonjour ${site.name} 👋 J'ai une question à propos de *${name}*.`;
}

/** Generic "start a conversation" (floating button, contact page). */
export function generalMessage(): string {
  return `Bonjour ${site.name} 👋 J'aimerais des informations sur vos locations.`;
}

/** Email fallback (mailto:) for the booking hub. */
export function bookingMailto(name: string, from: string, to: string): string {
  const subject = `Demande de réservation — ${name}`;
  const body = `Bonjour ${site.name},\n\nJe souhaite réserver ${name} du ${from || "___"} au ${to || "___"}.\nMerci de me confirmer la disponibilité.\n\nCordialement,`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
