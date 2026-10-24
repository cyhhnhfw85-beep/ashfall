# ASHFALL — Alpha PWA 0.8.9.77 | Clean Core

Cette livraison réalise une **consolidation conservatrice** du ZIP jouable **0.8.9.76**. Le code fonctionnel restant, les graphismes affichés, les contrôles et les formats de sauvegarde sont inchangés ; seules 10 fonctions non référencées ont été retirées du moteur, après analyse syntaxique.

## Contenu
- `index.html` : application et refuge
- `game.js`, `identity.js`, `immersion.js` : moteur et enrichissements
- `*.css` : styles existants par responsabilité
- `service-worker.js`, `manifest.webmanifest`, `icon-*.png` : installation et mode hors ligne
- `assets/chest_*.webp`, `assets/nomade/*.png`, `assets/weapons_framed/*.png` : sources graphiques conservées (leurs copies embarquées dans le code pilotent l’affichage actuel)
- `CHANGELOG_08977.md`, `AUDIT_CLEAN_CORE.md` : changements et audit avant/après

## Installation et sauvegardes
1. Depuis la version déjà installée, **exporter la sauvegarde** à l’aide du bouton « Sauvegarde ».
2. Déployer **l’ensemble des fichiers** de cette archive à la racine du même site HTTPS en conservant sa même origine.
3. Vérifier l’affichage de la version **0.8.9.77**, puis employer « Vérifier la version » si un ancien cache subsiste.
4. Vérifier la reprise de la partie et les principaux menus sur le téléphone réel.

Ne pas effacer les données du site, ne pas désinstaller la PWA avant sauvegarde, ne pas changer de domaine sans export/import : la sauvegarde repose sur `localStorage` et reste propre à l’origine du site.

## Compatibilité
La clé `ashfall_pwa_v1`, la sauvegarde de secours `ashfall_pwa_v1_recovery`, le marqueur `ashfall_pwa_v1_lastok`, et le schéma `version:1` sont préservés. Toutes les fonctions de combat, d’inventaire, de progression, d’extraction et de chargement restent à l’identique.

## Limites
Consulter `AUDIT_CLEAN_CORE.md` pour les tests exécutés, les risques restants et les vérifications sur Safari iPhone non réalisées dans cet environnement. Le rendu des armes tenues et les débordements d’interface hérités ne sont pas modifiés.
