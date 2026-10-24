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

## 0.8.9.38 — Accueil clarifié
- Deux ressources seulement dans la barre principale, avec pictogrammes SVG Crédit et Recherche sans images externes.
- Le nombre d'expéditions est déplacé dans l'onglet Secteurs, tout en restant présent dans les statistiques Personnage.
- Supprime les liens Postes du refuge en double : une seule navigation supérieure demeure.
- La page Progression est renommée Secteurs et explique zones accessibles, avant-postes et Gardien sans faire croire à une carte géographique de combat.
- Aucun changement du gameplay, de l'économie, des sauvegardes ni des graphismes déjà validés.

## 0.8.9.39 — Accueil / Survivant / Atelier
- L'accueil n'affiche plus ni équipement ni carte des secteurs, seulement le départ et le tutoriel.
- Suppression du choix du point d'insertion; toutes les nouvelles expéditions commencent à l'entrée (zone 0).
- Les balises/avant-postes historiques restent dans la carte et la sauvegarde pour compatibilité; les changements de gameplay plus profonds sont reportés.
- Renommage Personnage -> Survivant; l'interface est séparée en Équipement et Atelier.
- Pas d'assurance, stats ni résumé de l'arme équipé redondant sous le portrait et dans l'inventaire.
- Bilan extraction / décès transféré dans Secteurs; Atelier présente les 2 upgrades existants dans un design dédié.
- Valeurs d'améliorations inchangées (+15 PV ou +3 dégâts, coût 4 + 4*level recherche, niveau max 8); aucune nouvelle amélioration inventée.
- Sauvegardes et assets existants conservés.


## 0.8.9.40 — Marchand & secteurs utiles
- Refonte du Marchand : filtres achetables/plus puissantes, tri, prix visible, comparaison théorique, quantité regroupée pour les offres identiques, détails de rotation, vente lisible et protégée.
- Refonte Secteurs : objectif adapté au jalon atteint, jauge des 4 zones, menaces et conseils tactiques, fiches déroulantes, historique et définition explicite des balises (sans checkpoint).
- Rotation, prix, achats, ventes, assurances, graphismes du Nomade, récompenses, progression et format des sauvegardes conservés.
- La puissance théorique (dégâts x cadence) est une comparaison simplifiée, pas une mesure de dégâts réels du combat.


## 0.8.9.41 — Expéditions : géométrie et caméra (phase 1)

- Les nouvelles expéditions de K-17 génèrent 50 salles **logiques** avec des formes locales 1×1, 2×1, 1×2 et en L. Les salles restent séparées par des portes ; les formes sont des espaces locaux et non des tuiles contiguës de la carte régionale.
- Les salles de départ, balises et extraction restent 1×1 pour préserver les interactions existantes ; le boss dispose d'une salle 2×1.
- Murs extérieurs, ouvertures et collisions sont calculés depuis les cellules constitutives ; aucune cloison ne bloque les jonctions internes.
- Caméra de suivi dans les salles agrandies avec zoom 0,84 et coordonnées du monde séparées du viewport 360×400. Les particules de combat suivent la transformation caméra.
- Les ennemis disposent d'une navigation simplifiée vers le coude des salles en L ; le tir automatique tient compte des obstacles.
- Les sauvegardes des anciennes expéditions sans champ `shape` sont interprétées en 1×1, sans réécriture des inventaires ni de la progression. Les nouvelles parties enregistrent les formes dans chaque salle.
- Le graphisme du Nomade pendant les expéditions, les décors interactifs et les événements supplémentaires restent réservés aux phases suivantes. Aucune refonte du refuge.

### Limites connues
Les salles étendues conservent pour cette phase les coffres, terminaux, dangers et événements principaux dans leur première cellule. Les extensions servent déjà au déplacement et aux combats mais leur décoration est volontairement légère. Une vérification de jouabilité et de performance sur iPhone réel reste nécessaire avant validation finale.


## 0.8.9.42 — Expéditions : salles vivantes (phase 2)
- Dressing déterministe sur les quatre formes (1×1, 2×1, 1×2, en L), sans changer la clé de sauvegarde : joints et plaques de sol, gaines, câbles, marquages et usure.
- Décoration contextuelle de chaque salle (dépôt, relais, analyse, archives, maintenance, etc.) et palettes distinctes par secteur.
- Les obstacles existants ont un visuel de caisses, consoles ou machines. Deux couvertures physiques supplémentaires, exactement alignées à leurs hitbox, apparaissent dans chaque aile étendue des nouvelles expéditions V42. Les anciennes expéditions V41 conservent leurs extensions libres.
- Ambiance légère animée par secteur : poussière, écrans et néons, braises de fonderie et éclats d'énergie. 6-8 motes par cellule, aucune ressource graphique externe.
- Économie, IA, formes, graphes de portes, règles, joueurs, outils et inventaires conservés ; ajout du champ optionnel room.solidDecorV42 à la génération uniquement.
- Effets de combat/dangers et grands événements ne sont pas encore modifiés. Les objets destructibles appartiennent à une phase distincte.
