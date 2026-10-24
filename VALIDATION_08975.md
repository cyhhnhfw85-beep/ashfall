# ASHFALL 0.8.9.76 — Validation de fusion

## Vérifications réalisées

1. **Intégrité** : l'archive de chaque branche d'origine est lisible sans erreur. Les 46 fichiers du dossier `assets/` sont inchangés par rapport à la 0.8.9.70 (SHA-256).
2. **Résolution des conflits** : trois branches intégrées avec la base 0.8.9.74 ; rendu de boss 0.8.9.71 et réduction de dégâts des équipements 0.8.9.73 préservés dans les fonctions de jeu. Les deux feuilles CSS indépendantes sont référencées.
3. **Scripts** : `node --check` réussi sur `game.js`, `identity.js`, `immersion.js` et `service-worker.js`.
4. **Chromium** : démarrage du refuge et passage par les cinq pages sur 320, 390 et 430 px ; démarrage d'une expédition, production d'un état sauvegardé et reprise après rechargement dans un document de test. Aucun événement `pageerror` JavaScript pendant les scénarios couverts.
5. **Cartes** : 60 générations consécutives inspectées ; chacune contient 50 salles, un boss et sept découvertes réparties entre relais, dépôts et signaux de détresse.
6. **Équipement** : trois casques et trois modules présents ; achat du casque Bastion et de l'Amplificateur balistique pour 2 350 crédits et 19 points de recherche au total, configuration sauvegardée ; nouvelle expédition avec résistance `0.10` et multiplicateur dégâts additionnel `0.06` ; bonus figés dans `run.loadout`.
7. **Boss** : reconnaissance fonctionnelle d'un Gardien présent dans une salle de boss ; les fonctions de phase, salves et télégraphes sont incluses dans le moteur. Les trois phases n'ont pas été jouées manuellement sur téléphone.
8. **Progression** : extraction synthétique avec quatre salles et 42 éliminations → progression sauvegardée une fois, une extraction enregistrée ; expédition suivante perdue → une mort, conservation de l'extraction précédente, une salle de plus et aucun insigne attribué à tort.
9. **Anciennes sauvegardes** : snapshots d'expéditions en cours générés sous 0.8.9.70, 0.8.9.71, 0.8.9.73 et 0.8.9.74 chargés dans 0.8.9.76, expéditions reprises sans exception et champs facultatifs absents respectés.
10. **Structure du paquet** : numéro de version du moteur, de l'HTML, des URL versionnées et du cache du service worker harmonisés sur 0.8.9.76.

## Limites et suivi

- Pour permettre l'exécution dans cet environnement, Chromium charge un document autonome avec scripts/styles intégrés et une simulation de `localStorage` ; cela **ne valide pas** le fonctionnement réseau, le déploiement, ni une PWA installée sur iPhone.
- Les tests automatisés ne remplacent pas une expédition entière en conditions réelles ni un combat complet contre le Gardien.
- Les débordements horizontaux hérités des illustrations des Coffres (320–430 px) et du personnage (320–390 px) sont documentés mais non corrigés.
- Test recommandé avant déploiement définitif : exporter une sauvegarde, mettre à jour le site en environnement de test, reprendre une partie existante, finir une extraction et un échec, puis vérifier la PWA et le cache hors ligne sur Safari.
