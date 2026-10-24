# ASHFALL 0.8.9.56 — HUD et mini-carte d'expédition

Base : version 0.8.9.55, sans changement de difficulté ni de récompenses.

- Mini-carte visible en haut à droite, un appui l'agrandit.
- Carte tactique affichant chaque salle découverte avec son empreinte 1×1, 2×1, 1×2 ou en L.
- Vie très visible en rouge, points de vie actuels/maximaux ; expérience en bleu avec niveau et progression.
- Bouton SAC avec nombre d'objets transportés / 6 constamment visible.
- Suppression de la bannière permanente de mission, des conseils textuels et du journal flottant, sans retirer les annonces de danger importantes dessinées dans l'environnement.
- Ne modifie ni les collisions des salles, ni les objets, ni l'économie, ni les sauvegardes.

Validation : HUD, boutons et carte vérifiés en 320, 390 et 430 px ; 33/33 tests techniques réussis (400 cartes générées, sauvegarde/reprise, extraction, mort et collisions), aucune erreur JavaScript détectée pendant ces tests. Le rendu et les performances Safari iPhone doivent être vérifiés sur l'appareil. Exporter la sauvegarde avant déploiement.
