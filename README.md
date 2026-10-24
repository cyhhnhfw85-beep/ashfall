# ASHFALL 0.8.9.78 — Correction des coffres gratuits

**ZIP complet jouable**, basé sur 0.8.9.77 Clean Core. Cette version est un correctif de cohérence : le niveau des armes de coffres gratuits dépend du secteur réel pour toute **nouvelle expédition**. Les anciens runs sauvegardés restent sous leur ancien régime de tirage. Voir `CHANGELOG_08978.md` et `VALIDATION_08978.md`.

## Installation
1. Dans le jeu existant, exporter d'abord la sauvegarde par « Sauvegarde ».
2. Déployer **tous** les fichiers du ZIP à la racine du **même site HTTPS**. Conserver exactement le même domaine / origine et ne pas vider les données locales.
3. Vérifier que `0.8.9.78` apparaît dans le jeu et recharger le cache via le contrôle de version si nécessaire.
4. Contrôler la reprise d'une partie en cours, l'ouverture d'un coffre, l'affichage du butin et l'état hors ligne sur le téléphone.

## Garanties ciblées
- `localStorage` reste à la clé `ashfall_pwa_v1` et au schéma `version:1` ; mêmes clés de secours et d'import/export.
- La nouvelle propriété facultative `freeChestLootRule` n'est présente que dans les nouvelles expéditions.
- Aucune règle de prix / rareté / combat / coffre payant / marchand n'a changé.

## Contenu
Moteur `game.js`, interface `index.html`, JS/CSS compagnons, service worker, manifeste, icônes et assets graphiques. Les documents historiques Clean Core sont conservés pour référence.
