# ASHFALL 0.8.9.73 — Équipement et personnalisation

Version complète, créée à partir de **0.8.9.72**, sans fusion de la branche boss 0.8.9.71.

## Nouveautés
- 7 découvertes facultatives générées sur les nouvelles cartes : 2 relais d’écho, 3 dépôts abandonnés, 2 signaux de détresse.
- Sites répartis dans 3 ou 4 secteurs selon les contraintes géométriques et les salles existantes ; aucune superposition avec les incidents ou terminaux.
- Relais : révèle jusqu’à quatre salles et fournit 5 XP.
- Dépôt : 36 à 72 crédits selon secteur et salle, 3 XP, jusqu’à 10 PV si blessé.
- Signal : deux renforts ; 70 à 106 crédits et 7 XP **uniquement après victoire** ; récompense sauvegardée une fois.
- Marqueur D/d sur la carte pour les sites visités et le compteur de découvertes dans la carte et la pause.
- Activation par proximité après nettoyage, sans bouton supplémentaire.

## Compatibilité et économie
- Sauvegarde locale : `ashfall_pwa_v1` inchangée, export/import compatibles.
- Les expéditions commencées avant la 0.8.9.72 ne reçoivent pas de nouveaux événements rétroactivement.
- Les crédits de découvertes font partie du butin d’expédition et **ne sont conservés qu’après extraction**.
- Prix des coffres inchangés : 900 / 2 800 / 7 500 crédits.
- Graphismes d’armes, coffres, contrôles tactiles, combat et HUD de la 0.8.9.70 conservés.

## Installer
Exporter d’abord la sauvegarde. Déployer **tous** les fichiers à la racine du site (y compris le sous-dossier `assets`). Vérifier l’affichage **0.8.9.73**. Ne pas écraser la sauvegarde locale.

## Validation
Tests Chromium sur 320, 390, 416 et 430 px, reprises d’événements, attribution une fois, ancien run et 150 générations procédurales. Un essai réel sur Safari iPhone demeure nécessaire.


## 0.8.9.73 — Équipements tactiques
Survivant → Équipement → Casque et module. Débloquer avec crédits et recherche, puis équiper une option de chaque catégorie. Les bonus sont activés uniquement au lancement d'une nouvelle expédition. Les anciennes expéditions reprennent telles quelles. Consulte CHANGELOG_08973.md.
