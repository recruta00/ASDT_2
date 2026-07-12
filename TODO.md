# TODO — à compléter avant mise en ligne

La plupart des valeurs se règlent dans **un seul fichier** : `src/config/site.ts`.

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

## 2. Prix & données — à confirmer (`// TODO: confirm` dans le code)

- **X-ADV 750** — `src/data/bikes.ts` : les **paliers dégressifs** `priceTiers`
  (800 / 750 / 700 MAD selon la durée ?), `deposit` (8 000 MAD ?), politique
  kilométrique, âge minimum (21 ans), conditions d'annulation (48 h).
- **Taux EUR affiché** — `src/config/site.ts` : `eurRate: 0.093` (prix « ≈ XX € »
  affichés partout). Ajuster si le taux bouge sensiblement.
- **Logements** — `src/data/properties.ts` : `pricePerNight` et `deposit` des 6 logements.
- **Guide permis** — `src/app/guides/permis-moto-maroc/page.tsx` : faire relire
  la section « règles par catégorie » par le propriétaire / un juriste avant mise en ligne.

## 3. Créatifs Higgsfield restants (limite journalière — à relancer demain)

Fait aujourd'hui : nouveau shot studio du X-ADV « new style » (argent, lames LED,
fourche or, antibrouillards ronds — job `27608a62-be79-4e36-9de1-78acfdd92f30`) +
vidéo d'ambiance Seedance branchée en attendant mieux (`public/videos/hero-xadv.mp4`).

Dès que la limite quotidienne se réinitialise (dans l'ordre choisi par le client) :

1. **Vidéo hero en Veo 3.1 ultra** (le rendu Seedance actuel est trop « CG ») :
   `generate_video` modèle `veo3_1`, variant `veo-3-1-preview`, quality `ultra`,
   6 s, 16:9 (~65 crédits) — prompt photoréaliste prêt dans l'historique (tracking shot
   X-ADV argent, médina de Marrakech la nuit, lanternes, réalisme documentaire).
   Remplacer simplement `public/videos/hero-xadv.mp4` par le nouveau fichier.
2. **Photo STAY « luxe Marrakech »** (demande client) : remplacer l'actuelle image
   de villa (trop « resort de plage ») par une villa de la Palmeraie au crépuscule —
   murs ocre en pisé, arches mauresques, piscine turquoise, lanternes en laiton,
   palmiers, silhouette de l'Atlas, lumière dorée aux fenêtres (cinematic_studio_2_5,
   16:9, 2K, ~2 crédits). Écraser `public/images/stays/hero-villa-dusk.webp`
   (même nom de fichier → hero + bandeau CTA mis à jour automatiquement), puis
   vider `.next/cache/images`.
3. **Photos des 6 logements + photo « à propos »** (~14 crédits) : mêmes prompts
   cinématiques que la villa (voir style suffix dans l'historique de commits).

## 4. Photos réelles (optionnel)

Déposer dans `public/images/bikes/` ou `public/images/stays/` puis renseigner
`images: []` de l'élément concerné. Les visuels en traits SVG comblent les manques.

## 5. Contrats de location (PDF)

- Déposer les PDF dans `public/contrats/`.
- Dé-commenter le bloc de liens dans `src/app/conditions/page.tsx`.

## 6. Textes légaux

- Faire relire `/conditions` et `/confidentialite` (mentions légales locales).

## 7. Bilingue (plus tard, non bloquant)

- La version anglaise (`/en/...`) + `hreflang` est préparée par `src/config/routes.ts`
  mais n'est pas implémentée en v1.
