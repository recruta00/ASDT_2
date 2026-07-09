# TODO — à compléter avant mise en ligne

Ce fichier liste tout ce qui utilise une valeur de démonstration (placeholder) et
doit être confirmé. La plupart se règle dans **un seul fichier** : `src/config/site.ts`.

## 1. Coordonnées & informations agence — `src/config/site.ts`

| Clé | Valeur actuelle (placeholder) | À faire |
|---|---|---|
| `phoneDisplay` | `+212 6 00 00 00 00` | mettre le vrai numéro affiché |
| `whatsappNumber` | `212600000000` | vrai numéro WhatsApp, format international, chiffres uniquement |
| `email` | `contact@recrutarent.com` | vraie adresse e-mail |
| `address` / `streetAddress` / `postalCode` | `Guéliz, Marrakech` / `40000` | adresse réelle complète |
| `instagramUrl` | `https://instagram.com/recrutarent` | vrai profil Instagram |
| `domain` | `https://recrutarent.com` | domaine définitif (impacte canonical, sitemap, OG) |
| `geo` | `31.6295, -7.9811` | coordonnées GPS exactes (fiche LocalBusiness) |
| `openingHours` / `openingHoursLabel` | Lun–Sam 9h–20h · Dim 10h–18h | confirmer les horaires réels |
| `mapEmbedUrl` | *(vide)* | coller une URL d'intégration Google Maps pour afficher la carte sur `/contact` |

## 2. Prix & données — à confirmer

Tous les prix de démonstration sont marqués `// TODO: confirm` dans le code.

- **Motos** — `src/data/bikes.ts` : `pricePerDay` et `deposit` des 6 véhicules.
- **Logements** — `src/data/properties.ts` : `pricePerNight` et `deposit` des 6 logements.
- Vérifier aussi caractéristiques (année, cylindrée, chambres, surface, équipements).

## 3. Photos (optionnel — le site est fini sans)

Des visuels en traits SVG s'affichent tant qu'aucune photo n'est fournie.

- Déposer les fichiers dans `public/images/bikes/` et `public/images/stays/`.
- Renseigner le tableau `images: []` de chaque élément dans `bikes.ts` / `properties.ts`.
- (Optionnel) Génération d'un jeu de photos cinématiques via Higgsfield MCP — à valider.

## 4. Contrats de location (PDF)

- Déposer les PDF dans `public/contrats/`.
- Dé-commenter le bloc de liens de téléchargement dans `src/app/conditions/page.tsx`.

## 5. Textes légaux

- Faire relire `/conditions` et `/confidentialite` par une personne compétente
  (mentions légales locales, politique de confidentialité).

## 6. Bilingue (plus tard, non bloquant)

- Une version anglaise (`/en/...`) + `hreflang` est préparée par `src/config/routes.ts`
  mais n'est pas implémentée en v1. À activer sur demande.
