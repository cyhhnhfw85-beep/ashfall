# ASHFALL 0.8.9.76 — Opération Fusion

## Sources
- Ancêtre commun : `0.8.9.70`.
- Branche boss `0.8.9.71`.
- Branche exploration `0.8.9.72`, reprise et étendue par la branche équipement `0.8.9.73`.
- Branche progression honorifique `0.8.9.74`.

## Intégrations
- Ennemis mobiles, attaques télégraphiées, Gardien en trois phases et HUD de boss.
- Sept découvertes facultatives placées sur chaque nouvelle carte de 50 salles.
- Six équipements tactiques permanents (trois casques, trois modules), choix verrouillés pour chaque expédition.
- Maîtrise K-17, collection de cinq familles, quatre défis de secteur et six insignes honorifiques.
- Préservation de la réduction de dégâts du casque Bastion pendant les phases de combat et intégration du HUD de boss.
- Intégration des CSS `equipment-phase.css` et `longterm-phase.css`, références et cache PWA harmonisés.

## Protection des données et invariants
- Clé `ashfall_pwa_v1`, schéma `version:1`, gestion de la sauvegarde secondaire inchangés.
- Aucun art du dossier `assets/` modifié : 46 fichiers comparés par SHA-256 à la base 0.8.9.70, 46 identiques.
- Aucune nouvelle modification des coûts, probabilités ou récompenses au-delà de ce que comportaient les branches sources.
- Anciennes expéditions préservées sans injection rétroactive des événements et équipements tactiques.

## Limites
- Les essais sur véritable Safari iPhone/PWA et une expédition humaine complète restent à effectuer.
- Des débordements horizontaux antérieurs subsistent dans les illustrations de Coffres et, sur certaines largeurs, du survivant.
