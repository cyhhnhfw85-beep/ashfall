# Installer et tester ASHFALL 0.9.2-graphics-p2 sur iPhone

## Préserver la progression

1. Ouvrir **l'ancienne version fonctionnelle** et exporter sa sauvegarde depuis le menu prévu ; conserver une copie indépendante dans Fichiers ou un espace sécurisé.
2. Conserver les archives `ASHFALL_0.9.1_GRAPHICS_P1_1` et `ASHFALL_E2_BETA1` séparément : ne pas écraser les ZIP de référence.
3. Pour une vraie isolation des sauvegardes, utiliser **un autre nom d'hôte HTTPS** (autre origine). Un autre dossier ou dépôt GitHub Pages sous exactement le même nom d'hôte utilise normalement **le même localStorage** ; ce n'est pas une isolation fiable.
4. Éviter de désinstaller la PWA principale ou d'effacer « données du site ». Cela peut supprimer les sauvegardes locales.

## Déployer le jeu entier

1. Décompresser le ZIP et téléverser **tout son contenu** en conservant l'arborescence, y compris le répertoire inédit `assets/visual2/hero/` et les 16 images `assets/weapons_framed/`.
2. Vérifier que `index.html`, `nomad2-renderer.js`, `game.js`, `equipment2-core.js`, `service-worker.js` et les PNG sont bien accessibles aux mêmes chemins et sur **HTTPS**.
3. Ouvrir le site dans Safari ou la PWA de test et vérifier l'identifiant visible **`0.9.2-graphics-p2`**. En cas d'ancien cache, recharger le site, le rouvrir et attendre la mise à jour du service worker ; ne pas effacer les données sans sauvegarde.

## Recette iPhone recommandée

- Vérifier 5 minutes de déplacement avec le joystick dans toutes les directions ; puis une séquence de tirs automatiques dans plusieurs directions.
- Équiper successivement pistolet, SMG, fusil, arme énergétique ; constater que l'image de l'arme correspond bien au modèle affiché dans l'inventaire.
- Équiper/enlever armure, bottes, sac ; vérifier la présence des accents et du sac, et le cas sans équipement optionnel.
- Tester une salle simple et une composite, ainsi qu'un combat avec beaucoup d'effets ; noter fluidité perçue, coupures, double affichage, arme incohérente ou décalage visuel de collision.
- Tester extraction, mort, protection et conservation de configuration ; sauvegarder puis fermer/réouvrir la PWA et contrôler l'état réel.
- Tester le mode avion **après un chargement complet en ligne** ; voir si les sprites restent visibles (sinon, le repli procédural doit apparaître, pas un écran noir).
- Comparer visuellement P1.1 et P2, de préférence avec une sauvegarde exportée indépendante.

## Retour arrière

Sur la même origine, remettre l'intégralité des fichiers **P1.1** (HTML, scripts et service worker), vérifier l'ancienne version affichée, sans modifier ni effacer les données locales. Attention : les données d'une progression réalisée avec de nouvelles versions peuvent ne pas être rétrocompatibles avec des versions très anciennes ; conserver un export pré-mise-à-jour pour restaurer en cas de problème, sur confirmation.

Ne pas tester sur la seule sauvegarde importante sans copie préalable. La recette P2 sur iPhone n'a pas encore été exécutée par l'assistant.
