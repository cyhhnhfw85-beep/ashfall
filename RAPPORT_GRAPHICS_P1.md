# ASHFALL 0.9.1-graphics-p1 — Rapport technique

**Référence source protégée :** ASHFALL 0.9.0-beta.1 Équipements 2.0.  
**SHA-256 de l’archive de référence :** `33af3a454257ff82954a416c90fac97ff8da5306d4561d1143a587e3dafaf58b`.  
**Statut :** build graphique P1 prêt pour recette iPhone, non définitivement approuvé.

## Architecture réalisée

L'intégration est une couche CSS `graphics-p1.css` chargée après les autres feuilles, ciblée strictement sur `body.ashfall-expedition`.
Elle habille les nœuds et événements existants du HUD : `roomTitle`, `hpText`, `hpFill`, `xpDisplay`, `xpFill`, `ashContractHud`, `ashMiniMap`, `ashMiniMapCount`, `bagBtn`, `bagCount`, `pauseBtn`, `joystickZone`, `joyBase`, `joyKnob`.

Aucun nouveau module de logique et aucune classe d'état de gameplay n'ont été ajoutés. Les chiffres restent produits par le moteur. Le joystick conserve `maxShift=Math.min(64,...)`, `radius=46`, la logique des événements pointer et le même positionnement/taille de ses trois surfaces.

## Modifications fichier par fichier

| Fichier | Nature | Risque |
|---|---|---|
| `graphics-p1.css` (ajout) | Style responsive HUD / joystick | Faible à moyen (CSS) |
| `index.html` | Chargement CSS, version, deux libellés statiques | Faible |
| `game.js` | Chaînes d'identification de la version uniquement | Faible |
| `service-worker.js` | Identifiant et liste du cache PWA | Moyen (à tester iOS) |
| `README.md` et documents P1 | Distribution et transparence QA | Aucun sur gameplay |

Les ressources graphiques, CSS préexistants, code du cœur Équipements 2.0 et opérations de sauvegarde sont inchangés.

## Choix de design

- Palette : anthracite `#17242B`, acier bleuté `#293B44`, ivoire `#DCE4E1`, ambre `#C4A16D`, cyan `#79BFC5`.
- Compacité par hiérarchie typographique et réduction des ornements, pas par disparition des valeurs.
- Coin gauche pour secteur, HP, XP, contrat ; droite pour carte cliquable, sac et pause.
- Barres à extrémités douces, bordures discrètes, ombres maîtrisées.
- Joystick visuellement rafraîchi sans modification de la zone, du centre semi-mobile ou du comportement.
- Boutons sac/pause de 44 px minimum dans les quatre formats Chromium testés.

## Mesures de mise en page disponibles

- Affichage de test 390 × 844 CSS px : HUD de référence 130 px de hauteur totale ; nouveau HUD 135 px, avec actions tactiles agrandies.
- Autres largeurs vérifiées : 320 × 700, 375 × 812 et 430 × 932 CSS px.
- Terrain contrôlé dans la zone entre les extrémités du HUD et de la zone du joystick, sans chevauchement mesuré dans ces quatre simulations.
- Note : les positions des éléments sous `safe-area-inset-*` sur un iPhone installé n'ont pas été mesurées physiquement.

## Dépendances et limites

Le serveur/local HTTPS et la navigation Chromium sont bloqués par le navigateur de validation de cet environnement. Les tests interactifs ont été exécutés en mémoire dans Chromium avec styles/scripts originaux intégrés et `localStorage` simulé. Ils testent les fonctions du vrai moteur, mais pas le réseau, le cache persistant Safari ni le rendu exact d'une PWA iPhone.

Le service worker a été vérifié syntaxiquement, avec cohérence de ses URL et de sa liste de préchargement. Un test complet de chargement offline réel sur iPhone demeure obligatoire.

**Aucun relevé FPS iPhone, mémoire Safari/GPU, latence tactile physique ou consommation énergétique n'a été effectué.** L'absence de changement gameplay est appuyée par la comparaison byte à byte après normalisation des deux textes de version modifiés dans `game.js`, et par le contrôle des ressources et du cœur E2.

La maquette évoquée par le cahier sert de direction ; aucune capture de maquette exacte n'était disponible comme référence pixel à pixel dans cette livraison. La conformité esthétique définitive est à valider par le propriétaire sur iPhone.
