# ASHFALL 0.8.9.55 — Validation globale / Correctif de variété

Base : ASHFALL 0.8.9.54. Jeu complet, refuge et économie inchangés.

## Seule modification fonctionnelle
Le générateur garantit désormais la présence des quatre formes (1×1, 2×1, 1×2, L) dans chaque NOUVELLE expédition. Cette correction ne change pas les cartes, récompenses, distances, dégâts, sauvegardes ou systèmes d'extraction existants.
Les anciennes expéditions restent inchangées. Le nom de version et le cache PWA ont été actualisés.

## Couverture des tests
- Génération de plusieurs centaines de cartes et connexité des 50 salles.
- Comptage des sorties, arènes, caches et avant-postes.
- Sauvegarde et récupération après altération de la copie principale, par simulation de stockage.
- Extraction activée, annulée, réactivée, puis terminée avec retour au refuge.
- Rendu des quatre formes dans Chromium et contrôles 320, 390 et 430 px.
- Tests de régression des versions 0.8.9.53/54 pour les coffres, embuscades, récompenses et incidents.

## Limites de la validation
Le chargement HTTP/HTTPS local est bloqué dans l'environnement de test : le navigateur exécute HTML/JS injectés et un stockage local simulé. Cela ne constitue PAS un test Safari, iOS, service worker, hors-ligne ou de 60 FPS sur appareil réel. Aucun parcours humain exhaustif des 50 salles n'a été réalisé.

## Installation sur iPhone
Exporter votre sauvegarde avant de remplacer les fichiers publiés sur votre hébergement. Vérifier « 0.8.9.55 » dans l'accueil, puis lancer une nouvelle expédition pour obtenir les quatre formes garanties. Ne pas effacer le stockage Safari/PWA sans sauvegarde.
