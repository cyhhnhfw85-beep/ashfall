# ASHFALL 0.8.9.76 — Validation visuelle des armes

## Contrôles exécutés
1. Vérification de la présence des 16 armes dans `assets/weapons/`.
2. Vérification de la présence des 16 armes dans `assets/weapons_framed/`.
3. Normalisation des dimensions de sortie : `256x144` pour `assets/weapons/`, `320x192` pour `assets/weapons_framed/`.
4. Régénération de `WEAPON_SPRITES` dans `game.js` à partir des assets corrigés.
5. Contrôle de non-régression : noms de fichiers, clés de mapping et noms logiques d’armes conservés.
6. Contrôle de structure : archive complète reconstruite sans modifier l’économie ni les sauvegardes.

## Limitations restantes
- L’arme tenue par le survivant en jeu repose encore sur le rendu dédié `weaponHeldArt()` et non sur ces PNG.
- Les autres améliorations d’interface (hors armes) n’ont pas été retouchées dans ce correctif.
