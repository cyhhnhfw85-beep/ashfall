ASHFALL - Module IMMERSION 0.8.8 (ajout sans remplacement du jeu)

IMPORTANT : ce ZIP n'est PAS une mise à jour complète de l'Alpha 0.8.7.
Il contient un fichier complémentaire, pour garder intact game.js et ses sprites.

INSTALLATION SUR GITHUB
1) Faire une copie de sauvegarde dans le jeu.
2) Ajouter immersion.js à la racine du dépôt, à côté de game.js.
3) Dans le index.html ACTUEL de la version 0.8.7, ajouter juste avant </body> :
   <script src="immersion.js?v=088" defer></script>
4) Ne PAS remplacer game.js, index.html, game.css, ni service-worker.js par ceux de 0.8.6.
5) Pour installer en mode PWA et hors ligne, modifier le service-worker.js ACTUEL :
   - changer le nom du CACHE (par exemple suffixe -088)
   - ajouter './immersion.js?v=088' au tableau FILES.
6) Vérifier Actions -> déploiement terminé, actualiser dans Safari.

EFFETS AJOUTÉS
- Son optionnel activable via le bouton Son (désactivé par défaut).
- Signal sonore pour ramassage, victoire, arène, découverte.
- Particules légères au-dessus du canvas, désactivables.
- Option effets réduits pour économie de ressources.
- Sauvegarde des préférences séparée : ashfall_immersion_preferences_v1.

LIMITES
- Le module ne remplace pas les sprites, ni ne peut simuler de vrais impacts localisés.
- Pour une VRAIE Alpha 0.8.8 intégrée (éclairage, sons des armes, particules d'impact localisées), fournir le ZIP source Alpha 0.8.7 afin de préserver toute la progression du projet.
