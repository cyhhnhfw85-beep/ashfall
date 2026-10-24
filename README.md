# ASHFALL — Phase 1A / Fondation visuelle

Kit **non jouable** de direction artistique, bâti à partir de la version **0.8.9.63**. Il n'écrit rien dans les données utilisateur. Il ne modifie ni le gameplay ni les sauvegardes.

- `CHARTE_VISUELLE.md` : règles définitives (couleurs, typography, rayons, raretés, images, animation).
- `assets/ash-ui.css` : tokens et composants préfixés `ash-ui-*`, sans surcharge du jeu existant.
- `assets/ash-icons.svg` : bibliothèque vectorielle de pictogrammes industriels.
- `tokens.json` : mêmes tokens en données structurées.
- `INVENTAIRE_EXISTANT.md` : état réel des pictogrammes et des surfaces à migrer.
- `PLAN_INTEGRATION.md` : ordre de migration groupée + critères de tests.
- `preview/ASHFALL_1A_Apercu.html` : maquette autoportante consultable dans un navigateur ; **ce n'est pas le jeu**.
- `preview/ASHFALL_1A_Mobile.png` et `preview/ASHFALL_1A_Desktop.png` : captures de la maquette.

## Utilisation au prochain chantier

Charger la feuille `ash-ui.css` après `game.css`, copier les symboles inline en haut de `index.html`, puis activer les classes et l'icône de chaque emplacement. Ne pas renommer directement les anciennes classes, car leurs spécificités CSS sont encore utilisées par le moteur. La maquette est un contrat d'identité et non une preuve de fonctionnement de l'expédition.
