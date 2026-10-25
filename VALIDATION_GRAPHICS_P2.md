# Validation — ASHFALL 0.9.2-graphics-p2

## Tests réellement exécutés

- **113/113 contrôles automatisés ciblés** dans Chromium et vérification statique (résultat enregistré dans le rapport de travail). Cela comprend les contrôles d'intégrité des archives, l'absence de modification des autres fichiers de gameplay/Équipements 2.0, les caches PWA et le chargement des 22 images nécessaires.
- Largeurs **320, 375, 390 et 430 px CSS**, sans erreur JavaScript observée ; HUD et joystick visibles, zone de terrain non réduite, boutons sac/pause de 44 px.
- Huit directions de jambes (poses de mouvement distinctes), 16 angles de visée (variation du rendu), quatre images de classes d'armes, bascule des marquages armure/bottes/sac et face/profil/dos, cas sans équipement facultatif.
- Mini-carte, sac, pause, joystick tactile, relâchement, déplacement effectif du personnage et reprise d'une sauvegarde dans le schéma `ashfall_pwa_v1`.
- Défaillance simulée d'un sprite requis : `AshNomad2.draw` renvoie `false`, le jeu démarre avec le Nomade procédural, sans erreur JavaScript dans le scénario.
- Essai supplémentaire : état Équipements 2.0 multislots validé par `E2.validateRun()` dans un scénario de test et capture réelle en expédition. Salle composite : caméra relevée à zoom **0,84**, sans erreur JavaScript.
- Comparaison sur une même sauvegarde P1.1 → P2 : mêmes progression, PV, sac et terrain ; P2 change uniquement le Nomade en scène.
- Enregistrement **WebM 390×844, environ 4,76 secondes**, via navigateur Chromium en jouant au joystick, non vidéo conceptuelle.
- Vérification `node --check` des scripts ; archive finale inspectée et réextraite.

## Limites non exécutées

| Test | Statut |
|---|---|
| Safari iPhone 16 Pro Max / iOS sur PWA réellement installée | **NON TESTÉ** |
| Fonctionnement réseau hors ligne d'un service worker actif | **NON TESTÉ** (navigateur de test refuse la navigation vers localhost) |
| FPS, 1% low, latence toucher et consommation RAM iPhone | **NON MESURÉ** |
| Longues sessions avec plusieurs milliers de tirs / effets cumulés | **NON TESTÉ** |
| Extraction et mort complètes depuis les 50 salles | **NON REJOUÉES** sur P2 |
| Tous les quinze modèles, toutes les combinaisons d'équipement | **NON TESTÉ EXHAUSTIVEMENT** |
| Animation upper body 8 directions distinctes | **NON IMPLÉMENTÉE** (3 vues + miroir, arme visée continue) |

La recette historique 52/52 du moteur Équipements 2.0 reste une **déclaration utilisateur pour une version précédente**, pas un test automatique ni un test iPhone de cette version P2.

## Régression par comparaison de code

La comparaison contre P1.1 démontre que le contenu de `game.js` est identique après normalisation de la version et substitution de l'unique bloc de dessin du Nomade. La fonction d'origine reste intacte. Le cœur Équipements 2.0 et les autres scripts de gameplay n'ont pas été modifiés. Ce contrôle réduit les risques mais n'équivaut pas à rejouer chaque mécaniques de bout en bout.

**Statut final : candidat P2 à valider par l'utilisateur sur iPhone.**
