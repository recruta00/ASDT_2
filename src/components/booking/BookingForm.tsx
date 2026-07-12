"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { site } from "@/config/site";
import { ButtonAnchor } from "@/components/ui/Button";
import { Reassurance } from "@/components/detail/Reassurance";

export type BookingOption = { slug: string; name: string };

const subscribeNoop = () => () => {};

function buildMessage(customer: string, item: string, from: string, to: string) {
  const who = customer.trim() ? `Je suis ${customer.trim()}. ` : "";
  return `Bonjour ${site.name} 👋 ${who}Je souhaite réserver *${item}* du ${from || "___"} au ${to || "___"}. Est-ce disponible ?`;
}

/** Booking form for one category — builds the WhatsApp deep link + email fallback.
 *  Ids are instance-scoped via useId because /reserver mounts two of these inside
 *  the tab switcher. No backend in v1; a server action would slot in here later. */
export function BookingForm({
  options,
  unitLabel,
}: {
  options: BookingOption[];
  unitLabel: string;
}) {
  const uid = useId();
  const [item, setItem] = useState(options[0]?.name ?? "");
  const [customer, setCustomer] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // min= resolves to the visitor's date only on the client; the server snapshot
  // is "" so prerendered HTML never disagrees with the visitor's clock.
  const today = useSyncExternalStore(
    subscribeNoop,
    () => new Date().toISOString().slice(0, 10),
    () => "",
  );

  function onFromChange(value: string) {
    setFrom(value);
    if (to && value && to < value) setTo(value);
  }

  const message = buildMessage(customer, item, from, to);
  const waUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const subject = `Demande de réservation — ${item}`;
  const mailUrl = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  const field =
    "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember";
  const label = "font-spec text-ink/70";

  return (
    <div className="card-glass p-6 md:p-8">
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor={`${uid}-item`} className={label}>
            {unitLabel}
          </label>
          <select
            id={`${uid}-item`}
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className={field}
          >
            {options.map((o) => (
              <option key={o.slug} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor={`${uid}-from`} className={label}>
              Du
            </label>
            <input
              id={`${uid}-from`}
              type="date"
              value={from}
              min={today || undefined}
              onChange={(e) => onFromChange(e.target.value)}
              className={field}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor={`${uid}-to`} className={label}>
              Au
            </label>
            <input
              id={`${uid}-to`}
              type="date"
              value={to}
              min={from || today || undefined}
              onChange={(e) => setTo(e.target.value)}
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor={`${uid}-name`} className={label}>
            Votre nom (facultatif)
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Prénom Nom"
            className={field}
          />
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <ButtonAnchor
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="flex-1"
          >
            Réserver sur WhatsApp
          </ButtonAnchor>
          <ButtonAnchor href={mailUrl} variant="secondary" size="lg" className="flex-1">
            Envoyer par e-mail
          </ButtonAnchor>
        </div>
        <p className="text-center font-spec text-ink/70">
          Aucun paiement en ligne — on confirme ensemble la disponibilité.
        </p>
        <div className="mx-auto">
          <Reassurance />
        </div>
      </div>
    </div>
  );
}
