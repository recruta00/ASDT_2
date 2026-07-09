"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { ButtonAnchor } from "@/components/ui/Button";

export type BookingOption = { slug: string; name: string };

function buildMessage(customer: string, item: string, from: string, to: string) {
  const who = customer.trim() ? `Je suis ${customer.trim()}. ` : "";
  return `Bonjour ${site.name} 👋 ${who}Je souhaite réserver *${item}* du ${from || "___"} au ${to || "___"}. Est-ce disponible ?`;
}

/** Booking form for one category — builds the WhatsApp deep link + email fallback.
 *  No backend in v1; a server action / API would slot in where noted in the README. */
export function BookingForm({
  options,
  unitLabel,
}: {
  options: BookingOption[];
  unitLabel: string;
}) {
  const [item, setItem] = useState(options[0]?.name ?? "");
  const [customer, setCustomer] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const message = buildMessage(customer, item, from, to);
  const waUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const subject = `Demande de réservation — ${item}`;
  const mailUrl = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  const field =
    "w-full rounded-xl border border-[color:var(--line)] bg-abyss px-4 py-3 text-bone placeholder:text-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember";
  const label = "font-spec text-mist";

  return (
    <div className="card-glass p-6 md:p-8">
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="bk-item" className={label}>
            {unitLabel}
          </label>
          <select
            id="bk-item"
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
            <label htmlFor="bk-from" className={label}>
              Du
            </label>
            <input
              id="bk-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={field}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="bk-to" className={label}>
              Au
            </label>
            <input
              id="bk-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="bk-name" className={label}>
            Votre nom (facultatif)
          </label>
          <input
            id="bk-name"
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
        <p className="text-center font-spec text-mist">
          Aucun paiement en ligne — on confirme ensemble la disponibilité.
        </p>
      </div>
    </div>
  );
}
