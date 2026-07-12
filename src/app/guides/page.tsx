import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Guides moto & séjours à Marrakech",
  description: `Permis, itinéraires Atlas, Agafay et Essaouira : nos guides pratiques pour rouler et séjourner à ${site.city} comme un local.`,
  alternates: { canonical: routes.guides },
};

const guides = [
  {
    href: routes.guidePermis,
    tag: "Pratique",
    title: "Quel permis pour louer une moto à Marrakech ?",
    lead: "50 cm³, 125, maxi-scooter, X-ADV 750 : les règles pour les visiteurs, permis étrangers inclus — et notre politique, noir sur blanc.",
  },
  {
    href: routes.guideOurika,
    tag: "Itinéraire",
    title: "Atlas & vallée de l'Ourika à moto",
    lead: "La boucle d'une journée la plus gratifiante au départ de Marrakech : virages, villages berbères et déjeuner au bord de l'oued.",
  },
  {
    href: routes.guideEssaouira,
    tag: "Itinéraire",
    title: "Marrakech → Essaouira à moto",
    lead: "190 km jusqu'à l'océan : la route, les pauses qui valent le coup, le vent — et pourquoi le X-ADV est taillé pour cet aller-retour.",
  },
  {
    href: routes.guideAgafay,
    tag: "Itinéraire",
    title: "Le désert d'Agafay à moto",
    lead: "À 45 minutes de la ville, un désert de pierre pour un coucher de soleil inoubliable. Demi-journée parfaite, terrain compris.",
  },
];

export default function GuidesPage() {
  return (
    <main id="main">
      <PageHeader
        breadcrumb={[{ label: "Accueil", href: routes.home }, { label: "Guides" }]}
        eyebrow="Conseils de locaux"
        title="Guides moto & séjours à Marrakech"
        lead="Ce que nous expliquons chaque semaine à nos clients, posé noir sur blanc : les règles, les routes, les bonnes adresses."
      />
      <Container className="pb-24 pt-14">
        <div className="grid gap-6 md:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="card-glass group flex flex-col p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              <span className="font-spec text-ink/70">{g.tag}</span>
              <h2 className="font-display mt-3 text-xl font-bold text-ink">
                {g.title}
              </h2>
              <p className="mt-2 flex-1 text-ink/70">{g.lead}</p>
              <span className="mt-5 font-spec text-ink transition-transform group-hover:translate-x-1">
                Lire le guide →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
