# ASHFALL 0.9.1-graphics-p1 — Changelog

## Ajouts

- `graphics-p1.css` : nouvelle couche CSS scoped `body.ashfall-expedition`, palette industrielle premium, HUD de combat et joystick redessinés.
- En-tête gauche réorganisé par hiérarchie graphique : secteur/progression, barre HP, niveau XP, contrat.
- Mini-carte et commandes sac/pause visibles dans le coin haut droit ; surfaces tactiles de sac et pause >= 44 × 44 CSS px dans les scénarios contrôlés.
- Visuel du joystick sombre/cyan/ambre et anneaux discrets, sans flèches ni nouveau bouton.

## Ajustements de distribution / marquage

- `index.html` : inclusion de la nouvelle feuille CSS, libellés statiques « CARTE » et « SAC » encapsulé pour les petites largeurs, version affichée et querystrings de ressources.
- `game.js` : uniquement `ASHFALL_RUNTIME_VERSION` et le texte de l'alerte de version ; tout le gameplay est strictement identique à la bêta.
- `service-worker.js` : nouvelle clé de cache `ashfall-0901-graphics-p1`, nouveau versionnement URL, ajout de `graphics-p1.css` aux ressources préchargées.

## Intangibles

- Aucune image existante remplacée.
- `equipment2-core.js` et `immersion.js` identiques au byte près.
- Économie, loot, inventaire, sauvegardes, visée, collisions, attaques, extraction et déplacement inchangés.
- Aucune intégration des étapes 2 à 6.
