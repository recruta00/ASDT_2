/** Tiny className joiner — filters falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Format a price in the site currency, e.g. 250 → "250 MAD". */
export function formatPrice(value: number, currency: string): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} ${currency}`;
}
