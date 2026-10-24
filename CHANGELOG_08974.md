# 0.8.9.74 — Progression longue durée

Base : 0.8.9.70, sans fusion des branches 71–73.

### Fonctionnel
- Suivi cumulé des salles, ennemis, extractions et équipements extraits.
- Douze paliers de maîtrise avec progression visuelle et cinq grades.
- Quatre défis de secteur persistants avec condition d'extraction.
- Collection des cinq familles d'armes et prise en compte des pièces déjà possédées.
- Six insignes persistants, purement cosmétiques, avec sélection protégée et sauvegardée.

### Protection des sauvegardes
- Aucun changement du schéma obligatoire ; champ optionnel `longTerm`.
- Garde contre la double attribution du même rapport.
- Sauvegarde dans le même commit que le bilan d'expédition.

### Présentation
- Interface du dossier dans Secteurs ; pictogrammes SVG ; CSS isolé (`longterm-phase.css`).
- Mise à jour des versions dans HTML, scripts, styles et cache du service worker.

### Non-modifié
- Dégâts, cadence, ennemis, joystick, butin, extraction, contrats, niveaux et prix des coffres.
