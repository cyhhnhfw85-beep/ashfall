# ASHFALL 0.8.9.78a — Accueil épuré · Validation

## Base et périmètre
- Base de référence : ZIP complet `ASHFALL_08978_Correctif_Coffres.zip`.
- Modifications limitées à l’accueil, au rendu HTML des contrats, à la synchronisation visuelle du portrait, aux références de version/cache et à la documentation.
- Aucun changement des formules économiques, combat, loot, niveaux, contrats, sauvegardes ou génération des cartes.

## Vérifications effectivement exécutées
- `node --check game.js` et `node --check service-worker.js` : réussis.
- Tests DOM automatisés via Chromium en environnement contrôlé (HTML et CSS injectés, localStorage émulé), largeurs 320/390/430 px : 13 contrôles de démarrage, illustration, 3 contrats, détails, persistance de choix, 5 onglets, absence de débordement horizontal du document sur l’accueil, et expédition de 50 salles avec contrat choisi.
- Une expédition de la 0.8.9.78 rechargée sur la 0.8.9.78a : champs sélectionnés (nombre de salles, arme équipée, salle courante, version du loot) identiques.
- Contrôle statique des 15 liens/ressources de l’HTML et des 19 chemins du pré-cache PWA : toutes les ressources existent dans le paquet.
- Comparaison octet par octet : toutes les images et feuilles de style historiques sont identiques à la version de référence.
- Analyse du diff moteur hors numéro de version : uniquement markup des contrats, conservation de l’état d’ouverture des détails, synchronisation du portrait de l’accueil.

## Limites explicites
- Chromium chargé à partir d’un document local injecté ; il ne s’agit pas d’un test de déploiement HTTP ni d’une PWA installée.
- Persistance navigateur réelle, contrôles tactiles sur Safari iPhone, actualisation via service worker, fonctionnalité offline et régression complète du gameplay non exécutés.
- Seul l’accueil a été revu. Les écrans Survivant, Marchand, Coffres et Secteurs restent inchangés.
- Captures réalisées avec un viewport mobile émulé, non sur appareil.

## Installation
- Exporter une sauvegarde avant de remplacer les fichiers du site ; préserver domaine/origine pour conserver le stockage local.
- Déployer le ZIP complet et forcer la vérification de version ; ancienne version cache `08978` remplacée par `08978a`.
