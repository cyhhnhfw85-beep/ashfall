# ASHFALL 0.8.9.76 — Correctif armes

## Objectif
Corriger les visuels d’armes avant toute reprise du développement fonctionnel.

## Modifications
- Nettoyage et normalisation des 16 assets de `assets/weapons/`.
- Reprise des 16 versions de `assets/weapons_framed/` pour supprimer les défauts de cadrage et homogénéiser l’affichage.
- Remplacement complet de 3 illustrations problématiques : `cendre`, `prototype`, `rifle_industrial`.
- Suppression des traits parasites / repères visibles sur plusieurs armes.
- Mise à jour de `WEAPON_SPRITES` dans `game.js` afin que l’interface du jeu affiche bien les nouveaux visuels corrigés.

## Règles respectées
- Aucun changement de statistiques, économie, rareté, identifiants ou sauvegardes.
- Aucune modification des mécaniques de combat, d’équipement ou de progression.

## Résultat attendu
- Visuels d’armes plus propres dans l’inventaire, le marchand, les récompenses, l’arme équipée et les cartes d’objet.
