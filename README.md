# ASHFALL 0.8.9.47b — Correctif de mise à jour iPhone/PWA

Cette version reprend intégralement le gameplay et les ennemis graphiques de 0.8.9.47. Aucun changement de sauvegarde, économie, collisions, armes ou extraction.

Le bandeau affiche maintenant explicitement « 0.8.9.47b · ENNEMIS REFONDUS » et un bloc « Vérifier la version » apparaît en bas de l'accueil.

## Déploiement

1. Exporter sa sauvegarde depuis la PWA actuelle (précaution).
2. **Décompresser et publier le contenu complet du ZIP** sur le même hébergement, **à la même adresse et au même chemin**. Ne pas publier le ZIP tel quel si l'hébergeur ne l'extrait pas.
3. Ouvrir l'adresse publique du site dans Safari et recharger (au besoin en ajoutant `?maj=08947b` à l'URL).
4. Le bandeau doit indiquer « 0.8.9.47b ». Si l'iPhone affiche toujours « 0.8.9.46b », c'est l'ancienne page : vérifier la publication et le cache PWA.
5. Revenir à l'icône PWA installée. Utiliser le contrôle « Vérifier la version » et ensuite « Actualiser le jeu ». Ne pas effacer les données Safari ni supprimer la PWA avant d'avoir sauvegardé ses données, car les sauvegardes sont locales.

Le contrôle de version ne peut fonctionner que lorsque cette nouvelle page a été correctement publiée et chargée au moins une fois. Il ne peut pas réparer à distance un hébergement qui sert encore l'ancienne version.

## Contrôles

Vérifier le numéro dans le bandeau, le nouveau rendu des ennemis en expédition et la reprise d'une sauvegarde. La version 0.8.9.47b utilise une stratégie réseau en premier, avec secours hors-ligne, pour les fichiers du jeu.

# ASHFALL 0.8.9.47 — Cinq familles d’ennemis

Base : **0.8.9.46b Nomade articulé validé**. Modification du rendu des ennemis uniquement.

- Chaser (Traqueur) : silhouette étroite, griffes et vêtements déchirés.
- Ranged (Tireur) : casque, visière et fusil orienté vers le joueur.
- Drone : ailes flottantes, noyau lumineux animé et appendices.
- Brute : épaules massives, blindage, grosses mains.
- Sentinel (Sentinelle/Gardien) : armure facettée et arme énergétique, version Gardien accentuée.
- Variantes cohérentes avec les 4 secteurs (matières, palettes et inscriptions), et animation légère.
- Barre de vie déplacée au-dessus des nouvelles silhouettes.

**Inchangés** : IA, vitesse, dégâts, PV, hitbox, apparitions, récompenses, caméra, salles, sauvegardes, extraction, Nomade et refuge.

Les ennemis étant dessinés en Canvas, aucun asset supplémentaire n'est nécessaire. Test navigateur non équivalent à une validation iPhone réelle.
