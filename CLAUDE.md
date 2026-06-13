# CLAUDE.md — Projet « Brasseries de Suisse » (v1)

> **Version 1 : stack + Git Flow + conventions.**
> Posée en tout premier, avant même le DESIGN.md.

## Description

Application web pédagogique de la séance d'introduction au vibe coding du C822 (15 juin 2026). Une carte interactive qui affiche toutes les brasseries répertoriées en Suisse sur OpenStreetMap.

## Stack imposée

- **HTML5 + CSS3 + JavaScript ES6+ pur**. **Aucun framework** (pas de React, Vue, Svelte, etc.).
- **Leaflet** pour la carte, en librairie **self-hostée** dans `libs/` (jamais de CDN externe).
- **OpenStreetMap Overpass API** pour les données, un seul `fetch` POST au chargement.
- **`@playwright/test`** pour les tests e2e + **`live-server`** via `npx` pour le dev local.
- **Node 20+** pour l'outillage.
- **Plateforme** : Windows + WebStorm (terminal PowerShell par défaut).

## Conventions de code

- **Variables, fonctions, classes, fichiers** : en **anglais**, `camelCase` pour JS, `kebab-case` pour les fichiers HTML/CSS.
- **Commentaires** et chaînes affichées à l'utilisateur : en **français**.
- Pas de `console.log` qui traîne au commit. Pas de code mort.
- Console navigateur **propre** : 0 erreur, 0 warning à la fermeture.

## Conventions Git

- **`main` est protégée** : aucun commit direct, tout passe par Pull Request.
- Branches `feat/<slug>` (nouvelles fonctionnalités) et `fix/<slug>` (corrections de bugs) uniquement.
- **Messages de commit en français**, format Conventional Commits : `feat:`, `fix:`, `docs:`, `test:`.
- Référencer l'issue dans le commit : `closes #N` ferme l'issue au merge.
- Une PR = un sujet net, mergeable indépendamment des autres.
