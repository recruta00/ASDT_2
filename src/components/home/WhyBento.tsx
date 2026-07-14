import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";

const cells = [
  {
    title: "Une machine révisée",
    body: "Le X-ADV passe un contrôle complet avant chaque remise : pneus, freins, niveaux. Vous partez l'esprit tranquille.",
    span: "lg:col-span-2",
  },
  {
    title: "Check-in flexible",
    body: "Arrivée tardive, départ matinal : on s'adapte autant que possible à votre programme.",
    span: "",
  },
  {
    title: "Caution claire",
    body: "Un montant annoncé à l'avance, restitué intégralement au retour. Aucune surprise.",
    span: "",
  },
  {
    title: "Support humain",
    body: "Une vraie personne au bout du fil, 7j/7, qui connaît Marrakech et ses raccourcis.",
    span: "lg:col-span-2",
  },
];

/** "Why Recruta Rent" — bento grid (spec §7.1.6). Short, factual. */
export function WhyBento() {
  return (
    <section aria-labelledby="why-title" className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Pourquoi Recruta Rent"
          title="Le confort d'un ami sur place"
          titleId="why-title"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell, i) => (
            <MotionReveal
              key={cell.title}
              delay={i * 0.06}
              className={cell.span}
            >
              <div className="card-glass h-full p-7">
                <span aria-hidden className="seam-rule" />
                <h3 className="font-display mt-4 text-lg font-bold text-ink">
                  {cell.title}
                </h3>
                <p className="mt-2 text-ink/70">{cell.body}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
