# Recruta Rent

Site vitrine de **Recruta Rent (RR)** — location du **Honda X-ADV 750 (2026)** et
d'**appartements & villas** à **Marrakech**. Objectif unique : qu'un visiteur choisisse
la machine ou un logement et démarre une conversation WhatsApp en moins de 60 secondes.

Pas de backend ni de paiement en v1 : toute la conversion passe par des **liens WhatsApp**
pré-remplis, avec un repli e-mail.

---

## Design

Thème **clair** (surfaces `--bone`, texte `--ink`) avec des ancres cinématiques sombres :
le hero photographique (X-ADV | villa, cousus par la **Seam**, la diagonale ember à −12°),
le bandeau CTA final et le footer. L'orange `--ember` est réservé aux CTA et aux formes
(jamais du texte sur fond clair — contraste AA garanti). Marque : monogramme **RR**
barré par la Seam (navbar + favicons).

Toute l'animation est en **CSS pur** (entrées du hero, marquee avec bouton pause,
ken-burns, reveals par `animation-timeline: view()`, zooms au survol) — aucune lib
d'animation, tout est coupé par `prefers-reduced-motion`.

## Stack

- **Next.js 16** (App Router, TypeScript, 100 % statique / SSG)
- **Tailwind CSS v4** (tokens dans `globals.css`)
- **next/font** (Unbounded, Inter, IBM Plex Mono) · **next/image** (AVIF/WebP)
- Zéro dépendance runtime au-delà de React/Next

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
  app/                 # routes + sitemap.ts / robots.ts / manifest.ts
    page.tsx           # Accueil (hero Seam photographique)
    motos/             # vitrine du X-ADV 750 + fiche détail [slug]
    sejours/           # catalogue filtrable + fiches détail [slug]
    guides/            # hub contenu SEO : permis + 3 itinéraires (Ourika, Agafay, Essaouira)
    reserver/ a-propos/ faq/ contact/ conditions/ confidentialite/
  components/          # design system (ui/), layout/, home/, catalog/, detail/, cards/, guides/
    MobileCtaBar.tsx   # barre CTA mobile contextuelle (prix + WhatsApp de la page en cours)
  config/
    site.ts            # ⭐ TOUS les placeholders + heroVideoSrc + eurRate — un seul fichier
    routes.ts          # carte centrale des routes (prête pour /en + hreflang)
  data/
    bikes.ts           # LA machine : Honda X-ADV 750 + paliers dégressifs + conditions
    properties.ts      # 6 appartements/villas
    faq.ts             # 12 questions groupées
    conditions.ts      # résumés des conditions
  lib/                 # whatsapp.ts (deep links), jsonld.ts (SEO), price.ts (MAD + ≈ EUR), specs.ts
public/images/         # bikes/ stays/ brand/ (OG composé localement)
```

## Conversion (issu d'une étude concurrentielle)

Les concurrents affichent leurs prix en euros ; les nôtres s'affichent partout en
**MAD + « ≈ XX € »** (`src/lib/price.ts`, taux dans `site.ts`). S'ajoutent : paliers
dégressifs 1–3 / 4–6 / 7 j+ avec lien WhatsApp par palier (`PriceTiers`), bloc
« Conditions claires, zéro surprise » (`RentalConditions`), FAQ anti-objections au
point de décision (`DecisionFaq`), rareté honnête (une seule machine), CTA à la
première personne (« Je vérifie la disponibilité ») et **barre CTA mobile**
contextuelle qui suit la page consultée (`MobileCtaBar`).

## La flotte : un seul modèle, volontairement

L'agence loue **uniquement le X-ADV 750**. `src/data/bikes.ts` contient une seule
entrée ; `/motos` est une page vitrine (specs, inclus, idées de virées) plutôt qu'un
catalogue. **Pour ajouter un modèle plus tard** : ajoutez un objet au tableau `bikes`
— la fiche `[slug]`, le sitemap, le JSON-LD et la réservation s'adaptent seuls
(la vitrine `/motos` présente `bikes[0]`, à généraliser à ce moment-là).

## Liens WhatsApp

`src/lib/whatsapp.ts` produit `https://wa.me/{numéro}?text={message pré-rempli}` :

> Bonjour Recruta Rent 👋 Je souhaite réserver *Honda X-ADV 750* du ___ au ___. Est-ce disponible ?

`/reserver` construit le même lien avec dates + nom, plus un repli `mailto:`.
**Brancher un backend plus tard** : remplacer le lien direct dans
`src/components/booking/BookingForm.tsx` par une Server Action.

## Vidéo du hero (emplacement prêt)

Déposez un mp4 dans `public/videos/` et renseignez `heroVideoSrc` dans
`src/config/site.ts`. La vidéo se monte en surcouche du panneau RIDE
(desktop uniquement, après idle, jamais sous `prefers-reduced-motion` —
le poster reste le LCP). Génération recommandée : voir `TODO.md` §3.

## SEO

Metadata par route (titres ≤ 60 avec prix et modèle exacts, canonical), JSON-LD
(LocalBusiness, WebSite, Product/Offer X-ADV, Accommodation, FAQPage — y compris
sur le guide permis —, BreadcrumbList), `sitemap.xml`, `robots.txt`,
`manifest.webmanifest`, OG photo composée localement (58 KB JPEG, compatible
aperçus WhatsApp), favicons RR. Le hub `/guides` (permis + itinéraires) vise les
requêtes longue traîne que les concurrents ne couvrent pas ; chaque guide se
termine par un bloc de conversion vers la machine.

## Audit Lighthouse (build de prod, mobile)

Accueil / `/motos` / fiche séjour : Performance ≥ 95, Accessibilité 100,
SEO 100, Bonnes pratiques 100.

## À faire (voir `TODO.md`)

Coordonnées réelles, prix à confirmer, reshoot du hero nocturne + vidéo Higgsfield
(limite journalière atteinte — commandes prêtes dans TODO), photos des logements,
PDF de contrats, carte Google Maps.
