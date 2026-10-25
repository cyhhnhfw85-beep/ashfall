# Validation — ASHFALL 0.9.1-graphics-p1.1

## Vérifications exécutées

- **62/62 contrôles automatisés ciblés Chromium OK** : syntaxe et version, absence d'exception JavaScript au démarrage, HUD/overflow à 320/375/390/430 CSS px, zones de touche de 44 px, contrat dynamique, mini-carte, sac, pause, joystick et déplacement du joueur, persistance et rechargement d'expédition.
- Contrôle supplémentaire de **comparaison en lecture seule sur une même sauvegarde de test créée par 0.9.0-beta.1**, chargée séparément dans les trois versions 0.9.0 / P1 / P1.1 : même salle, PV, sac, position de terrain et taille de joystick ; versions comparées sans erreur JavaScript.
- `node --check game.js` et `node --check service-worker.js` : OK.
- Jeu d'équipements `equipment2-core.js`, `equipment2.css`, `immersion.js`, règles métier et images préexistantes comparés à la référence : fichiers inchangés.
- Différence dans `game.js` limitée aux deux chaînes de version et à **une seule ligne de mise en forme du contrat** ; n'altère pas le calcul des objectifs.
- `service-worker.js` : pré-cache incluant CSS P1.1 et nouveau portrait ; inspection statique des chemins requise avant déploiement.

## Tests non exécutés ou partiels

| Scénario | État | Motif |
|---|---|---|
| Vraie PWA Safari iPhone | NON TESTÉ | Environnement sans appareil iOS connecté |
| Service worker en réseau HTTPS et hors ligne | NON TESTÉ | Navigation réseau vers localhost bloquée dans Chromium ici ; pré-cache inspecté statiquement seulement |
| Extraction/mort/boss en partie complète | NON TESTÉ pour P1.1 | Les scripts métier sont byte-identiques à la bêta ; cela ne remplace pas une recette fonctionnelle |
| Import/export réel via interface Fichiers iOS | NON TESTÉ | Nécessite Safari/PWA réel |
| FPS et mémoire iPhone | NON MESURÉ | Aucun instrument de profilage iOS |
| Latence tactile physique | NON MESURÉ | Simulation pointer desktop seulement |

## Régression du joystick
La géométrie de la zone, `maxShift = min(64, max(34, (w-100)/2))`, `radius = 46`, les listeners `pointerdown/move/up` et la simulation du déplacement sont **byte-identiques** à la référence ; seules les couleurs, contours et ombres CSS sont modifiées.

## Verdict
Build fonctionnel pour les contrôles Chromium testés, avec changement graphique marqué par rapport à P1. La validation définitive reste conditionnée à la recette iPhone de l'utilisateur.
