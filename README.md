# ASHFALL 0.8.9.61 — Rééquilibrage économique des coffres

La version précédente permettait un accès trop rapide aux armes aléatoires par achats. Cette mise à jour relève exclusivement le prix des trois coffres du refuge :

- Commun : **900 crédits** — 78 % commun, 20 % rare, 1,9 % épique, 0,1 % légendaire.
- Rare : **2 800 crédits** — 35 % commun, 55 % rare, 9 % épique, 1 % légendaire.
- Épique : **7 500 crédits** — 6 % commun, 34 % rare, 52 % épique, 8 % légendaire.

Une seule arme par coffre, résultat et débit sauvegardés atomiquement avant l'animation. La revente des achats reste plafonnée à 25 % du prix payé. Aucun changement de génération de salles, récompenses d'expédition, probabilités, statistiques des armes, graphismes, durées ou sauvegardes.

Les anciennes armes achetées gardent leur purchasePrice d'origine pour calculer leur prix de revente : ce champ n'est pas recalculé rétroactivement.

Installation : remplacer les fichiers du site et vérifier l'affichage de la version 0.8.9.61. Exporter la sauvegarde avant déploiement ; stockage ashfall_pwa_v1 inchangé.
