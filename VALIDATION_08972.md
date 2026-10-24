# Validation — ASHFALL 0.8.9.72

Base exacte : ASHFALL 0.8.9.70 (les améliorations de boss exclusives à la branche 0.8.9.71 ne sont pas intégrées).

## Vérifications automatisées

- 172 / 172 contrôles Chromium réussis sur 320×700, 390×844, 416×896 et 430×932.
- 150 générateurs de carte audités : 7 sites par expédition, 2 relais / 3 dépôts / 2 signaux ; 0 événement superposé, 0 point d'interaction indisponible ou contenu dans un mur.
- Distribution des sites : 3 ou 4 secteurs selon les salles éligibles (les arènes, terminaux existants, boss, caches et extractions restent prioritaires).
- Relais : découverte cartographique et gain XP vérifiés ; événement déclenché une fois.
- Dépôt : gain de crédits et d'XP vérifié ; aucune duplication après second passage.
- Signal : pas de prime à l'activation ; renforts et blocage de progression vers l'inconnu ; sauvegarde/rechargement de l'attaque ; paiement unique après élimination des renforts.
- Compatibilité avec run antérieur sans indicateur `interactiveV72` ; aucun événement injecté rétroactivement.
- Affichage de la carte, du compteur et de la pause mobile vérifié.
- Aucune erreur JavaScript détectée pendant les scénarios.
- Fichiers d'armes et de coffres identiques à ceux de la 0.8.9.70 ; aucune modification des dégâts, des prix des coffres ou des commandes tactiles.
- Même clé de sauvegarde : `ashfall_pwa_v1`.

## Limites

Les tests Chromium n'équivalent pas à une campagne entière jouée sur Safari iPhone. Une expédition complète avec interaction réelle, extraction et retour au refuge doit encore être validée sur appareil.
