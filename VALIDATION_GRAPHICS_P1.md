# ASHFALL 0.9.1-graphics-p1 — Validation

## Statique et intégrité

- SHA-256 de la source conforme : `33af3a454257ff82954a416c90fac97ff8da5306d4561d1143a587e3dafaf58b`.
- `node --check` sur `game.js` et `service-worker.js` : OK.
- Code moteur : identique à la référence hors changement des 2 chaînes de version.
- `equipment2-core.js` et `immersion.js` : identiques à la référence.
- Tous les fichiers `assets/` : identiques à la référence.
- Liens HTML locaux : 18 références vérifiées, aucune ressource manquante.
- Liste de préchargement du service worker : 33 entrées/fichiers vérifiées, aucun chemin inexistant.

## Tests Chromium en mémoire

**61/61 contrôles ciblés OK.** Tests effectués sur des pages dérivées des fichiers réels, en mémoire, sans URL HTTPS ni service worker actif.

Couverture : démarrage, quatre largeurs, débordements, contrôle de placement du Canvas et du HUD, boutons 44 px, valeurs dynamiques, compteur sac 8/8, affichage contrat, carte, sac, pause, joystick simulé et déplacement réel, retour au centre, sauvegarde après `pagehide`, rechargement Équipements 2.0.

**Test distinct :** une expédition sauvegardée par le moteur original 0.9.0-beta.1 a été rechargée dans 0.9.1-graphics-p1, avec salles, salle courante, PV, équipement et Équipements 2.0 préservés dans ce scénario.

## Tests non exécutés / limites

| Scénario | État |
|---|---|
| Mort / extraction en partie complète | NON TESTÉ : code inchangé, pas de parcours complet |
| Arène / Gardien K-17 en jeu complet | NON TESTÉ |
| Cache PWA Safari réel, installation, mise à jour et hors ligne | NON TESTÉ ; cohérence statique vérifiée uniquement |
| Exécution iPhone 16 Pro Max / iOS utilisateur | NON TESTÉ dans cet environnement |
| FPS iPhone, 1% low, latence tactile et mémoire | NON MESURÉ |
| Sauvegarde réelle du propriétaire | NON TESTÉ ; sauvegardes générées pour QA seulement |
| Allers-retours en arrière-plan prolongés sur iOS | NON TESTÉ |

La recette utilisateur iPhone demeure un critère de validation définitive. Ne pas assimiler ces tests ciblés à la recette Équipements 2.0 52/52 réalisée précédemment.
