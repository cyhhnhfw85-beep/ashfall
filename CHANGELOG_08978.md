# ASHFALL 0.8.9.78 — Coffres : niveau cohérent avec le secteur

Base : ZIP jouable `ASHFALL_08977_CLEAN_CORE.zip` (0.8.9.77).

## Correctif unique
- Les armes des **coffres gratuits ouverts automatiquement** utilisent désormais le secteur réel de leur salle (`sectorOf(room)`), uniquement **pour les nouvelles expéditions**.
- Chaque nouvelle expédition reçoit `run.freeChestLootRule = "sector-v1"` dans sa sauvegarde ; les anciennes expéditions, sans ce champ, conservent intégralement l'ancienne logique (`id 5/6/7`) jusqu'à leur conclusion.
- Les règles des coffres déjà ouverts ne sont pas recalculées et les objets déjà possédés ne sont pas touchés.
- Aucune modification aux chances de rareté, bonus des arènes, prix, marchand, revente, crédits, boss ou combat.
- Version HTML/moteur/PWA/cache harmonisée sur 0.8.9.78 pour assurer l'activation des fichiers déployés.

## Particularités
- La correction du secteur augmente légèrement les dégâts attendus des armes de coffre dans les zones avancées, donc peut modifier indirectement leur puissance et leur prix de revente.
- Les coffres payants et les armes lâchées par les ennemis ne sont pas modifiés.
- Tester l'affichage et le mode hors-ligne sur l'iPhone cible avant d'utiliser la version en production.
