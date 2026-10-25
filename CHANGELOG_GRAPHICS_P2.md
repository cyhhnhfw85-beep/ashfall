# ASHFALL 0.9.2-graphics-p2 — Nomade 2.0

Base : **ASHFALL 0.9.1-graphics-p1.1 — HUD Premium**. Référence historique fonctionnelle protégée : **ASHFALL 0.9.0-beta.1 — Équipements 2.0**.

## Modifications
- Nouvelle couche de rendu graphique `nomad2-renderer.js`, chargée avant `game.js` et utilisée **uniquement dans le dessin du Nomade**, sans modifier les règles du combat.
- Six véritables sprites transparents composables du Nomade issus de la planche graphique révisée approuvée : torse face, profil, dos, deux jambes, sac.
- Animation des deux jambes indépendante selon huit directions de déplacement, avec cycle de pas et oscillation ; torse choisi selon la visée (avant/profil/dos), profil miroir et léger mouvement continu ; arme orientée en continu.
- Réutilisation des seize PNG transparents d'armes **déjà présents** et association au nom du modèle effectivement porté. Le tir réel est prioritaire pour orienter l'arme lorsqu'un projectile récent est disponible.
- Apparences complémentaires selon armure, bottes et sac effectivement équipés : marquages de rareté discrets, signes de modèles d'armure, sac distinct. Indices discrets pour module et artefact.
- Dessin procédural d'origine maintenu comme fallback, avant tout dessin si une image requise est absente ou non chargée.
- Version du moteur, de la page et du cache PWA incrémentées ; inclusion des nouveaux sprites et des 16 armes dans le pré-cache hors ligne.

## Non modifié
Mouvement, joystick, HUD P1.1, collisions, IA, combat automatique, ennemis, boss, tirs, coffre, extraction, marchands, économie, progression, Équipements 2.0, sauvegardes, migration et clé `ashfall_pwa_v1`.

## Concessions de cette première livraison
- Trois vues de torse (face, profil et dos, profil miroir), et non huit planches artistiques du torse ; l'arme reste néanmoins en orientation continue.
- Les armures/bottes ne disposent pas encore de sprites distincts pour chaque modèle : base tactique et marquages par modèle/rareté ; le sac dispose d'une couche visuelle séparée.
- Les éléments du personnage restent dessinés sur un Canvas interne 360 × 400 soumis au `image-rendering:pixelated` hérité. Aucun changement risqué de résolution Retina.
- Les animations de rechargement figurant dans la planche sont conceptuelles : pas de nouvelle mécanique de munitions/rechargement.

Statut : **candidat à recette iPhone**, non validé sur Safari iOS.
