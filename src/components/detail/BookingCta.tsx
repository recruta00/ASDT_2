import { ButtonAnchor } from "@/components/ui/Button";
import { whatsappUrl, bookingMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/cx";
import { site } from "@/config/site";

/** Price block + primary WhatsApp booking CTA (spec §7.3). Static deep link. */
export function BookingCta({
  name,
  price,
  unit,
  deposit,
}: {
  name: string;
  price: number;
  unit: string;
  deposit: number;
}) {
  return (
    <div className="card-glass p-6">
      <p className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-ember">
          {formatPrice(price, site.currency)}
        </span>
        <span className="font-spec text-mist">/ {unit}</span>
      </p>
      <p className="mt-1.5 font-spec text-mist">
        Caution {formatPrice(deposit, site.currency)}
      </p>
      <ButtonAnchor
        href={whatsappUrl(bookingMessage(name))}
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        className="mt-5 w-full"
      >
        Réserver sur WhatsApp
      </ButtonAnchor>
      <p className="mt-3 text-center font-spec text-mist">
        {site.whatsappResponse} · sans engagement
      </p>
    </div>
  );
}
