"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Conversion-action tracking (Vercel Web Analytics custom events).
 *
 * One capture-phase listener instead of onClick handlers everywhere: the
 * CTAs stay server components. Every WhatsApp / phone / email tap is
 * reported with the page it happened on, the CTA slot (`data-cta` when the
 * element declares one) and, for WhatsApp, the prefilled message — which
 * contains the bike/villa name, so per-item demand is visible for free.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.href;
      const page = window.location.pathname;
      const source = a.dataset.cta ?? "page";

      if (href.includes("wa.me")) {
        let message = "";
        try {
          message = (new URL(href).searchParams.get("text") ?? "").slice(0, 80);
        } catch {
          /* malformed href — still count the click */
        }
        track("whatsapp_click", { page, source, message });
      } else if (href.startsWith("tel:")) {
        track("phone_click", { page, source });
      } else if (href.startsWith("mailto:")) {
        track("email_click", { page, source });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
