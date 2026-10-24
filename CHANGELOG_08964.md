# ASHFALL 0.8.9.64 — Identité tactique (Phases 1B + 1C)

Base technique : 0.8.9.63. Charte utilisée : DS-1A.1.

## Refuges et inventaires
- Navigation à cinq onglets avec pictogrammes SVG industriels (bibliothèque centrale de 39 symboles).
- Palette bleu nuit, acier, ambre et cyan, bordures, typographie, boutons et composants harmonisés.
- Accueil, survivant, atelier, marchand, secteurs et coffres intégrés visuellement.
- Cartes d'armes et textes du sac harmonisés ; correctif d'un nom d'arme affiché verticalement.
- Illustrations d'armes et de coffres conservées sans modification.

## Expédition
- HUD vie / expérience / sac / carte / pause harmonisé.
- Panneaux pause, inventaire, carte, fin de partie et fenêtres contextuelles harmonisés.
- Tutoriel et choix de bonus équipés de pictogrammes SVG plutôt que d'émojis.
- Messages d'état affichés avec pictogrammes sémantiques ; indicateurs d'incident sur le canvas redessinés en vecteurs.
- Transitions limitées, conservation des zones tactiles et des dimensions des contrôles.

## Compatibilité
- Clé de sauvegarde inchangée : `ashfall_pwa_v1`.
- Pas de modification du gameplay, de la génération des salles, des armes, des images, des achats, des probabilités, de l'économie, ni des délais d'extraction.
- Nouveau cache SW `ashfall-08964-identite-tactique` et URLs de tous les styles/scripts en `?v=08964`.
- Composants livrés en fichiers indépendants : `identity-tokens.css`, `identity-components.css`, `identity-integrated.css`, `identity.js` ; sprite SVG embarqué dans `index.html`.

## Vérifications
- Chromium : 27 contrôles d'interface sur 320/390/430 px ; 51 contrôles économiques, de sauvegarde et d'identité des médias : 78/78.
- Syntaxe JavaScript vérifiée avec Node.js ; contenu ZIP vérifié par CRC.
- Safari / installation PWA sur iPhone réel : à valider sur appareil.
