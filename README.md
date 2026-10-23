# ASHFALL 0.8.9.27 — Arme visible sur le survivant

Changements principaux :
- l'arme équipée est maintenant affichée directement dans les mains du survivant sur l'écran Personnage ;
- le rendu dépend du type d'arme (pistolet, SMG, carabine, fusil, arme d'énergie, précision) ;
- la couleur d'accent suit la rareté ;
- les colonnes d'équipement ont été légèrement réduites pour laisser plus de place au portrait.

Aucun changement de sauvegarde.

## 0.8.9.28
Correction du double positionnement SVG/CSS qui rendait l’arme tenue invisible. Aucune modification du schéma de sauvegarde ni des statistiques.
## 0.8.9.31
- Intégration du Nomade rétro validé dans le menu Personnage & Équipement.
- Nouveau SVG 3/4 plus fidèle à la maquette validée.
- Réalignement du calque d'arme tenue.
- Cache applicatif mis à jour pour forcer le rafraîchissement des assets.


## 0.8.9.32 — Nomade modulaire dans le menu
Trois sprites PNG transparents intégrés dans le menu Personnage, avec corps immobile et pose commutée automatiquement selon l'arme.
Le gameplay, les sauvegardes et les statistiques ne sont pas modifiés.
Limite actuelle : les armes disponibles sont classées visuellement en deux silhouettes (pistolet / fusil), et la jonction aux épaules sur les images sources reste perfectible.

## 0.8.9.33 — Correctif des images manquantes
Les images du personnage sont directement embarquées dans index.html afin de fonctionner même si un hébergement n’expose pas les sous-dossiers. Les PNG restent inclus comme sources. Aucun changement de sauvegarde ou gameplay.
