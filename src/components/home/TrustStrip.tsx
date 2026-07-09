import { Container } from "@/components/ui/Container";

const items = [
  "Réponse rapide sur WhatsApp",
  "Caution transparente",
  "Contrats clairs",
  "Assistance 7j/7",
];

/** Trust strip in the mono voice (spec §7.1.2). Honest claims only. */
export function TrustStrip() {
  return (
    <section aria-label="Nos engagements" className="border-y border-[color:var(--line)] bg-ink/40">
      <Container className="py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-6">
              {i > 0 && <span aria-hidden className="hidden text-ember/60 sm:inline">·</span>}
              <span className="font-spec text-mist">{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
