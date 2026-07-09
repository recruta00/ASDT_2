# Recruta Rent

Site vitrine de **Recruta Rent** — agence de location de **motos & scooters** et
d'**appartements & villas** à **Marrakech**. Objectif unique : qu'un visiteur choisisse
un véhicule ou un logement et démarre une conversation WhatsApp en moins de 60 secondes.

Pas de backend ni de paiement en v1 : toute la conversion passe par des **liens WhatsApp**
pré-remplis, avec un repli e-mail.

---

## Stack

- **Next.js 16** (App Router, TypeScript, génération statique / SSG)
- **Tailwind CSS v4** (tokens de design en variables CSS dans `globals.css`)
- **Framer Motion** — utilisé uniquement par le hero « Éditorial » (`/direction-b`) ;
  le reste du site anime en CSS pour rester léger
- **next/font** (Unbounded, Inter, IBM Plex Mono, auto-hébergées, `display: swap`)
- **next/image** pour toutes les images (aucun hotlink externe)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (SSG)
npm run start    # sert le build de production
npm run lint     # ESLint
```

## Structure

```
src/
  app/                 # routes (App Router) + sitemap.ts / robots.ts / manifest.ts
    page.tsx           # Accueil — direction A (« Showroom Nocturne »)
    direction-b/       # Accueil — direction B (« Éditorial »), temporaire, noindex
    motos/ , sejours/  # catalogues + pages détail [slug] (generateStaticParams)
    reserver/ a-propos/ faq/ contact/ conditions/ confidentialite/
  components/          # design system (ui/), layout/, home/, catalog/, detail/, cards/
  config/
    site.ts            # ⭐ TOUS les placeholders (contact, ville, etc.) — un seul fichier
    routes.ts          # carte centrale des routes (prête pour un /en + hreflang)
  data/
    bikes.ts           # 6 motos/scooters
    properties.ts      # 6 appartements/villas
    faq.ts             # 12 questions groupées
    conditions.ts      # résumés de conditions de location
  lib/
    whatsapp.ts        # construction des liens WhatsApp
    jsonld.ts          # schémas JSON-LD (SEO)
    specs.ts           # lignes de specs mono (cc/année ↔ m²/chambres)
public/images/         # brand/ (image OG) ; bikes/ & stays/ (photos à ajouter)
```

## Où éditer le contenu

- **Coordonnées, ville, devise, réseaux** → `src/config/site.ts` (un seul endroit).
- **Motos / scooters** → `src/data/bikes.ts`. **Logements** → `src/data/properties.ts`.
  Les prix de démonstration sont marqués `// TODO: confirm` (voir `TODO.md`).
- **FAQ** → `src/data/faq.ts`. **Conditions** → `src/data/conditions.ts`.

## Comment sont construits les liens WhatsApp

`src/lib/whatsapp.ts` produit `https://wa.me/{WHATSAPP_NUMBER}?text={message encodé}`.
Le numéro vient de `site.whatsappNumber` (format international, chiffres uniquement).
Sur une fiche produit, le message est pré-rempli en français, ex. :

> Bonjour Recruta Rent 👋 Je souhaite réserver *Honda PCX 125* du ___ au ___. Est-ce disponible ?

La page `/reserver` construit le même lien à partir d'un choix + dates + nom, avec un
repli `mailto:`. **Où brancher un backend plus tard :** remplacer le lien direct dans
`src/components/booking/BookingForm.tsx` par une Server Action / route API.

## Ajouter des photos

Les emplacements `next/image` sont déjà câblés (`src/components/ui/Media.tsx`). Tant
qu'aucune photo n'est fournie, un visuel en **traits SVG** (moto / villa) s'affiche —
le site paraît fini sans photo. Pour ajouter de vraies photos :

1. Déposez les fichiers dans `public/images/bikes/` ou `public/images/stays/`.
2. Renseignez le tableau `images: []` de l'élément concerné (`bikes.ts` / `properties.ts`).

## Attacher les contrats PDF

1. Déposez les PDF dans `public/contrats/` (ex. `contrat-location-moto.pdf`).
2. Dans `src/app/conditions/page.tsx`, dé-commentez le bloc de liens de téléchargement.

## SEO

Metadata par route (titres ≤ 60, descriptions, canonical), JSON-LD (LocalBusiness,
WebSite, Product/Offer, Accommodation, FAQPage, BreadcrumbList), `sitemap.xml`,
`robots.txt`, `manifest.webmanifest`, Open Graph + Twitter, favicon et image OG de marque.

## Deux directions de design

L'accueil est livré en deux directions à comparer, partageant tout le contenu sous la
ligne de flottaison :

- **A — « Showroom Nocturne »** (`/`) : hero split interactif RIDE | STAY, la Seam glisse au survol.
- **B — « Éditorial »** (`/direction-b`) : grand lettrage RIDE/STAY cousu par la Seam, curseur magnétique.

Un sélecteur A/B flottant permet de basculer. Une fois la direction choisie, supprimer
la perdante, promouvoir la gagnante sur `/`, et retirer le sélecteur.

## Audit Lighthouse

Sur un build de production (`npm run start`), les pages Accueil, `/motos` et une page
détail obtiennent **≥ 95** en Performance / Accessibilité / SEO (et 100 en Bonnes pratiques).

## À faire (voir `TODO.md`)

Confirmer les coordonnées réelles, valider les prix, brancher la carte, ajouter les
photos et les PDF de contrats. La version anglaise (`/en`) est préparée par `routes.ts`
mais non implémentée en v1.
