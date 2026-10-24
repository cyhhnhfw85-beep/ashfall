# Phase 1A — Contrôles de conformité

Référence logicielle examinée : `ashfall_v63`, sans altération des fichiers de production.

## Source et identité

- 40 symboles SVG (`<symbol>`) uniques, fichier vectoriel valide.
- 41 tokens de conception centralisés, exportés en JSON et CSS.
- 16 illustrations d'armes recadrées présentes dans la source 0.8.9.63.
- 9 illustrations de coffres présentes dans la source 0.8.9.63.
- 70 occurrences Unicode pictographiques détectées dans HTML/JS historiques, à migrer lors de l'intégration ; le kit **ne prétend pas les avoir déjà remplacées dans le jeu**.
- Aperçu construit avec les vraies images existantes (images embarquées dans le HTML de démonstration uniquement).

## Test d'affichage Chromium

| Largeur | Débordement horizontal | 5 onglets | Images | Erreurs JS |
|---|---|---|---|---|
| 320 px | Aucun | Oui | 6/6 chargées | 0 |
| 390 px | Aucun | Oui | 6/6 chargées | 0 |
| 430 px | Aucun | Oui | 6/6 chargées | 0 |
| 1120 px | Aucun | Oui | 6/6 chargées | 0 |

**Limite :** ces tests portent sur la *maquette*, pas sur une nouvelle version du jeu. La compilation et les régressions de l'expédition doivent être exécutées lors de la phase d'intégration. Pas de validation Safari physique à ce stade.

## Protection du jeu

Aucun fichier de `ashfall_v63` n'a été modifié ; la clé de sauvegarde, les probabilités, les prix, la génération, la physique et l'extraction restent donc inchangés par cette livraison documentaire.
