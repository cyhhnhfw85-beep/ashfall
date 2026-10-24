# ASHFALL 0.8.9.50 — Phase 3A : dangers tactiques

Base : 0.8.9.49 Polish Interactifs.

- Les nouvelles expéditions reçoivent, dans certaines salles standards, des **barils instables** ou des **modules électriques** destructibles. Les anciennes expéditions actives conservent leur disposition et ne reçoivent aucun nouvel obstacle.
- Les tirs automatiques peuvent cibler un module situé près d’ennemis, depuis une distance de sécurité. Les tirs qui traversent un module peuvent aussi le déclencher.
- Une fois touché, le module annonce son explosion pendant 0,85 s et marque le rayon de danger au sol ; il inflige des dégâts aux ennemis et peut blesser le joueur proche.
- Un module détruit reste détruit, sa collision disparaît et son état est conservé dans la sauvegarde d’expédition.
- Les explosions ne génèrent pas de butin bonus. Un ennemi abattu peut laisser son butin habituel.
- Le refuge, les graphiques approuvés, les coffres, la mécanique d’extraction et l’économie restent inchangés.

Test recommandé : ouvrir une nouvelle expédition, trouver un module, attirer un ennemi près de lui, déclencher son explosion, quitter puis revisiter la salle, et vérifier la sauvegarde/extraction.
