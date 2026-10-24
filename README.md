# ASHFALL 0.8.9.54 — Équilibrage et variété

Base : 0.8.9.53. Jeu complet. Sauvegarde `ashfall_pwa_v1` inchangée.

## Changements uniquement dans les nouvelles expéditions
- Incidents : distribution moins prévisible, environ 6 à 9 par carte selon la répartition des salles ordinaires ; maximum 3 par famille et répartition sectorielle plafonnée. Degré de risque plus élevé dans la Fonderie et la Citadelle.
- Terminaux : six postes au maximum, répartis selon l'utilité (scanner en amont, régulateurs près des zones dangereuses, soins plus loin), avec variantes d'emplacement.
- Scanner : si aucune salle inconnue n'est dans les trois connexions proches, il peut révéler jusqu'à deux fronts plus éloignés encore inconnus ; il ne crée ni passage ni checkpoint.
- Caches secrètes : environ 30–65 crédits par cache selon le secteur, collectés uniquement à l'extraction, au lieu de 18–32. Aucun changement aux crédits des ennemis, aux armes, ni aux coffres.

## Invariants
- Une ancienne expédition conserve ses incidents, ses terminaux, ses caches et l'ancien barème de récompenses.
- Le système de combat, les ennemis, les dommages, les soins (22 PV), l'extraction, les checkpoints supprimés et l'économie du refuge sont préservés.
- Les terminaux restent activés par proximité sans bouton supplémentaire.
- Le service worker utilise un cache versionné 0.8.9.54.

## Vérifications recommandées sur iPhone
1. Exporter sa sauvegarde avant publication.
2. Vérifier que l'accueil affiche 0.8.9.54 et lancer une nouvelle expédition.
3. Contrôler les scanners (carte), les soins, les régulateurs, les caches puis une extraction complète.
