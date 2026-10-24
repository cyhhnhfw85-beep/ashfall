# ASHFALL 0.8.9.62 — Correctif images des coffres et mise à jour

## Problème corrigé
- Les neuf images (trois coffres, chacun fermé/en charge/ouvert) sont désormais intégrées directement dans `game.js` et ne dépendent plus du déploiement séparé du dossier `assets`. Cela corrige les symboles d’image manquante dans l’onglet Coffres et pendant l’animation si l’hébergeur ne publie pas les sous-dossiers.
- Nouveau cache PWA 08962 ; les fichiers principaux `game.css` et `game.js` utilisent des URL versionnées.
- Une alerte avertit si le HTML et le JavaScript ne correspondent pas à la même version.
- Prix de la 0.8.9.61 inchangés : commun 900, rare 2 800, épique 7 500 crédits.
- Animation inchangée : 1,6 s / 2,7 s / 4,3 s ; tirage et paiement atomiques.
- Mêmes sauvegardes `ashfall_pwa_v1`. Aucun changement des combats ou récompenses.

## Installation
1. Exporter une sauvegarde depuis le refuge.
2. Remplacer tous les fichiers de l’ancien jeu sur l’hébergement (y compris index.html, game.js, game.css, service-worker.js), sans placer le site dans un sous-dossier inattendu.
3. Ouvrir la page et vérifier `0.8.9.62` **et les prix 900 / 2 800 / 7 500**. Si les anciens prix restent affichés, le site est encore sur un ancien JavaScript : vider le cache de ce site/application ou réinstaller la PWA seulement après sauvegarde.
4. Ne pas confondre prix affichés et crédits possédés dans la sauvegarde ; les crédits de l’ancien jeu doivent rester disponibles.
