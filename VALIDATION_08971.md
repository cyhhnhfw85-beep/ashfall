# ASHFALL 0.8.9.71 — Validation (Chromium)

## Portée

- Base 0.8.9.70 ; version runtime et cache PWA : 0.8.9.71.
- 150 contrôles ciblés sur quatre dimensions mobiles (320×700, 390×844, 416×896, 430×932) : UI, Gardien, ancienne sauvegarde, trois phases, salves, projectiles hostiles, progression, victoire, attribution unique du bonus, absence d’erreurs de script, ressources et médias préservés.
- 119 contrôles de régression indépendants sur trois dimensions : aspiration automatique des ressources, conservation des équipements, ancien bonus de magnétisme, rechargement, économie, illustrations, sauvegardes, et scripts.
- `node --check game.js` et `node --check immersion.js` réussis.
- Les ressources `assets/` comparées bit à bit aux ressources de 0.8.9.70.

## Compatibilité

- La clé `ashfall_pwa_v1` et le schéma de sauvegarde restent identiques.
- Les anciennes sentinelles gardiennes encore vivantes sont reconnues dans leur salle de boss sans migration destructive.
- Les coffres restent à 900 / 2800 / 7500 crédits. Le bonus Gardien reste à 450 crédits lors de sa première victoire.

## Limites

- Tests de simulation automatisée sous Chromium, et non une expédition humaine entière sur Safari iPhone.
- Le nouvel équilibrage des phases du Gardien devra être évalué en conditions réelles ; sa récompense est restée stable.
