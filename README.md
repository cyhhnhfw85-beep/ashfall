# ASHFALL — 0.9.0-beta.1 · Équipements 2.0

Version jouable de test construite sur **ASHFALL 0.8.9.78b — Refuge UI Cleanup**. Ce ZIP est une version intégrale du jeu, pas seulement un audit ou un patch.

## Installation

1. **Exporter le code de sauvegarde** de l’ancienne version avant de changer les fichiers.
2. Conserver le même domaine/origine et remplacer **tous** les fichiers du site par le contenu du ZIP (respecter les dossiers).
3. Rafraîchir le navigateur, vérifier le numéro **0.9.0-beta.1** et utiliser le contrôle de mise à jour si nécessaire.
4. Une expédition commencée avec l’ancien système se termine suivant ses règles historiques. Au retour au refuge, la sauvegarde est migrée.
5. Exporter de nouveau la sauvegarde après le premier démarrage, puis effectuer une session de validation sur l’appareil cible.

**Clé de sauvegarde :** `ashfall_pwa_v1` inchangée ; `eq2.schema=2` est une extension versionnée. La copie locale de pré-migration est enregistrée avant conversion sous `ashfall_pwa_v1_eq2_original_v1` et une clé d’archive propre à la sauvegarde.

## Fonctionnalités incluses

- Six emplacements : arme, armure, bottes, module, sac tactique, artefact ; six équipements acquis portés au départ, sans pièces de rechange.
- Propriété permanente des objets acquis, huit emplacements de nouveau butin, ramassage et remplacement manuels à 8/8, abandon et récupération dans les salles.
- Extraction et mort différenciées ; Sac Sécurisateur avec seuils par rareté et transfert de protection unique.
- Quinze modèles de catalogue initiaux, effets automatiques et synergies, Composants, recyclage, améliorations +5, optimisation unique remplaçable, vente.
- Conservation des cartes à 50 salles, du marchand existant, des coffres, des boss et de la progression historique.

## Documents

- `CHANGELOG_0900E2.md` : modifications effectuées.
- `CATALOGUE_ECONOMIE_E2.md` : catalogue et barèmes de départ.
- `MIGRATION_ET_SAUVEGARDES_E2.md` : conversions, compensations et transitions.
- `VALIDATION_E2.md` : tests réellement exécutés et limites.

**Statut : BETA**, car la PWA installée sur Safari iOS et une partie complète avec toutes les phases du boss n’ont pas été testées sur appareil. Ne pas écraser ta seule copie de sauvegarde.
