# ASHFALL 0.9.0-beta.1 — Équipements 2.0

Base technique : 0.8.9.78b (archive de référence conservée hors distribution).

## A. Fondations
- Modèle d’objet `equipment2-core.js` à identifiants uniques et six emplacements.
- Séparation entre équipements définitivement acquis, six pièces actives au départ et huit trouvailles temporaires.
- Conversion non destructive et idempotente des anciennes sauvegardes à la première entrée dans le nouveau refuge.
- Les expéditions anciennes restent sous le système de référence jusqu'à leur fin.

## B. Inventaire et exploration
- Ramassage automatique tant que le nouveau butin occupe moins de huit places ; remplacement explicite à 8/8.
- Objets laissés au sol conservés avec caractéristiques et identifiants, récupérables pendant le même parcours.
- Blocage des échanges et abandons en salle hostile ; équipement d’une pièce nouvelle uniquement en salle sécurisée.

## C. Extraction, mort, protection
- Acquisition permanente à l'extraction, conservation des pièces effectivement portées.
- En cas de mort, restauration des six pièces acquises du départ et perte du nouveau butin non sécurisé.
- Sac Sécurisateur : 8/7/6/5 salles nettoyées selon rareté, un objet protégé, un transfert maximum par expédition, renonciation et abandon confirmés.

## D. Catalogue et effets
- Quinze nouveaux modèles distribués entre armures, bottes, modules, sacs tactiques et artefacts.
- Bonus automatiques conservateurs, effets d'élimination, soin conditionnel, bouclier et impulsions électriques.
- Adaptation des calculs de dégâts, cadence, vitesse et vitalité sans nouveau bouton d'action.

## E. Économie
- Composants obtenus par recyclage ; améliorations garanties de +1 à +5 ; une seule statistique optimisée, remplaçable contre paiement.
- Au recyclage, remboursement de `floor(50% des Composants réellement investis)` en plus du rendement normal ; aucun remboursement des crédits.
- Allocation des catégories au sein du nombre de drops déjà généré (54% armes, 46% autres) ; anciennes probabilités de coffres payants et rotation marchand inchangées.

## F. Interfaces et stabilité
- Six emplacements autour du portrait, nouvelle collection, détails d’effets, boutons d'amélioration/optimisation/recyclage/vente.
- Inventaire d'expédition multitype, compteur 0/8–8/8, état du Sac Sécurisateur, remplacement à sac plein.
- Menus refuge conservés ; versions du HTML, du moteur et des URLs de cache harmonisées en `0.9.0-beta.1`.

## Précautions
- Aucun changement intentionnel des règles d'une expédition préexistante ; pas de refonte de boss, de map ou de marchand.
- Voir `VALIDATION_E2.md` pour la couverture et les scénarios non joués sur iPhone.
