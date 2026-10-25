# ASHFALL 0.9.1-graphics-p1 — Procédure iPhone

## 1. Préserver sa progression

1. Dans la PWA 0.9.0-beta.1 actuelle, exporter manuellement la sauvegarde et stocker une copie dans Fichiers / iCloud, hors du jeu.
2. Conserver le ZIP d'origine **0.9.0-beta.1** et la version 0.8.9.78b historique.
3. Ne pas désinstaller la PWA ni supprimer ses données Safari ; une suppression peut effacer les sauvegardes locales.

## 2. Test conseillé sans risque pour la partie principale

1. Déployer le ZIP P1 dans un dossier d'hébergement **HTTPS sur une origine différente** de la PWA principale (autre sous-domaine). Chaque origine possède son stockage local distinct.
2. Ouvrir la nouvelle adresse depuis Safari, vérifier le numéro `0.9.1-graphics-p1` dans le refuge, puis installer cette adresse sur l'écran d'accueil si le test PWA est souhaité.
3. Pour tester avec la progression réelle, **importer une copie exportée** de la sauvegarde principale dans la PWA de test ; ne pas écraser l'original.
4. Tester les 320/375/390/430 CSS px en simulation, puis réellement sur iPhone : santé, XP, contrat, mini-carte, sac, pause, joystick et absence de chevauchement.
5. Faire une expédition complète incluant coffres, mort ou extraction, reprise après fermeture et hors-ligne après premier chargement complet.

## 3. Si l'on remplace le déploiement sur la même origine

Le stockage `ashfall_pwa_v1` est conservé si l'origine et les données du navigateur ne changent pas ; effectuer néanmoins l'export avant. Déployer **tous** les fichiers ensemble, pas seulement `index.html` ou `graphics-p1.css`. Le nouveau service worker utilise le cache `ashfall-0901-graphics-p1`; lors du premier lancement, attendre le chargement, fermer et rouvrir si l'ancienne interface reste visible. Vérifier toujours `0.9.1-graphics-p1` avant le test.

## 4. Retour arrière

- Si la PWA de test utilise une autre origine : revenir simplement à la PWA originale et conserver sa sauvegarde ; aucun retour arrière du déploiement principal n'est nécessaire.
- Si la version 0.9.1 remplaçait le même site : redéployer **tous** les fichiers de 0.9.0-beta.1, charger en ligne jusqu'à réactivation du service worker précédent et vérifier la version. Ne pas vider le stockage ou effacer les données du site.
- Éviter de charger une sauvegarde ayant été modifiée par une future version incompatible dans une version antérieure ; sur P1, les schémas de données n'ont pas changé.
- Si nécessaire, réimporter la copie exportée et validée depuis l'interface prévue, après avoir sauvegardé aussi l'état courant.

## 5. Résultat attendu et limites

La version visible doit indiquer `0.9.1-graphics-p1`. HUD compact aux coins, joystick au centre inférieur, mini-carte ouvrable, sac et pause accessibles, expédition 50 salles inchangée.

**Aucune recette réelle iPhone ni test PWA offline n'a été exécuté par l'assistant dans cet environnement.** Consigner les anomalies et revenir à la référence si le joystick, l'affichage ou la sauvegarde se comportent différemment.
