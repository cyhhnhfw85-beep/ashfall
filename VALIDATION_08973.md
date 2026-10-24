# Validation ASHFALL 0.8.9.73

## Vérifications automatiques Chromium

- 153/153 — rendu iPhone simulé 320, 390, 416, 430 px ; achats et changements des modules, reprise ancienne partie, stabilité des sauvegardes ; intégrité des assets.
- 42/42 — bonus des six équipements réellement appliqués en combat ou sur l’XP : mouvement, réduction de dégâts, PV, cadence, dégâts, XP ; persistance après recharge.
- 172/172 — régression complète des 7 événements de la 0.8.9.72, des anciennes parties et de la carte.
- 51/51 — régression coffres et économie, y compris achat interrompu, rechargement, révélation, récompense unique.
- Total : **418/418** contrôles réussis ; aucune erreur JavaScript détectée.
- `node --check game.js` réussi ; fichiers d’illustration identiques à ceux de la 0.8.9.72.

## Compatibilité

- Clé de sauvegarde locale toujours `ashfall_pwa_v1`, `version:1` inchangée.
- `data.loadout` est facultatif ; sans ce champ les anciens profils démarrent sans bonus.
- `run.loadout` est facultatif ; sans ce champ, une ancienne expédition en cours reste sans bonus supplémentaire.
- Configuration tactique figée au départ d’un nouveau run. Casque et module restent après la mort et ne sont pas revendus.
- Prix des coffres inchangés 900 / 2800 / 7500 crédits, loot et probabilités inchangés.

## Limites de validation

- Navigateur de test : Chromium, simulation de viewport et interactions tactiles. L’utilisation sur Safari iPhone réel, hors ligne et la sensation en combat prolongé restent à confirmer par l’utilisateur.
- La version **n’intègre pas** les changements de boss de la 0.8.9.71, cette branche ayant été volontairement exclue de la base 0.8.9.72.
