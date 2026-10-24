# ASHFALL 0.8.9.78b — Audit et rapport de refonte du refuge

## Référence, méthode et périmètre
L'archive utilisateur `ASHFALL_08978a_Accueil_Epure(2).zip` contient 54 fichiers et un runtime de version `0.8.9.78a`. Le ZIP d'origine est resté intact. Ce rapport concerne exclusivement les quatre autres pages du refuge, sans modification volontaire des systèmes métier.

Inspection de `index.html`, des classes CSS actives, des fonctions de rendu et de leurs gestionnaires d'événements dans `game.js`, et des images présentes dans `assets/`. La navigation, les rendus dynamiques et les actions critiques ont été exercés dans Chromium par injection des mêmes scripts et styles dans un document de test. Les captures ont été prises avec le tutoriel initial fermé. **Il ne s'agit pas d'une exécution Safari réelle ni d'une installation PWA native.**

## Synthèse avant/après

| Page | Avant | Après | Informations conservées |
|---|---|---|---|
| Accueil | 0.8.9.78a épuré | Visuel inchangé, numéro de version actualisé | Contrats, expédition, ressources, sauvegarde |
| Survivant | Portrait entouré de nombreux cadres, réglages tactiques et inventaire à petites vignettes | Portrait dominant, statistiques prioritaires, équipement tactique dépliable, inventaire illustré 2 colonnes | Sélection, équipement, assurance, recherche, raretés, tri, pagination, atelier |
| Marchand | Double affichage des ressources, cartes très textuelles, paragraphes | Bandeau illustré et cartes d'armes plus grandes, cycle en légende courte, règles en volet | Achat/vente, stocks, quantités, prix, restrictions, confirmations, comparaison |
| Coffres | Tables de probabilités affichées intégralement, petit visuel | Coffres agrandis, épique/légendaire visibles directement, détail exact en un toucher | Toutes les chances, prix, tirage, animation, sauvegarde et reprise |
| Secteurs | Long défilement de statistiques, carrière, maîtrise, puis régions | Quatre régions en premier, objectif/progression ensuite, archives en volets | Statuts, balises, Gardien, suivi, carrière, maîtrises, Helix |

### Hauteurs observées en Chromium, largeur 390 px

Ces mesures correspondent à l'affichage initial des pages, sections secondaires fermées (elles ne signifient pas suppression de contenu) :

| Page | Avant (px) | Après (px) |
|---|---:|---:|
| Accueil | 1 075 | 1 075 |
| Survivant | 2 864 | 1 878 |
| Marchand | 2 383 | 2 389 |
| Coffres | 1 747 | 1 676 |
| Secteurs | 4 093 | 1 778 |

La page Marchand n'est pas devenue plus courte : ses illustrations sont intentionnellement plus grandes. Les fonctions ont été rendues plus accessibles visuellement, pas artificiellement compressées.

## Dépendances et précautions
- Tous les identifiants utilisés par les scripts restent présents et uniques.
- Les tableaux de probabilités utilisent les mêmes `t.odds` et `ASH_CHEST_RARITIES` que les tirages existants.
- Les volets natifs `<details>` ne modifient pas les valeurs, appels de rendu ou actions de paiement. L'état ouvert/fermé de ces volets n'est pas enregistré : c'est uniquement de la présentation.
- Le nom du jeu reste ASHFALL. Les sauvegardes utilisent toujours la clé `ashfall_pwa_v1`.
- Le marchand conserve **son algorithme historique de rotation** (un chantier économique séparé).
- Les stocks et items vendus conservent les `data-merchant-buy`, `data-merchant-sell`, ID d'inventaire, etc.
- Pas de nouvel arbre de progression ni nouveaux secteurs.

## Performance et ressources
Les 9 WebP de coffres originaux sont désormais précachés avec les ressources du jeu, afin de faciliter leur apparition hors ligne après installation. Aucun dessin d'arme ni de coffre n'a été modifié. Le chargement d'une feuille CSS complémentaire ciblée augmente modestement le volume de styles ; démanteler les nombreuses règles historiques de `game.css` aurait augmenté le risque sans amélioration mesurable dans cette opération.

## Validation
Se reporter à `VALIDATION_08978b.md` pour les contrôles réellement exécutés et leurs limites.

## Restant à vérifier
1. Tester physiquement l'application installée en mode PWA sur iPhone (Safari, changement d'orientation, gestes, zone de sécurité et zoom du texte).
2. Tester mode avion après une **installation réelle** et vérifier les transitions du service worker.
3. Réaliser une expédition complète avec équipement, extraction ou mort, puis restaurer une sauvegarde réelle du joueur.
4. Vérifier les aides techniques d'accessibilité (lecteur d'écran et tailles de texte supérieures au réglage standard).
5. Vérifier le bon comportement des animations de coffres sur Safari réel (test Chromium uniquement).

## Risque résiduel
Faible sur les données métier car celles-ci n'ont pas été modifiées, mais non nul pour les dispositions CSS de certains petits appareils, les cache persistants de PWA et les scénarios dynamiques non couverts. Le ZIP 0.8.9.78a reste le retour arrière recommandé en cas de problème.
