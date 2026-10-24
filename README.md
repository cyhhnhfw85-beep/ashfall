# ASHFALL — Alpha PWA 0.8.9.76 | Correctif armes

## Objet de la livraison

Cette version fusionne quatre lignes de développement à partir de la base commune **0.8.9.70**, sans remplacer le jeu par une réécriture :

- **0.8.9.71 — Boss et combat tactique** : Gardien K-17 à trois phases, projectiles annoncés, télégraphes de combat et barre de vie du boss.
- **0.8.9.72 — Exploration** (incluse dans la 0.8.9.73) : sept découvertes procédurales par nouvelle expédition, dont relais, dépôts et signaux de détresse ; progression cartographique et récompenses prévues par cette branche.
- **0.8.9.73 — Équipement** : trois casques et trois modules, achetés au refuge, équipés un par catégorie et figés pour la durée de chaque expédition ; effets de vitesse, résistance, PV, cadence, dégâts et XP.
- **0.8.9.74 — Progression longue durée** : quatre parcours et douze paliers de maîtrise, quatre défis de secteurs, collection de cinq familles d'armes, six insignes et grades honorifiques.

Le système de contrôle, les images et les objets d'origine sont conservés. Les paramètres économiques des versions fusionnées sont conservés **sans nouvel équilibrage** : les récompenses des découvertes et les coûts de modules restent ceux de leurs branches d'origine ; prix des coffres inchangés.

## Conflits résolus

- Les télégraphes, le dessin et le HUD du Gardien de la 0.8.9.71 coexistent avec les bonus de réduction des dégâts de la 0.8.9.73.
- Les styles de l'équipement tactique et de la maîtrise longue durée sont tous deux chargés et mis en cache.
- La version visible, le moteur, le contrôle de version et le service worker annoncent **0.8.9.76**.
- Les anciennes expéditions continuent d'utiliser leurs paramètres enregistrés : ni équipements tactiques, ni découvertes ne sont injectés rétroactivement.

## Compatibilité des sauvegardes

La clé locale **`ashfall_pwa_v1`** et le schéma **`version:1`** restent inchangés. Les nouveaux champs de progression et d'équipement sont facultatifs. La sauvegarde de secours (`ashfall_pwa_v1_recovery`) reste utilisée uniquement si l'état principal est invalide ou absent. Une expédition en cours peut être reprise après rechargement.

**Avant toute mise à jour :** utiliser le bouton « Sauvegarde » du jeu pour exporter une copie indépendante de la progression. Ne pas supprimer les données du site, ne pas passer en navigation privée et ne pas désinstaller la PWA sans export.

## Installation

1. Exporter une sauvegarde depuis la version en cours.
2. Copier **tous les fichiers et sous-dossiers** de ce ZIP à la racine du site ASHFALL ; conserver les chemins du dossier `assets`.
3. Rafraîchir, vérifier que l'écran affiche **0.8.9.76** et utiliser le contrôle de version intégré si nécessaire.
4. Tester l'onglet **Survivant** (casques et modules) et **Secteurs** (maîtrise K-17), puis vérifier une sauvegarde préexistante.

## Vérification et limites

Voir `CHANGELOG_08976.md` et `VALIDATION_08976.md`. Contrôles exécutés sur un document de test Chromium (l'environnement bloque `localhost` et `file://`) ; l'installation PWA réelle, les interactions tactiles sur Safari iPhone, les parties complètes avec boss et l'état hors ligne doivent encore être validés sur appareil.

**Défaut hérité identifié** : sur certaines petites largeurs mobiles, les illustrations du panneau Coffres et parfois celles du personnage dépassent horizontalement. Il n'a pas été modifié dans cette fusion pour éviter un correctif graphique non lié à l'intégration.
