import { ButtonAnchor } from "@/components/ui/Button";
import { whatsappUrl, bookingMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/cx";
import { approxEur } from "@/lib/price";
import { site } from "@/config/site";
import { Reassurance } from "./Reassurance";

/** Price block + primary WhatsApp booking CTA (spec §7.3). Static deep link. */
export function BookingCta({
  name,
  price,
  unit,
  deposit,
  kind = "bike",
}: {
  name: string;
  price: number;
  unit: string;
  deposit: number;
  kind?: "bike" | "stay";
}) {
  return (
    <div className="card-glass p-6">
      <p className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-ink">
          {formatPrice(price, site.currency)}
        </span>
        <span className="font-spec text-ink/70">
          {approxEur(price)} / {unit}
        </span>
      </p>
      <p className="mt-1.5 font-spec text-ink/70">
        Caution {formatPrice(deposit, site.currency)} {approxEur(deposit)} —{" "}
        {kind === "stay" ? "restituée en fin de séjour" : "restituée au retour"}
      </p>
      <ButtonAnchor
        href={whatsappUrl(bookingMessage(name))}
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        className="mt-5 w-full"
      >
        Je vérifie la disponibilité
      </ButtonAnchor>
      <p className="mt-3 text-center font-spec text-ink/70">
        {site.whatsappResponse} · sans engagement
      </p>
      <Reassurance kind={kind} />
    </div>
  );
}
