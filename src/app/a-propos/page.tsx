import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BikeGlyph, VillaGlyph } from "@/components/art/Glyphs";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "À propos de l'agence",
  description: `Recruta Rent, une agence de location de motos et de villas à ${site.city}, née de deux passions : la route et la maison. Découvrez notre histoire.`,
  alternates: { canonical: routes.about },
};

const values = [
  { title: "La confiance d'abord", body: "Prix, cautions et conditions annoncés clairement, avant que vous ne vous engagiez." },
  { title: "Le soin du détail", body: "Motos révisées, logements impeccables, réponses précises. On ne laisse rien au hasard." },
  { title: "L'humain au bout du fil", body: "Une vraie personne qui connaît la ville et répond vite, pas un formulaire anonyme." },
];

export default function AProposPage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[{ label: "Accueil", href: routes.home }, { label: "À propos" }]}
        eyebrow="L'agence"
        title="Deux passions : la route et la maison"
        lead={site.tagline}
      />
      <Container className="pb-24 pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-xl space-y-5 text-mist">
            <p>
              Recruta Rent est née d&apos;une idée simple : à {site.city}, louer une
              moto ou trouver un beau logement devrait être aussi facile qu&apos;un
              message à un ami sur place.
            </p>
            <p>
              D&apos;un côté, la <span className="text-bone">route</span> — le plaisir
              de filer vers l&apos;Atlas au lever du jour, casque sur la tête. De
              l&apos;autre, la <span className="text-bone">maison</span> — le bonheur de
              poser ses valises dans une adresse choisie, du studio au Guéliz à la villa
              avec piscine dans la Palmeraie.
            </p>
            <p>
              Nous avons réuni ces deux mondes sous un même toit, avec la même exigence :
              des véhicules et des logements que nous serions fiers d&apos;offrir à nos
              proches, une caution transparente, et une réponse rapide quand vous en avez
              besoin. Pas de mauvaise surprise, pas de jargon — juste des locations bien
              faites et des séjours réussis.
            </p>
            <p className="text-bone">Bienvenue chez Recruta Rent.</p>
          </div>

          {/* Photo slot — line-art placeholder until a real photo is added. */}
          <div className="glow-ember texture-noise relative flex aspect-[4/3] items-center justify-center gap-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-ink">
            <BikeGlyph aria-hidden className="h-28 w-44 text-bone/25" />
            <span aria-hidden className="h-24 w-px rotate-[-12deg] bg-ember/70" />
            <VillaGlyph aria-hidden className="h-28 w-44 text-bone/25" />
          </div>
        </div>

        <section aria-labelledby="values-title" className="mt-20">
          <Eyebrow>Nos valeurs</Eyebrow>
          <h2 id="values-title" className="font-display mt-3 text-2xl font-bold text-bone">
            Ce à quoi vous pouvez compter
          </h2>
          <span aria-hidden className="seam-rule mt-4" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card-glass p-7">
                <h3 className="font-display text-lg font-bold text-bone">{v.title}</h3>
                <p className="mt-2 text-mist">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="coverage-title" className="mt-16">
          <h2 id="coverage-title" className="font-spec text-mist">
            Zone de couverture
          </h2>
          <p className="mt-3 max-w-2xl text-bone">
            Nous livrons motos et scooters, et accueillons nos hôtes, dans tout{" "}
            {site.city} : Guéliz, Hivernage, médina, Palmeraie et environs. Une adresse
            en dehors de ces zones ? Écrivez-nous, on trouve une solution.
          </p>
        </section>
      </Container>
    </main>
  );
}
