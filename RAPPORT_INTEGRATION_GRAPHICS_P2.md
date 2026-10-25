# ASHFALL 0.9.2-graphics-p2 — Rapport d'intégration

## Source et sauvegarde

- Source choisie : archive utilisateur `ASHFALL_0.9.1_GRAPHICS_P1_1 (1).zip`, SHA-256 **`e43cc21b94e15f725f96b1ea1730da2e19ac4d3de25d2256ffd196eb90f3afbd`**.
- Référence fonctionnelle : `ASHFALL_E2_BETA1(3).zip`, SHA-256 **`33af3a454257ff82954a416c90fac97ff8da5306d4561d1143a587e3dafaf58b`**.
- Travail réalisé dans un répertoire de copie distinct. Aucune modification des archives d'origine.
- Version nouvelle : **0.9.2-graphics-p2** ; cache SW `ashfall-0902-graphics-p2`.

## Fichiers modifiés

| Fichier | Modification | Domaine |
|---|---|---|
| `game.js` | Chaines de version et remplacement exclusif de l'appel de dessin du Nomade par adaptateur conditionnel avec fallback ; lecture de la direction des balles existantes | Rendu, pas gameplay |
| `index.html` | Chargement du module avant `game.js`, chaînes et requêtes versionnées | Distribution |
| `service-worker.js` | Nouveau cache, chemins de versions, pré-cache des images requises | PWA |

## Fichiers ajoutés

- `nomad2-renderer.js` : état visuel temporaire, rendu Canvas articulé, adaptateur des équipements et images, fallback.
- 6 sprites PNG `assets/visual2/hero/`, 1 manifeste de ressources `assets/visual2/manifest.json`.
- `CHANGELOG_GRAPHICS_P2.md`, `REGISTRE_RESSOURCES_GRAPHICS_P2.md`, `RAPPORT_INTEGRATION_GRAPHICS_P2.md`, `VALIDATION_GRAPHICS_P2.md`, `INSTALLATION_IPHONE_GRAPHICS_P2.md`.

Aucun ancien asset n'a été remplacé. `equipment2-core.js`, `immersion.js`, `game.css`, `equipment2.css`, `graphics-p1.css` et toutes les anciennes images sont strictement identiques à P1.1.

## Architecture de rendu

1. Le moteur historique exécute les mêmes mises à jour de positions, collisions, IA, combat et caméra.
2. À la place du seul dessin procédural, `AshNomad2.draw` lit la position, les huit directions des jambes, la visée, l'arme et les objets actifs des six slots, sans écrire l'état.
3. Torse : faces front/profil/dos ; jambes : deux calques animés selon une direction discrète parmi huit ; arme : PNG du modèle réel rotatif selon un angle continu.
4. Quand une balle récente du joueur existe, son vecteur de vitesse devient la référence de direction graphique pour refléter la dispersion et les cibles tactiques. Sinon, le même choix de cible visuelle que le moteur est consulté en lecture seule.
5. Si une ressource de la pose est indisponible, le rendu existant `drawNomadGameplay` est invoqué. Aucun ancien dessin n'est supprimé.

## Contraintes et limites connues

- Les vues détaillées dérivées de la planche utilisateur sont simplifiées à 360×400. Trois orientations du torse et miroir latéral, pas huit silhouettes de buste dessinées distinctes ; articulation continue principalement assurée par bras/arme. L'animation du mouvement est une recomposition de jambes et oscillation, et non une séquence d'atlas complète.
- Correspondance d'armes exacte pour 16 modèles historiques. Pour un nouveau modèle non connu, fallback historique.
- Les traits de finition armure/bottes sont contextuels mais pas de nouvelles illustrations autonomes pour les quinze modèles.
- Le Canvas et le joystick sont inchangés : résolution interne 360×400 et interpolation CSS héritée. L'amélioration de netteté Retina est un sujet séparé.
- La baisse de performance potentielle des images supplémentaires n'est **pas chiffrée sur iPhone**. Les effets, ennemis, décors, coffre, interfaces Refuge ne sont pas modifiés.

## Captures

Les captures `P2_320px.png`, `P2_375px.png`, `P2_390px.png`, `P2_430px.png`, `P2_EQUIPMENT_390px.png` et `P2_COMPOSITE_390px.png` proviennent d'une **véritable exécution du jeu en Chromium**. Les dernières utilisent des états de test contrôlés, sans modification du code livré. Le comparatif `ASHFALL_P2_AVANT_APRES_390.png` juxtapose P1.1 et P2 sur une même sauvegarde créée par le jeu. Une vidéo de déplacement réel via joystick est jointe séparément.

## Statut

Candidat **jouable et testable**, non définitivement accepté artistiquement ni validé sur Safari iOS. Ne commencer aucune étape 3/6 sans accord.
