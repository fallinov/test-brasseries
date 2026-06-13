# SPEC.md — Brasseries de Suisse

> Mini-spec : ce que l'app manipule (données) et ce qu'elle fait (fonctionnalités).
> Chaque fonctionnalité a un **critère de succès vérifiable** — pas de « ça marche à peu près ».

## Données

### Brasserie

| Champ | Type | Source OSM | Obligatoire |
|---|---|---|---|
| `id` | string | `id` OSM | oui |
| `name` | string | `tags.name` | non (« Brasserie sans nom » sinon) |
| `lat` | float | `lat` / `center.lat` | **oui** (sinon non affichée) |
| `lon` | float | `lon` / `center.lon` | **oui** (sinon non affichée) |
| `city` | string | `tags["addr:city"]` | non |
| `website` | string | `tags.website` | non |
| `type` | enum | `tags.craft` / `tags.microbrewery` / `tags.industrial` | non |

### État local (localStorage)

| Clé | Valeur | Effet |
|---|---|---|
| `visited_breweries` | `string[]` — liste d'IDs | Pin affichée avec la couleur « visited » au lieu de « primary » |

## Fonctionnalités minimales (PR 1 + PR 2 + PR 3)

| ID | Fonctionnalité | Critère de succès vérifiable |
|---|---|---|
| **F1** | Afficher la carte de la Suisse centrée, zoom 8, avec attribution OSM. | La page charge ; je vois la Suisse complète sans scroller la carte ; le mot « OpenStreetMap » est visible dans un coin. |
| **F2** | Afficher une pin pour chaque brasserie qui a des coordonnées. | ~271 pins visibles ; clic-droit sur une pin → la pin existe ; console propre (0 erreur). |
| **F3** | Popup au clic sur une pin : nom, ville (si connue), lien site (si connu, target=\"_blank\"). | Clic sur une pin → popup avec nom ; brasserie sans nom → « Brasserie sans nom » ; lien clic → nouvel onglet. |
| **F4** | Champ de recherche dans l'en-tête + compteur dans le pied de page. | Le champ a le placeholder de DESIGN.md ; le pied de page affiche « 271 brasseries affichées » au chargement. |
| **F5** | Filtre par nom (insensible casse + accents), en temps réel. | Je tape « lorraine » → 1 pin reste, compteur à 1 ; je tape « LÖRRACH » → cherche aussi « lorrach » ; effacer le champ → tout revient. |
| **F6** | Bouton « Marquer comme visitée » dans le popup. État persistant (`localStorage`). | Je clique sur le bouton → couleur de pin change ; je recharge la page → la pin reste de la couleur « visited ». |

## Règles métier transverses (issues de CLAUDE.md)

- Brasserie sans `lat`/`lon` → **non affichée**.
- Recherche : **insensible à la casse et aux accents**.
- État « visitée » : persistant via `localStorage` (clé `visited_breweries`).
- Reset complet : vider `localStorage` dans les DevTools (à mentionner si on touche à l'état).

## Hors-scope (pour cette séance)

- Édition / ajout / suppression de brasseries → pas de backend, on est en read-only.
- Authentification → aucune. App publique.
- Mode offline / cache des données Overpass → non.
- Multi-langue → français uniquement (UI).
