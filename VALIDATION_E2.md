# ASHFALL 0.9.0-beta.1 — Résultats de validation

## Tests exécutés dans le moteur livré

| Type | Vérifications réussies | Exécution |
|---|---:|---|
| Tests unitaires du cœur d'équipement (`equipment2-core.js`) | 90/90 | Node.js ; données contrôlées |
| Tests d'intégration mobile/refuge | 64/64 | Chromium Playwright ; largeurs 320, 375, 390, 430 px |
| Parcours approfondi 8/8, remplacement, sol, protection et mort | 10/10 | Chromium Playwright ; sauvegarde et rechargement |
| Sauvegardes historiques 0.8.9.70 à 0.8.9.78b | 10/10 | Ancienne expédition créée réellement dans chacune des dix anciennes versions, reprise puis migration dans la version nouvelle |
| Tests complémentaires commerçant/coffre/boss/joystick | 11/11 | Chromium Playwright ; scénario contrôlé |
| **TOTAL** | **185/185** | Tests exécutés, pas une preuve d'absence de tout bug |

## Scénarios couverts et vérifiables

- Six emplacements, acquisitions, mise à jour d'attributs, propriété permanente, achat/migration héritée.
- 8/8 : neuf ramassages, remplacement manuel, butin abandonné restant dans sa salle, non-récupération instantanée, rechargement en cours de partie.
- Interdiction de changer d'objet en combat, amélioration des pièces, objet protégé verrouillé, transfert unique, renonciation, seuils Sécurisateur aux raretés Commun/Rare/Épique/Légendaire.
- Mort avec objet protégé, sans objet protégé, récupération de la configuration de départ et extraction avec nouveaux objets.
- Optimisation remplaçable, améliorations +1 à +5, recyclage et restitution de 50 % des Composants réellement investis.
- Navigation sur cinq onglets, démarrage d'une carte de 50 salles, absence de débordement horizontal sur quatre tailles d'écran simulées.
- Achat chez le marchand (un seul débit), coffre payant (paiement, récompense en réserve, protection du double achat, révélation), mise à jour d'une salle boss en un tick simulé, mouvement et relâchement du joystick dans Chromium.
- Dix familles d'anciennes sauvegardes de run créées par la logique réelle de leurs versions d'origine, reprises puis migrées.

## Simulation économique

100 000 orientations de loot reproductibles depuis les fonctions du nouveau cœur, graine 20261025, voir `CATALOGUE_ECONOMIE_E2.md`. Une simulation de tirages n'est pas une session de combat ni une estimation fiable de revenus horaires.

## Tests NON exécutés et limites

- Aucun test sur un véritable iPhone, Safari iOS, ni une PWA réellement installée/hors ligne.
- Aucune campagne de parties complètes avec toutes les phases des boss, tous les événements et les extractions sur appareil.
- Aucun test de migration sur la **sauvegarde réelle du joueur**, indisponible. Les simulations comprennent 10 générations d'anciennes sauvegardes, pas tous les états historiques imaginables.
- Les nouveaux effets automatiques ont été vérifiés dans les calculs, les branches et certains ticks ; pas de benchmark prolongé de tous les couples d'équipements.
- Des icônes symboliques remplacent des illustrations dédiées pour les cinq nouvelles catégories ; visuel compatible avec le refuge, mais finition artistique à poursuivre.
- Les prix/effets sont des valeurs de départ soumises à retours de jeux réels et à l'audit économique antérieur.

**Verdict :** branche jouable et tests ciblés positifs ; statut BETA de validation mobile et équilibrage, et non publication commerciale prête.
