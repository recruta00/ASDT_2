import type { Bike } from "@/data/types";
import { mad, approxEur } from "@/lib/price";
import { whatsappUrl, bookingMessageForTier } from "@/lib/whatsapp";

/**
 * Degressive price tiers — the daily rate anchors, longer rentals look like
 * the smart choice. Every row is its own prefilled WhatsApp entry point.
 * Only rates the business actually honors are listed (TODO-confirmed in data).
 */
export function PriceTiers({ bike }: { bike: Bike }) {
  const anchor = bike.priceTiers[0]?.perDay ?? bike.pricePerDay;
  return (
    <div className="overflow-hidden rounded-[20px] border border-ink/10 bg-white">
      {bike.priceTiers.map((tier, i) => {
        const saving = Math.round((1 - tier.perDay / anchor) * 100);
        return (
          <a
            key={tier.label}
            href={whatsappUrl(bookingMessageForTier(bike.name, tier.label))}
            target="_blank"
            rel="noopener noreferrer"
            className={
              "flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-bone" +
              (i > 0 ? " border-t border-ink/10" : "")
            }
          >
            <span className="flex items-center gap-2.5">
              <span className="font-spec text-ink/70">{tier.label}</span>
              {saving > 0 ? (
                <span className="rounded-full bg-ember px-2 py-0.5 font-spec text-[0.6rem] text-abyss">
                  −{saving}%
                </span>
              ) : null}
            </span>
            <span className="text-right">
              <span className="font-medium text-ink">{mad(tier.perDay)}</span>
              <span className="text-sm text-ink/70"> {approxEur(tier.perDay)} / jour</span>
            </span>
          </a>
        );
      })}
    </div>
  );
}
