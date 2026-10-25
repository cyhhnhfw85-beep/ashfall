# ASHFALL 0.9.1-graphics-p1.1 — Rapport d'intégration artistique

## Résumé
Étape 1/6 reprise pour s'aligner sur la **maquette de combat premium fournie**, sans chercher à reproduire le décor ou les ennemis conceptuels, hors périmètre du HUD. La refonte modifie cette fois l'organisation DOM, pas seulement les bordures :

- Groupe en haut à gauche : portrait du survivant (détail visuel de la maquette fournie), panneau compact `roomTitle` / PV (`hpText`,`hpFill`) / XP (`xpDisplay`,`xpFill`).
- Contrat dans un élément flottant indépendant (`ashContractHud`), nom et progression dynamiques séparés ; à 320 px, le libellé générique est masqué mais pas le nom ni la valeur.
- Groupe à droite : mini-carte **circulaire** conservant son SVG dynamique et son événement `mapBtn`, et deux commandes tactiles **verticales** de 44 × 44 CSS px (`bagBtn`, `pauseBtn`).
- Joystick : zone tactile et axes entièrement inchangés ; uniquement des anneaux et matériaux visuels nouveaux sur `joyBase` et `joyKnob`.
- Fond et personnage de combat, ennemis, salles, boss, coffre, IA, vitesse, interface de refuge et données d'Équipements 2.0 **non modifiés**.

## Mesures comparatives sur la même sauvegarde de test — Chromium 390 × 844 CSS px

| Version | Bas du HUD (px CSS) | Terrain Canvas (x,y,w,h) | Zone joystick (x,y,w,h) |
|---|---:|---|---|
| 0.9.0-beta.1 | 130 | (-25,147,441,490) | (51,654,289,180) |
| 0.9.1-graphics-p1 | 135 | (-25,150,441,490) | (51,654,289,180) |
| **0.9.1-graphics-p1.1** | **114,2** | **(-25,139,441,490)** | **(51,654,289,180)** |

Le Canvas a **exactement la même dimension CSS** dans ces trois tests ; la partie haute du terrain est repositionnée 10,4 px plus haut que P1. La hauteur du groupe de HUD baisse de **20,8 px par rapport à P1** et de **15,8 px par rapport à la bêta**.

Les coordonnées négatives du Canvas en X proviennent du fit existant qui affiche `1.13 × largeur viewport`, puis coupe les bords dans `#stage` ; **ce comportement est historique et volontairement inchangé**. Le document ne présente donc pas une absence de découpe de contenu monde au bord.

| Largeur testée | Hauteur HUD P1.1 | Boutons sac et pause | Contrat / statut |
|---:|---:|---|---|
| 320 px | env. 110 px | 44 × 44 px | visibles, nom complet |
| 375 px | env. 114 px | 44 × 44 px | visibles |
| 390 px | 114,2 px | 44 × 44 px | visibles |
| 430 px | env. 114 px | 44 × 44 px | visibles |

Ces mesures sont **des mesures Chromium**, pas des mesures d'une PWA Safari sur iPhone. Les safe areas iOS doivent être vérifiées sur l'appareil réel.

## Matrice de fichiers

| Fichier | Nature | Impact |
|---|---|---|
| `index.html` | Structure HTML de HUD, versions | Structure UI uniquement |
| `graphics-p1.css` | Remplacement complet de la couche visuelle P1 | CSS expédition |
| `assets/hud/nomad-badge.png` | Nouveau recadrage issu de la maquette jointe | Image purement illustrative |
| `game.js` | Chaînes de version et format HTML du contrat | Rendu du contrat uniquement |
| `service-worker.js` | Cache et préchargements versionnés | Distribution PWA |
| Documentation | Rapports et procédure d'installation | Aucun |

## Contraintes / compromis
- La mini-carte circulaire recadre légèrement les coins de la grille, mais le bouton ouvre toujours la carte complète. Le moteur SVG et la progression restent inchangés.
- La maquette représente un décor beaucoup plus détaillé que le moteur actuel : **ce décor n'est pas introduit en P1.1**, conformément à l'étape 1 seulement.
- L'avatar statique est un insigne de HUD, **pas la représentation de l'arme portée** ; le héros et son équipement restent ceux du moteur dans la scène.
- Les textes secondaires du contrat sont ellipsés si les noms deviennent excessivement longs ; la progression numérique reste toujours visible. Les contrats effectivement présents ont été vérifiés sur les tailles demandées.
- La résolution interne Canvas 360×400, sa mise à l'échelle 113 % et `image-rendering:pixelated` restent inchangés ; une future refonte de rendu doit faire l'objet d'un autre lot.

## Statut
Prêt pour recette artistique et fonctionnelle sur iPhone. **L'étape 1 n'est pas validée définitivement** ; pas d'étape 2 commencée.
