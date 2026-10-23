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

## 0.8.9.34 — Nomade affiné
- Positions des bras retouchées.
- Pistolet usé et Nomade-9 plus lisibles dans le menu.
- Images embarquées conservées pour éviter les erreurs de chargement sur iPhone.
- Aucun changement de gameplay ni de sauvegarde.

## 0.8.9.35 — Nomade complet / correction des bras
- Remplacement de la construction corps + bras fragmentes par deux sprites complets pour menu (pistolet / fusil).
- Corrige les trous visuels aux epaules, le sac et les membres detaches.
- Images embarquees dans index.html afin d'eviter l'absence de sprites sur hebergement PWA.
- Selection selon la classe d'arme equipee; les autres armes ont une silhouette de fusil par defaut.
- Gameplay et clefs de sauvegarde non modifies.

## 0.8.9.36 — Arsenal rétro (16 références graphiques)
- Icônes extraites de la planche d'arsenal validée ; une icône pour chaque arme fixe et une pour chacune des 5 familles d'armes générées.
- Inventaire, emplacement équipé, cartes d'armes, marchand et sacs utilisent la même fonction graphique.
- Rareté conservée via la bordure actuelle ; noms, statistiques, inventaire, gameplay, sauvegarde et Nomade du menu inchangés.
- Sprites PNG fournis dans assets/weapons et aussi directement intégrés en base64 dans game.js pour éviter les images manquantes au déploiement.
- Détourage automatique (non identique aux fichiers sources éditables) : la lisibilité finale doit être vérifiée sur iPhone.

## 0.8.9.37 — Accueil Refuge
- Nouvelle hiérarchie : hero, départ, équipement, progression, accès rapide.
- Résumé d'arme, assurance, réserve et progression mis à jour depuis l'état existant.
- Conservation des identifiants et boutons du jeu (`start`, `startSector`, `tutorialLaunch`, `merchantLaunch`).
- Aucune modification du gameplay ou du schéma des sauvegardes.
