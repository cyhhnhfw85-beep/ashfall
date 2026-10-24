# ASHFALL — OPÉRATION CLEAN CORE

**Rapport d’audit et de validation** · 24 octobre 2026 · Livraison prévue **0.8.9.77**

## 1. Source et périmètre réel

La source est **`ASHFALL_08976_Correctif_Armes.zip`**, dernier ZIP jouable livré au début de cette opération, vérifié par lecture de `index.html`, `game.js`, `service-worker.js`, du manifeste et de toute l'arborescence. Aucune branche plus ancienne n'a été substituée à cette source.

- Archive de référence : **4 602 743 octets**, **94 fichiers**, intégrité ZIP vérifiée (`testzip`: aucun fichier endommagé).
- SHA-256 de la référence : `7fbff7c5d3ebf0450118f03334ebc32e570625b4eb3d82d4d40a798c6e481a65`.
- Une copie bit-à-bit non modifiée a été conservée hors du ZIP jouable : `REFERENCE_UNMODIFIED_0.8.9.76.zip`, de SHA-256 identique, pour retour arrière.
- Composition : 4 JavaScript, 8 CSS, 1 HTML, 1 manifeste Web App, 48 images/icônes, 32 documents historiques et/ou courants. **Aucun fichier TypeScript, node_modules, bibliothèque externe packagée ni build intermédiaire** n'est présent dans la référence.
- Les systèmes inspectés dans `game.js` : boucle de combat, projectiles, ennemis, boss K-17, progression, secteurs, 50 salles et événements, inventaire, marchand, coffres, extraction, mort, assurance, contrôles tactiles et localStorage.

## 2. Cartographie des chargements et dépendances

- `index.html` charge 8 feuilles CSS et les 3 scripts `identity.js`, `game.js`, `immersion.js` dans cet ordre, en plus de deux images Nomade intégrées dans le HTML en `data:image/png;base64`.
- `game.js` contient un dictionnaire `WEAPON_SPRITES` de 16 images embarquées sous forme Base64. `weaponArt()` utilise ce dictionnaire pour l'interface. Les chemins `assets/weapons/*.png` ne sont utilisés par aucun chargeur HTTP ou balise du code courant.
- `assets/weapons_framed/` conserve **les 16 illustrations sources** (320 × 192) pour de futures révisions éditables. Les versions `assets/weapons/` (256 × 144) ne sont que leurs variantes réduites et sont également absentes des références dynamiques de chargement.
- `assets/chest_*.webp` (9) et `assets/nomade/*.png` (5) n'ont pas de référence d'URL directe dans le moteur : leurs équivalents visuels sont embarqués dans le HTML ou les scripts. Ces fichiers sont **conservés** en tant que sources graphiques éditables, même s'ils ne sont pas nécessaires aux requêtes HTTP de la version actuelle.
- `manifest.webmanifest` référence les deux icônes ; `service-worker.js` maintient son pré-cache de 16 URLs (fichiers contrôlés comme existants). Chargement réseau d'abord, cache de secours ensuite : comportement préexistant conservé.
- Le moteur est enfermé dans une IIFE, sans imports ES modules ni cycle d'import formel ; la dépendance à l'ordre de chargement et à des objets globaux est conservée pour ne pas risquer de casser la PWA.
- La persistance utilise `ashfall_pwa_v1` (`version: 1`), `ashfall_pwa_v1_recovery`, `ashfall_pwa_v1_lastok` et la clé du tutoriel. Aucun changement de schéma, de clé, de validateur, de migration ou de préférence n'a été fait.

## 3. Classification des observations

| Catégorie | Observation | Action / preuve | Risque de l'action | Éléments concernés |
|---|---|---|---|---|
| **SUPPRIMER** | 19 anciens changelogs et 9 validations historiques | Retrait du paquet jouable : absence de références dans HTML/JS/CSS/SW | Très faible | `CHANGELOG_08957…08976.*`, `VALIDATION_*` |
| **SUPPRIMER** | Trois anciens README texte remplacés | Documentation courante `README.md` conservée et actualisée | Très faible | `README.txt`, `README_V61.txt`, `README_V62.txt` |
| **SUPPRIMER** | 16 variantes graphiques réduites non chargées | Chemins/noms recherchés dans tous les chargeurs, code et pré-cache ; maîtres intacts | Faible | `assets/weapons/*.png` |
| **SUPPRIMER** | 10 fonctions JavaScript sans aucune référence dans l'AST | Suppression circonscrite de leurs déclarations ; absence de `eval` ou `Function` dynamique ; suite de régression réussie | Faible mais non nul | `game.js` |
| **CORRIGER** | Étiquettes/version/cache à changer pour déployer le nouvel ensemble | Versions `0.8.9.77` et paramètres `?v=08977`, cache `ashfall-08977-clean-core` | Faible | `index.html`, `game.js`, `service-worker.js` |
| **CONSERVER** | 30 ressources éditables et 2 icônes, dont certaines non chargées par chemin | Empreintes SHA-256 inchangées ; rôle de sources graphiques | Aucun | `assets/chest_*`, `assets/nomade`, `assets/weapons_framed`, `icon-*` |
| **CONSERVER** | CSS distincts par phase et affichage | 8 CSS correctement liés, regroupement non nécessaire | Aucun | 8 feuilles CSS |
| **CONSERVER** | Mécaniques, économie, états persistants | Aucun paramètre ni fonction active modifié volontairement | Aucun | Systèmes en `game.js` et scripts annexes |
| **FUSIONNER : aucune** | Pas de deux modules actifs équivalents dont la fusion est sûre | 0 fusion réalisée | Évité | — |
| **RÉORGANISER : limitée** | Fragments documentaires dans le ZIP de production | Archive épurée ; sources opérationnelles laissées à leurs emplacements | Très faible | Racine, `assets/` |
| **À VÉRIFIER** | `game.js` et `index.html` très volumineux à cause des images embarquées | Report : extraction des sprites en fichiers externes modifierait les requêtes réseau et le fonctionnement hors ligne | Élevé | `game.js`, `index.html` |
| **À VÉRIFIER** | Redondance potentielle de règles CSS, état UI et logique historique | Ne pas supprimer sans comparaison visuelle/tactile approfondie | Moyen/élevé | `game.css`, CSS par phase, JS |
| **À VÉRIFIER** | Mode hors ligne installé et cache Safari | Tests réels HTTPS/PWA non réalisables dans ce banc | Moyen | `service-worker.js`, Safari iOS |

### 3.1 Code mort supprimé (preuve AST)

Analyse avec le parseur JavaScript TypeScript : **245 déclarations de fonctions** dans le moteur d'origine, dont les dix noms suivants n'apparaissent qu'une fois comme identifiants (leur propre déclaration), sans appel direct ni usage comme valeur dans l'arbre syntaxique :

`hasActiveRun`, `paintExtraCells`, `graph`, `lootIntegrity`, `drawIncidentSignal`, `action`, `uiActionName`, `weaponHeldArt`, `performDash`, `doorRect`.

Le moteur ne fait appel ni à `eval(...)` ni à `Function(...)`. Les suppressions ont été effectuées sur les plages syntaxiques exactes, sans supprimer les instructions voisines ; le parseur et `node --check` acceptent le fichier final. **Aucun code de gameplay actif n'a été intentionnellement modifié.**

### 3.2 Contrôle des doublons

- Doublons de fichiers strictement identiques (SHA-256) dans la référence : **0**.
- Dérivés redimensionnés / variantes de mêmes illustrations éliminés du ZIP : **16** (ce ne sont pas des fichiers binaires identiques).
- Copies intégrées des sprites dans `game.js` et du personnage dans `index.html` : **conservées**, car les supprimer ou changer leur mode de chargement aurait des risques de rendu et de cache.

## 4. Comparatif AVANT / APRÈS

| Indicateur | Avant 0.8.9.76 | Après 0.8.9.77 |
|---|---:|---:|
| Nombre total de fichiers dans l'arborescence | 94 | **49** |
| Nombre total de dossiers (hors racine) | 4 | **3** |
| Fichiers sources JS/HTML/CSS | 13 | **13** |
| Fichiers supprimés | — | **47** |
| Fichiers fusionnés | — | **0** |
| Dérivés graphiques éliminés | — | **16** |
| Doublons stricts éliminés | — | **0** |
| Fonctions de code mort retirées | — | **10** |
| Taille du projet décompressé (octets) | 5 459 709 | **4 892 927** |
| Taille du ZIP jouable (octets) | 4 602 743 | **4 044 123** |
| Tests réussis / exécutés sur référence | **23 / 23** | — |
| Tests réussis / exécutés sur livraison et contrôles comparatifs | — | **47 / 47** |
| **Total de vérifications** | | **70 / 70 réussies** |

Les 47 suppressions correspondent à **19 changelogs**, **9 validations**, **3 README historiques** et **16 PNG réduits**. L'archive ajoute `CHANGELOG_08977.md` et ce rapport : 94 − 47 + 2 = **49 fichiers**. Le fichier `README.md` est actualisé en place.

## 5. Arborescence finale

```text
ASHFALL_08977_CLEAN_CORE/
├── index.html
├── game.js
├── identity.js
├── immersion.js
├── game.css
├── identity-tokens.css
├── identity-components.css
├── identity-integrated.css
├── loot-phase.css
├── progression-phase.css
├── equipment-phase.css
├── longterm-phase.css
├── manifest.webmanifest
├── service-worker.js
├── icon-192.png
├── icon-512.png
├── assets/
│   ├── chest_common.webp (+ versions charging/open et variantes rare, epic ; 9)
│   ├── nomade/ (5 PNG originaux)
│   └── weapons_framed/ (16 PNG canoniques)
├── README.md
├── CHANGELOG_08977.md
└── AUDIT_CLEAN_CORE.md
```

## 6. Validation réellement exécutée

**Méthode.** Banc Playwright pilotant **Chromium headless**, avec styles et scripts chargés dans un document HTML autonome via `set_content` car cet environnement bloque la navigation vers `localhost`, `file://` et les URL `data:`. `localStorage` est simulé avec la même API en mémoire ; les quatre scénarios « moteur simulé » exposent en test seulement les fonctions déjà présentes via une instrumentation **absente du ZIP livré**. Ces tests sont utiles pour détecter les régressions, mais pas équivalents à une installation réelle.

- **23/23 tests** appliqués à la version 0.8.9.76, **47/47** tests et contrôles sur la version 0.8.9.77 et leurs différences : **70/70** (aucune régression observée dans ce périmètre).
- Démarrage, 5 onglets, sous-menus équipement/atelier, pages marchand et secteurs, illustrations de personnage chargées depuis Data URI, absence d'exceptions JS et de requêtes échouées dans le document de test.
- Création de carte de 50 salles avec boss, trois extractions et sept découvertes, sauvegardes primaire/secondaire, reprise de partie valide et fallback de sauvegarde corrompue.
- Joystick : séquence d'événements PointerEvent « touch » en Chromium, déplacement graphique et remise à zéro vérifiés.
- Pause, sac, carte ; coffre qui s'ouvre avec génération de butin ; conclusion d'extraction et mort par fonctions du moteur en état de test contrôlé ; navigation vers une salle marquée boss (mais **combat intégral contre le Gardien non joué**).
- Achats interactifs : marchand, arme équipée, déblocage d'un équipement tactique, coffre et sauvegarde de ces achats après rechargement, avec fixture disposant de crédits/recherche suffisants.
- Compatibilité : **sept sauvegardes réelles produites sous 0.8.9.70, .71, .72, .73, .74, .75 et .76**, toutes reprises avec leurs 50 salles et l'identité de leur arme équipée. Ces tests ne couvrent pas tous les cas historiques possibles.
- Syntaxe : `node --check` pour les quatre JS ; images : ouverture/décodage de **32 PNG/WebP** conservés ; chemins : 13 références HTML et 16 entrées du pré-cache vérifiées ; SHA-256 des **30 assets + 2 icônes** préservés inchangés.
- **Contrôle supplémentaire hors des 70 assertions** : l’archive finale extraite à nouveau démarre dans Chromium aux formats **320×700, 390×844 et 430×932**, avec menus, démarrage, pause, version 0.8.9.77 et zéro exception JS sur ces parcours.

## 7. Points non résolus et validation manuelle à effectuer

1. **iPhone/Safari réel non testé** : installation/upgrade de PWA, tactile multi-touch, interruptions iOS, reprise après fermeture, orientation, écrans étroits (320–430 px).
2. **Cache réel non testé** : déploiement HTTPS, mise à jour du service worker depuis la 0.8.9.76, démarrage hors connexion après premier chargement et actualisation en revenant en ligne. Le cache versionné change, mais l'algorithme network-first est conservé.
3. **Boss et expédition longue** : ni bataille complète de toutes les phases du Gardien, ni exploration manuelle des 50 salles, ni longue session avec gains équilibrés n'ont été jouées jusqu'au bout.
4. **Problèmes graphiques hérités** : débordements déjà observés dans le refuge sur petits écrans ; illustrations et rendu d'arme tenue potentiellement perfectibles. Aucun pixel des ressources maîtresses n'a été modifié.
5. **Dette architecturale** : monolithe `game.js` d'environ 1,96 Mo et images Base64 ; scinder moteur/état/sprites exigerait un chantier séparé avec tests de sauvegarde, cache et rendu réel beaucoup plus larges. Aucun découpage artificiel dans cette opération.
6. **CSS historiquement superposés** : ne pas éliminer des sélecteurs sous prétexte de doublon sans matrice de captures / calcul de cascade, car l'apparence est une contrainte absolue.

## 8. Déploiement et retour arrière

- Exporter la sauvegarde depuis l'ancienne version avant toute mise à jour.
- Copier **tous les fichiers** du nouveau ZIP sur **le même domaine et chemin de déploiement** ; conserver l'origine de stockage. Vérifier l'affichage `0.8.9.77`.
- Pour restaurer la version précédente, remettre intégralement le ZIP de référence intact **0.8.9.76** en ligne. **Ne pas vider localStorage**, afin de préserver la partie.
- Sans test Safari/PWA réel, **la stabilité sur l'appareil cible reste à confirmer**, même si le code conservé et les tests comparatifs n'ont détecté aucune régression.
