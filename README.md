# ASHFALL — Alpha PWA 0.8.9.74

**Branche : progression longue durée.** Cette livraison est construite exclusivement à partir de **0.8.9.70**. Elle ne fusionne pas les branches 0.8.9.71 (boss), 0.8.9.72 (exploration) ou 0.8.9.73 (équipements).

## Nouveautés

- **Dossier de maîtrise K-17** dans l'onglet Secteurs : quatre parcours permanents (exploration, combat, survie, récupération), chacun doté de trois paliers.
- **Grade d'opérateur** évoluant avec les paliers : Recrue, Éclaireur, Opérateur, Vétéran, Légende K-17.
- **Quatre défis de secteur** : explorer au moins trois salles d'un secteur dans une même expédition et réussir l'extraction. Chaque défi n'est validé qu'une fois.
- **Collection d'arsenal** de cinq familles d'armes : Nomade, Vektor, Spectre, Ion, Cendre. Les pièces déjà possédées sont reconnues ; les armes gagnées à l'extraction complètent l'archive.
- **Six insignes cosmétiques** déblocables, dont un insigne de départ. Un seul insigne peut être actif ; il est affiché au refuge et sélectionnable dans Secteurs.
- **Aucun nouveau gain de crédits, recherche ou dégâts** : la progression longue durée est honorifique afin de préserver les extractions et l'économie des coffres.

## Sauvegardes et compatibilité

- Clé **`ashfall_pwa_v1`** et version de données **`version:1`** préservées. Nouveau champ facultatif `longTerm` initialisé pour les anciennes sauvegardes.
- Le total d'extractions historiques est repris de `stats.extractions`. Les totaux de salles, éliminations et armes extraites **commencent à la 0.8.9.74**, car ils ne sont pas reconstructibles avec certitude.
- La validation d'une expédition et les nouvelles statistiques sont enregistrées dans le même snapshot. Une garde `lastRecordedRun` évite la double comptabilisation d'une expédition.
- La mort compte l'exploration et les éliminations, mais ni les armes perdues ni les défis de secteur nécessitant une extraction réussie.
- Aucune nouvelle touche : interaction uniquement dans le refuge, avec pictogrammes ASHFALL existants.

## Installation

1. Exporter la sauvegarde actuelle depuis le jeu.
2. Déployer **tout le contenu du ZIP à la racine de l'hébergement**.
3. Actualiser le site et vérifier **0.8.9.74** sur l'accueil.
4. Aller dans **Secteurs > Maîtrise K-17**.

Voir `CHANGELOG_08974.md` et `VALIDATION_08974.md` pour les détails.
