# Registre des ressources — Nomade 2.0

## Origine et traitement

Les **six nouveaux PNG à transparence réelle** ont été extraits et détourés de la planche utilisateur `ASHFALL_Nomade_Planche_Revisee_Decision_51(1).png`. Ils sont dérivés de la référence artistique transmise par le responsable du projet. Ils ne proviennent pas du montage promotionnel et ne sont pas des captures simulant l'intégration. Les scripts de retouche ne font pas partie du ZIP jouable. Les fichiers d'origine du projet restent byte-identiques.

| Fichier dans le ZIP | Taille native | Rôle de rendu |
|---|---:|---|
| `assets/visual2/hero/torso-front.png` | 151 × 115 | Haut du corps, capuche et armure — face |
| `assets/visual2/hero/torso-side.png` | 106 × 145 | Haut du corps — profil, miroir pour l'autre sens |
| `assets/visual2/hero/torso-back.png` | 125 × 150 | Capuche et haut du corps — dos |
| `assets/visual2/hero/leg-left.png` | 77 × 102 | Jambe gauche et botte, animées séparément |
| `assets/visual2/hero/leg-right.png` | 79 × 102 | Jambe droite et botte, animées séparément |
| `assets/visual2/hero/pack.png` | 160 × 111 | Couche de sac tactique (conditionnée au slot équipé) |
| `assets/visual2/manifest.json` | texte | Dimensions et ancres documentaires ; n'affecte pas les données de jeu |

Les sprites sont rendus entre 23–41 unités de largeur selon le calque. La hitbox du Nomade demeure de rayon 12 unités et ne découle **jamais** de l'image. Aucun atlas géant ou texture d'arrière-plan n'a été créé.

## Armes réellement affichées

Le renderer réutilise les 16 fichiers PNG transparents `assets/weapons_framed/` existants, associés à l'arme par `WEAPON_NAMED_ART` déjà défini dans `game.js` :

`carbine_k17`, `cendre`, `impulse`, `ion`, `nomade9`, `pistol_reinforced`, `pistol_rescue`, `pistol_used`, `precision`, `prototype`, `reliquat`, `rifle_industrial`, `rifle_recovery`, `smg_sector`, `spectre`, `vektor`.

Une arme inconnue / non mappée déclenche le rendu procédural de repli, plutôt qu'une illustration d'une autre arme trompeuse.

## Couverture Équipements 2.0

- Arme : image du **modèle exact** pour les 16 modèles répertoriés, angle continu selon le tir ou la visée.
- Armure : surcouche de finition selon la rareté, motifs contextuels Bastion, Régénérateur, Prédateur et héritages ; pas de silhouette complète distincte pour chaque modèle.
- Bottes : deux calques indépendants animés, petits accents selon la rareté de la pièce équipée.
- Sac tactique : sprite de sac conditionné au slot ; symbole spécifique au Sécurisateur. La tenue de base comporte toutefois une petite silhouette d'équipement de survie dans les vues détaillées issues de la planche.
- Module : petit signe contextuel Tesla, Égide prête ou Médic ; aucun nouveau déclenchement d'effet.
- Artefact : petit marquage de rareté si équipé ; les effets restent pilotés par le moteur existant.

## Qualité/fallback

Chargement asynchrone : si un sprite nécessaire au rendu courant ou l'image exacte de l'arme n'est pas décodé, l'adaptateur renvoie `false` **avant de dessiner** et `drawNomadGameplay()` prend le relais. Les deux rendus ne sont pas superposés.
