import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";

const steps = [
  {
    n: "01",
    title: "Choisissez",
    body: "Parcourez la flotte ou les logements et repérez ce qui vous convient. Les prix et les cautions sont affichés clairement.",
  },
  {
    n: "02",
    title: "Confirmez sur WhatsApp",
    body: "Un message pré-rempli s'ouvre avec votre sélection. On vérifie la disponibilité et on cale les détails ensemble.",
  },
  {
    n: "03",
    title: "Profitez",
    body: "On vous livre la moto ou on vous remet les clés à l'heure convenue. Vous n'avez plus qu'à rouler ou à vous installer.",
  },
];

/** How it works — a genuine 3-step sequence, so numbered markers are earned (§7.1.5). */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="border-y border-[color:var(--line)] bg-ink/30 py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Simple, humain, rapide"
          title="Réserver en trois temps"
          titleId="how-title"
          align="center"
        />
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <MotionReveal as="li" key={step.n} delay={i * 0.1} className="relative">
              <div className="flex items-baseline gap-4">
                <span className="font-spec text-2xl text-ember">{step.n}</span>
                <span aria-hidden className="seam-rule mt-3 flex-1 !w-auto" />
              </div>
              <h3 className="font-display mt-5 text-xl font-bold text-bone">
                {step.title}
              </h3>
              <p className="mt-3 text-mist">{step.body}</p>
            </MotionReveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
