# ASHFALL 0.8.9.78 — Validation du correctif de niveau des coffres

**Base vérifiée :** `ASHFALL_08977_CLEAN_CORE.zip`, moteur 0.8.9.77.  
**Nature de l'intervention :** correction isolée d'un défaut du niveau des armes dans les coffres gratuits, sans rééquilibrage volontaire.  
**Résultat :** 40/40 tests ciblés réussis en environnement de simulation Chromium / vérifications statiques.  
**Simulation :** 10,000 cartes complètes, graine reproductible 20261024, 279,640 tirages de coffres; modèle de génération et non vraies parties.

## 1. Cause identifiée dans le code

Le bloc d'ouverture automatique des coffres utilisait `makeWeapon(r.current===6?3:r.current===7?2:r.current===5?1:0)`, héritage des premières versions du jeu. Sur une carte à 50 salles, le niveau de l'arme venait presque toujours de `0` quel que soit le secteur.

## 2. Changement limité

- Nouvelle fonction `freeChestWeaponLevel(run,room)` qui retourne `sectorOf(room)` si et seulement si `run.freeChestLootRule==='sector-v1'` et que la carte possède 50 salles.
- Chaque **nouvelle expédition** porte `freeChestLootRule:'sector-v1'` dans son propre snapshot de run. Cette propriété est sauvegardée automatiquement par le mécanisme préexistant et disparaît avec le run à son terme.
- Les runs **créés avant 0.8.9.78** ne possèdent pas le marqueur : ils utilisent **l'exacte formule historique**, y compris pour les salles 5, 6, 7. Aucune migration, aucun changement des armes déjà tirées/possédées.
- Les règles du coffre gardé (commun converti en rare) et de l'arène (épique forcé) sont inchangées.
- Les armes ennemies, les coffres payants, les taux de rareté, le marchand, les crédits et la revente restent inchangés.
- Version de `game.js`, `index.html` et du cache Service Worker portée à 0.8.9.78.

## 3. Comparaison économique (simulation, pas gameplay)

| Indicateur | Ancienne règle | Nouvelle règle |
|---|---:|---:|
| Épiques générés sur 10,000 cartes | 57,815 | 57,815 |
| Rares générés sur 10,000 cartes | 88,501 | 88,501 |
| Épiques moyens / carte complète | 5,78 | 5,78 |
| Dégâts moyens / arme de coffre | 26,41 | 28,52 |
| Revente moyenne nominale / arme de coffre | 111,40 CR | 113,24 CR |
| Surcroît théorique de revente / carte | — | +51,27 CR |

Dégâts moyens par secteur :

| Secteur | Avant | Après |
|---|---:|---:|
| 0 | 22,88 | 22,27 |
| 1 | 26,94 | 28,39 |
| 2 | 27,20 | 30,65 |
| 3 | 27,94 | 33,08 |

Les moyennes regroupent coffres ordinaires, gardés et récompenses d'arène en appliquant les conversions de rareté d'origine, sans simuler leur difficulté, leur ramassage, leur conservation, les ventes, la survie ou les expéditions réellement jouées. Une légère baisse en secteur 0 est normale : l'ancien code surévaluait les salles portant les ID 5, 6 ou 7, parfois situées en périphérie.

## 4. Tests effectués

- Comparaison SHA-256 : images, CSS, manifeste, scripts de présentation sans modification.
- Analyse de différence des fichiers : uniquement moteur, HTML, SW, README et documents de livraison.
- `node --check` : tous les fichiers JavaScript livrés.
- Test Chromium : démarrage, accès aux cinq onglets, carte de 50 salles, 4 arènes, 3 sorties.
- Test des sauvegardes : vraie sauvegarde générée par 0.8.9.77, fichiers témoins générés antérieurement sous 0.8.9.70 à 0.8.9.76 ; absence du nouveau champ préservée, y compris après un tick.
- Test avec `update()` du **vrai moteur** et graine RNG fixée, après reprise explicite de la pause : coffre de chaque secteur sur ancienne et nouvelle règle, coffre gardé et arène ; génération effective d'un objet au sol.
- Test de tirages du moteur : 4 000 tirages comparés à séquence aléatoire identique, rareté/nom/cadence strictement identiques pour les niveaux 0 et 3 ; différence de dégâts exactement +6.
- Scénarios de régression à état contrôlé : coffre automatique, extraction, mort, salle de boss.
- Simulation de génération séparée sur les fonctions réelles de la base candidate : 10 000 cartes, raretés strictement identiques.

**Méthodologie :** les tests exécutent l'application dans Chromium via un document de test avec scripts embarqués et stockage local simulé. Les tests de coffre manipulent uniquement les états de salles d'un banc de test pour vérifier le vrai chemin `update()`. Le banc de test et les instantanés témoins **ne sont pas inclus dans le ZIP jouable**.

## 5. Risques résiduels et tests manuels non réalisés

- Safari iPhone/PWA réelle, changements de cache réseau et mode hors ligne non testés sur l'appareil cible.
- Expédition complète jouée au joystick avec combats de boss et tous les coffres non testée de bout en bout.
- L'évolution du niveau des armes peut faciliter les secteurs 2 et 3 et augmenter la valeur nominale de revente ; ne pas interpréter les gains simulés comme revenus réellement réalisés.
- Les caches de navigateur peuvent nécessiter un rechargement après déploiement ; vérifier la version 0.8.9.78 à l'écran.
- L'indicateur supplémentaire n'est pas obligatoire pour `valid()` : en cas d'ancienne sauvegarde, le code revient volontairement à la règle historique. Le schéma général `version:1` et les clés de stockage existantes sont inchangés.
- Le chantier de rotation du marchand reste volontairement **hors de ce correctif**.

## 6. Procédure prudente

Exporter la sauvegarde **avant** mise à jour. Déployer sur la **même origine HTTPS**, sans effacer les données locales. Vérifier le retour au refuge / expédition en cours, puis lancer une **nouvelle expédition** pour constater le nouveau calcul de secteur ; finir une ancienne expédition avant de juger ses coffres. En cas d'incident, revenir à l'archive intacte 0.8.9.77 et restaurer la sauvegarde exportée.
