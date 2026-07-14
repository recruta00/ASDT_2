import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { ButtonAnchor } from "@/components/ui/Button";
import { whatsappUrl, questionMessage } from "@/lib/whatsapp";

/**
 * Objection-killer mini-FAQ placed right before the closing CTA — research
 * shows FAQ at the decision point converts; the /faq page stays for depth.
 */
export function DecisionFaq({
  items,
  itemName,
}: {
  items: AccordionItem[];
  itemName: string;
}) {
  return (
    <section aria-labelledby="decision-faq" className="rounded-[24px] border border-ink/10 bg-white/60 p-7 md:p-9">
      <h2 id="decision-faq" className="font-display text-xl font-bold text-ink">
        Les questions qu&apos;on nous pose avant de réserver
      </h2>
      <Accordion items={items} className="mt-4" />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <ButtonAnchor
          href={whatsappUrl(questionMessage(itemName))}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
        >
          Une autre question ? Posez-la sur WhatsApp
        </ButtonAnchor>
      </div>
    </section>
  );
}
