"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { site } from "@/config/site";
import { routes } from "@/config/routes";
import { flagshipBike } from "@/data/bikes";
import { getProperty } from "@/data/properties";
import { whatsappUrl, generalMessage, bookingMessage } from "@/lib/whatsapp";
import { mad, approxEur } from "@/lib/price";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";

/**
 * Sticky mobile conversion bar — context-aware: on money pages it shows the
 * item + price and opens an item-specific prefilled WhatsApp chat (the
 * documented highest-lift mobile pattern needs price context to work).
 * Appears after the hero scrolls out; mobile only.
 */
function usePageContext() {
  const pathname = usePathname();
  const bike = flagshipBike();

  if (pathname === routes.bikes || pathname === routes.bike(bike.slug)) {
    return {
      label: `X-ADV 750 · ${mad(bike.pricePerDay)} ${approxEur(bike.pricePerDay)}/j`,
      message: bookingMessage(bike.name),
      cta: "Je vérifie",
    };
  }
  const stayMatch = pathname.match(/^\/sejours\/([^/]+)$/);
  if (stayMatch) {
    const property = getProperty(stayMatch[1]);
    if (property) {
      return {
        label: `${property.name} · dès ${mad(property.pricePerNight)}/nuit`,
        message: bookingMessage(property.name),
        cta: "Je vérifie",
      };
    }
  }
  return {
    label: null,
    message: generalMessage(),
    cta: "Réserver sur WhatsApp",
  };
}

export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const { label, message, cta } = usePageContext();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      {label ? (
        <p className="mb-2 truncate text-center font-spec text-ink/70">{label}</p>
      ) : null}
      <div className="flex gap-3">
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ember px-4 py-3 text-sm font-medium text-abyss transition-colors hover:bg-ember-hi"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {cta}
        </a>
        <a
          href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`}
          aria-label={`Appeler ${site.name}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/20 text-ink"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
