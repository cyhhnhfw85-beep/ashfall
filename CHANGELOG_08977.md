# ASHFALL 0.8.9.77 — Opération Clean Core

- Source de référence : ZIP complet **0.8.9.76 Correctif Armes** (copie intacte conservée séparément pour retour arrière).
- Retrait du ZIP de livraison des journaux de changement et validations des versions précédentes.
- Retrait des anciens `README*.txt` remplacés par le guide courant.
- Retrait des 16 PNG redimensionnés `assets/weapons/` : aucune référence dans le code, et toutes les versions maîtresses `assets/weapons_framed/` sont conservées.
- Conservation sans changement de tous les autres assets, JS/CSS, IDs, règles de sauvegarde, statistiques et fonctionnalités.
- Synchronisation du numéro affiché/moteur, des URLs de cache et du nom de cache du service worker sur **0.8.9.77**.
- Suppression de **10 fonctions JavaScript mortes** vérifiées par analyse de l’AST (aucune référence interne ni évaluation dynamique) : `hasActiveRun`, `paintExtraCells`, `graph`, `lootIntegrity`, `drawIncidentSignal`, `action`, `uiActionName`, `weaponHeldArt`, `performDash`, `doorRect`.
- Aucun refactoring à haut risque du moteur ou des sprites embarqués.
- Audit et preuves de tests : `AUDIT_CLEAN_CORE.md`.
