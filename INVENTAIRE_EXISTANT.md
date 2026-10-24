# ASHFALL — Inventaire réel avant la refonte (0.8.9.63)

Audit statique des trois fichiers principaux ; le décompte prend les caractères Unicode Extended Pictographic visibles dans le source, et non uniquement les emojis à rendu coloré. Il est **indicatif** : certains caractères sont dans des notifications, d'autres peints sur le Canvas et d'autres servent à des contrôles.

| Fichier | Occurrences | Symboles distincts |
|---|---:|---:|
| `game.js` | 56 | 21 |
| `index.html` | 14 | 8 |
| `game.css` | 0 | 0 |
| **TOTAL** | **70** | — |

À cela s'ajoutent des caractères non-emoji de type `◈`, `¤`, `▣` : **à harmoniser selon leur fonction**, pas à effacer aveuglément.

## Ressources vérifiées

- **16 illustrations d'armes recadrées** : `assets/weapons_framed/*.png` (PNG RGBA, conserver).
- **9 images de coffres** : 3 niveaux × 3 phases (WEBP RGBA, conserver).
- Un moteur `game.js` d'environ **1800 Ko** (contient des visuels intégrés), un CSS historique d'environ **108 Ko**. Les nouvelles classes doivent donc être namespacées.

## Principales incohérences à corriger pendant la migration

1. Unicode et emojis dans les boutons d'accueil, les libellés du HUD, les barres de statistiques, l'inventaire, les messages, le tutoriel et plusieurs écrans de fin.
2. Icônes issues à la fois des glyphes Unicode, du SVG, de CSS et des dessins Canvas ; tailles et épaisseurs non uniformes.
3. Styles historiquement dispersés ; plusieurs systèmes de cartes, de boutons et de modales. Préférer une source unique de tokens et des composants cohérents.
4. Armes PNG horizontales parfois affichées dans des conteneurs carrés ou affectées de tailles selon l'écran. Conserver les recadrages v63 et généraliser `object-fit:contain`.
5. Nécessité de synchroniser la mise à jour PWA et le cache de toutes les pages/ressources, compte tenu des précédents affichages d'anciennes versions sur iPhone.

## Liste standardisée des pictogrammes du kit

`home`, `survivor`, `merchant`, `sectors`, `chest`, `bag`, `heart`, `xp`, `pause`, `play`, `close`, `back`, `arrow-right`, `weapon`, `shield`, `lock`, `research`, `credits`, `crosshair`, `damage`, `rate`, `extraction`, `warning`, `check`, `failure`, `scan`, `terminal`, `options`, `info`, `clock`, `skull`, `spark`, `upgrade`, `sort`, `eye`, `rarity`, `map`, `download`, `heal`, `ammo`

**Règle :** le kit 1A ne modifie pas le jeu et ne promet pas que les 70 occurrences ont déjà été remplacées. C'est la grille de contrôle exhaustive de la future passe 1B/1C.
