# ASHFALL 0.9.1-graphics-p1.1 — Reprise artistique HUD

## Source et sécurité
- Développé sur une copie de `ASHFALL_0.9.1_GRAPHICS_P1(2).zip` ; la source fonctionnelle protégée reste `ASHFALL 0.9.0-beta.1` (SHA-256 `33af3a454257ff82954a416c90fac97ff8da5306d4561d1143a587e3dafaf58b`).
- Aucune modification d'économie, statistiques, IA, collisions, contrôles, loot, mécanismes E2 ou schéma de sauvegarde.
- Les 52 contrôles iPhone de la bêta restent une recette utilisateur antérieure, pas une recette P1.1.

## Changements réels
- `index.html`: restructuration du seul HUD d'expédition avec avatar, état PV/XP, contrat séparé, carte ronde et actions verticales, sans changement d'ID ni d'événement ; messages de version actualisés.
- `graphics-p1.css`: nouvelle feuille CSS premium **réécrite** : disposition flottante dans les coins, palette et matériaux, mini-carte circulaire, joystick uniquement cosmétique.
- `assets/hud/nomad-badge.png` (nouveau) : recadrage du portrait de la maquette artistique **fournie par le propriétaire du projet** ; illustration d'interface uniquement, indépendante de l'arme portée.
- `game.js`: chaînes de version ; **une seule expression de rendu HTML du contrat** séparant le nom de la progression, avec échappement `uiSafe`. Aucun autre changement de logique.
- `service-worker.js`: clé de cache `ashfall-0901-graphics-p1-1`, query strings `0901g11`, mise en pré-cache du badge. L'ancien gestionnaire SW et les règles hors ligne sont inchangés.
- Documentation : présent changelog, rapport technique, validation, procédure iPhone et README.

## Hors périmètre
Aucun Nomade/ennemi/boss/décor 2.0, refonte de refuge, changement des hitboxes, restitution économique, ajout de boutons ou mécanisme de joystick.

## Retour arrière
La P1 originale et la 0.9.0-beta.1 sont conservées sous forme d'archives ZIP intégrales distinctes. Le retour arrière consiste à redéployer **une archive complète**, pas à remplacer une CSS isolée avec une structure HTML incompatible.
