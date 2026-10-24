# ASHFALL — Rapport de validation globale 0.8.9.55

**Référence examinée :** 0.8.9.54. **Version livrée :** 0.8.9.55.

## Décision
**VALIDATION TECHNIQUE FAVORABLE, sous réserve de validation sur iPhone.**
La seule modification fonctionnelle apportée à la version livrée est de garantir la présence des quatre formats de salles dans chaque nouvelle expédition. Toutes les cartes déjà sauvegardées, les mécaniques de combat, l'économie, les objets, les graphismes et les sauvegardes restent inchangés. Le cache et le numéro de version ont été mis à jour.

## Anomalie identifiée et corrigée
Une carte sur les 150 premières générations examinées ne contenait aucune salle en L. Le générateur tirait chaque salle indépendamment sans minimum par forme. La 0.8.9.55 garantit au moins un exemplaire de 1×1, 2×1, 1×2 et L, sans modifier les 50 salles logiques ni leur graphe de connexions.

## Résultats des tests techniques
- **33/33 tests globaux réussis** : initialisation, 400 nouvelles cartes, connexité, quatre formes garanties, ressources/points spécifiques, sauvegarde principale et de récupération, reprise simulée, récupération de snapshot corrompu, choix de bonus temporaire, extraction validée/annulée/relancée/terminée, décès et reprise au refuge, trois largeurs mobiles.
- **400 cartes × 50 salles = 20 000 salles générées** ; cartes connectées dans 100 % des échantillons ; quatre formes présentes dans chaque carte. Les sorties, arènes, avant-postes et caches restent en place.
- **14/14 régressions réussies** sur les embuscades/coffres, transitions, sélection prudente des explosifs et extraction.
- **18/18 tests d'équilibrage/génération réussis** sur 120 autres cartes : caches secrètes, terminaux, scanners, récompenses et incidents. Entre 6 et 9 incidents par carte dans cet échantillon, moyenne ~6,43.
- **6 parcours automatisés de 50 salles = 300 entrées/rendus**, sans exception de rendu. Ce test entre directement dans les salles : ce n'est PAS une partie jouée normalement à la manette.
- Test navigateur sur tailles 320, 390 et 430 px : pas de débordement horizontal observé.
- Le cache statique a respecté le plafond configuré à 2,4 millions de pixels (~9,6 Mio RGBA théorique, hors mémoire additionnelle du navigateur) durant les parcours.

## Limites importantes
L'environnement de test bloque la navigation vers un serveur HTTP/HTTPS local. Pour effectuer les tests, le HTML et le JavaScript ont été injectés dans Chromium ; le stockage a été simulé entre deux sessions. Il ne s'agit pas d'un test réel de `localStorage` dans Safari, d'un test du service worker, de l'installation PWA ou du fonctionnement hors ligne sur iPhone.

Le temps mesuré pour quelques appels individuels de rendu est faible dans Chromium de bureau, mais ce test n'établit PAS un framerate mobile. Les simulations ne remplacent pas une partie complète jouée de la salle 1 jusqu'à l'extraction avec les contrôles tactiles.

Un point à surveiller si les performances chutent fortement : le moteur limite actuellement `dt` à 33 ms par trame ; sous 30 FPS, les minuteries de gameplay peuvent durer plus longtemps en temps réel. Ne pas modifier sans relevé sur appareil réel.

## Recette finale conseillée sur iPhone
1. Exporter une sauvegarde avant de mettre à jour l'hébergement.
2. Vérifier `0.8.9.55` dans l'accueil ; lancer une nouvelle expédition.
3. Rencontrer une salle 1×1, 2×1, 1×2 et L ; franchir des portes dans les deux sens.
4. Tester au moins un coffre, une embuscade, un terminal, une cache secrète et un destructible.
5. Enregistrer pendant une expédition, fermer l'application, revenir et reprendre la partie.
6. Activer une extraction : trois secondes de charge, 12 secondes affichées au centre, annulation en quittant le cercle, puis une extraction réussie.
7. Vérifier les crédits, l'inventaire et les bonus temporaires au retour. Mesurer l'absence de saccades sur les grandes salles en L et pendant les embuscades.

**Recommandation :** ne pas développer de nouvelles mécaniques majeures avant cette recette sur iPhone. Ensuite seulement, passer à la boucle globale progression/difficulté/rétention et à des sessions de jeu suffisamment longues pour collecter des données fiables.
