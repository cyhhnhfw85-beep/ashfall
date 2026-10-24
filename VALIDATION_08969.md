# Vérification ASHFALL 0.8.9.69

## Modifications
- Bonus « Collecteur magnétique » supprimé des nouveaux choix et remplacé dans les listes d'anciens runs déjà sauvegardés, sans réinitialiser les autres bonus.
- Ressources au sol (XP et crédits) automatiquement créditées à la sécurisation d'une salle, y compris après la dernière vague d'arène. Animation de convergence 0,62 s vers le Nomade.
- Les armes restent au sol et ne sont ramassées qu'à proximité. La forme au sol est une silhouette vectorielle générique teintée par rareté ; les illustrations complètes originales restent dans le sac.
- HUD iPhone resserré pour réduire sa hauteur sans déplacer les boutons en dehors de l'écran.
- Les points de recherche ne sont **pas des objets au sol dans ce moteur** : ils restent calculés au bilan de l'expédition à partir des objectifs et de la progression existants.

## Tests effectués
- 119 assertions ciblées sous Chromium en 320, 390 et 430 px ; 119 réussies. Les assertions de ressources sont exécutées atomiquement pour exclure les mises à jour concurrentes par requestAnimationFrame du harnais de test.
- Test complémentaire : boucle d'animation réelle, salle sécurisée, attribution automatique de 38 XP et 61 crédits, arme légendaire conservée au sol, apparition de trois choix de bonus ensuite. Aucun message d'erreur JavaScript.
- Contrôle SHA-256 des illustrations de coffres et armes : identiques à 0.8.9.68.
- Clé de sauvegarde `ashfall_pwa_v1` et prix des coffres inchangés, prise en charge des anciennes listes de bonus incluant magnet.
- Vérification de syntaxe JavaScript `node --check`, puis intégrité du ZIP.

## À confirmer sur matériel réel
Fluidité de l'effet d'aspiration et cadrage HUD sur Safari/PWA iPhone, y compris avec une encoche et une petite largeur d'affichage.
