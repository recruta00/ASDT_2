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

- **X-ADV 750** — `src/data/bikes.ts` : `pricePerDay` (800 MAD ?) et `deposit` (8 000 MAD ?),
  politique kilométrique, âge minimum (21 ans dans la FAQ/conditions).
- **Logements** — `src/data/properties.ts` : `pricePerNight` et `deposit` des 6 logements.

## 3. Créatifs Higgsfield restants (limite journalière atteinte — à relancer)

Le compte a atteint sa limite de génération quotidienne pendant la production.
Dès qu'elle est réinitialisée (~2 crédits/image, ~45 crédits la vidéo) :

- **Reshoot du hero nocturne X-ADV** : la première image de nuit générée montrait
  l'ancienne face avant (double optique ronde). Regénérer avec la photo de référence
  du client (X-ADV 2026 noir, bandeaux LED fins) importée comme référence d'identité.
  Média déjà importé côté Higgsfield : `media_id 5a13b08c-8e07-4bf5-9f3e-1ef2b7180205`
  (le shot studio, conforme au modèle 2026).
- **Vidéo d'ambiance du hero** (Seedance 2.0, ~45 crédits, 5 s, 16:9, 1080p, silencieuse) :
  prompt prêt = « tracking shot du X-ADV noir traversant une rue de Marrakech la nuit,
  lanternes chaudes, traînées orange » avec la même référence d'identité.
  Déposer le mp4 dans `public/videos/hero-xadv.mp4` puis renseigner
  `heroVideoSrc: "/videos/hero-xadv.mp4"` dans `src/config/site.ts` — l'emplacement
  est déjà câblé (desktop, lazy, reduced-motion géré).
- **Photos des 6 logements + photo « à propos »** (~14 crédits) : mêmes prompts
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
