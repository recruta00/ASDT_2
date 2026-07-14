import { site } from "@/config/site";

/** "800 MAD" — grouped French format. */
export function mad(value: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(value)} MAD`;
}

/** "≈ 75 €" — tourist anchor, rounded to a friendly number. */
export function approxEur(madValue: number): string {
  const eur = madValue * site.eurRate;
  const rounded = eur >= 100 ? Math.round(eur / 5) * 5 : Math.round(eur);
  return `≈ ${new Intl.NumberFormat("fr-FR").format(rounded)} €`;
}

/** "800 MAD ≈ 75 €" — the market prices in euros; we win the comparison. */
export function dualPrice(madValue: number): string {
  return `${mad(madValue)} ${approxEur(madValue)}`;
}
