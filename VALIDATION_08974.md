# Validation 0.8.9.74

## Résultat des contrôles automatisés Chromium

1. 320, 390 et 430 px : quatre parcours, quatre défis de secteur, cinq familles, six insignes présents et affichés sans débordement horizontal ni exception JavaScript.
2. Navigation : onglet Secteurs et dossier de maîtrise accessibles après le tutoriel.
3. Ancienne sauvegarde sans `longTerm` : six extractions reconnues, Nomade déjà possédé reconnu, aucun historique de salles ou d'éliminations inventé.
4. Décompte synthétique : huit salles, 65 ennemis, une arme, deux secteurs débloqués ; même rapport ignoré au second appel.
5. Insigne : Traqueur déverrouillé après 65 éliminations ; sélection sauvegardée dans `ashfall_pwa_v1`.
6. Fin de partie réelle (simulation du moteur `finish(true)`) : gains de crédits et recherche existants, arme conservée, progression K-17 et sauvegarde cohérentes.
7. Échec réel (`finish(false)`) : crédits inchangés, éliminations/salles comptées, arme perdue non comptabilisée, secteur non validé, sauvegarde conforme.
8. `node --check` exécuté pour `game.js` et `service-worker.js`.
9. Intégrité des fichiers du ZIP et présence de `longterm-phase.css` vérifiées à la livraison.

## Limites

Le test de chargement a été exécuté dans un document autonome avec Chromium, car la navigation `localhost` et `file://` est bloquée par l'environnement. Une validation tactile sur Safari iPhone et une session complète d'expédition restent nécessaires.
