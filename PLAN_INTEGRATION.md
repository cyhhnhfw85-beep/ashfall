# ASHFALL — Plan d'intégration groupée / 1B + 1C

**Code de référence :** `ashfall_v63`. **Cette phase 1A est une fondation, pas une mise à jour jouable.** Les fichiers ci-joints restent isolés pour ne pas introduire de régression avant la migration d'écran complète.

## Stratégie en une passe cohérente

1. Charger `ash-ui.css` **après** `game.css` ; conserver ses classes préfixées pour éviter les collisions de sélecteurs. Embarquer les symboles SVG sans accès réseau.
2. Créer **un seul composant d'icône** pour le HTML généré par `game.js` : `ashIcon(name,size)` avec liste blanche de noms ; ne pas injecter arbitrairement de HTML depuis des sauvegardes.
3. Migrer refuge, survivant, atelier, marchand, secteurs, coffres et leurs listes d'armes vers les composants. Ensuite migrer HUD, sac, carte, pause, fin d'expédition, ouverture de coffre et tutoriel.
4. Supprimer les emoji HTML/JS **par emplacement**. Pour les appels `msg(...)`, changer d'abord le modèle en `type + libellé + icône`, au lieu de remplacer aveuglément les caractères dans les chaînes. Pour Canvas, remplacer les symboles passés à `fillText` par des pictogrammes vectoriels dessinés.
5. Vérifier que les rares skins/fichiers recadrés restent centrés dans **tous** les contextes, et que le cache PWA sert bien la nouvelle version.

## Matrice de couverture

| Surface existante | Cible de migration | Critère de validation |
|---|---|---|
| Accueil / `#refuge-page-home` | Titres, boutons, blocs de progression | Aucun emoji, lancement évident |
| Navigation / `.refuge-nav` | `ash-ui-tabs` + pictogrammes | 5 onglets sur 320/390/430 px |
| Survivant / `#refuge-page-character` | Slots équipement, raretés, atelier | Armes non coupées, états verrouillés clairs |
| Marchand / `#merchantPageContent` | Carte arme, comparaison, achats | Valeurs inchangées, images centrées |
| Secteurs / `#refuge-page-progress` | Cartes objectifs et états | Verrouillé / découvert / terminé distincts |
| Coffres / `#refuge-page-chests` | Cartes des 3 coffres, probabilités, achat | Prix 900 / 2800 / 7500, visuels présents |
| Révélation / `#ashChestReveal` | Modale, visuel, bouton | Animation 1,6/2,7/4,3 s, recharge sûre |
| HUD / `.gamebar`, `#hpFill`, `#xpFill` | Jauges, icônes, libellés | Vie et XP visibles même sur 320 px |
| Mini-carte / `#ashMiniMap` | Cadre + bouton d'ouverture | Historique persistant, formes exactes |
| Sac / `#bagBtn`, `#bagCount` | Compteur de capacité + pictogramme | `n/6` lisible sans ouvrir |
| Pause / `#overlay` | Modale centrale | Reprendre et abandon à deux niveaux |
| Fin de run / `#runDebrief` | Statistiques et cartes d'armes | Gains/pertes exacts, pas de doublon |
| Scènes Canvas / `draw()` | Alertes et pictogrammes vectoriels | Aucune impression d'emoji/fallback iOS |
| Messages et tutoriel | Icône + libellé court | Informations utiles sans bruit |

## Compatibilité et sécurité

- **NE PAS modifier** la clé localStorage, le schéma `version:1`, les identifiants d'arme, ni les règles de `finish(...)` ou `persist(...)`.
- Les composants deviennent accessibles par ajout progressif de classes ; aucun refactor de moteur simultané.
- Ne pas remplacer les images originelles `assets/weapons` ou les fichiers `assets/weapons_framed` sans accord.
- Refuser toute intégration si les récompenses de coffre/fin de run ne survivent pas à une fermeture/reprise.
- Construire à partir d'une copie du ZIP source, avec comparaison du JavaScript logique pour repérer les changements imprévus.

## Grille de recette obligatoire

**Dimensions :** iPhone 320, 390, 430 px ; idéalement Safari sur appareil. Aucun débordement horizontal ni recouvrement des zones de sécurité.

**Fonctionnel :** accueil → lancer → traverser → coffre auto → combat → sac/carte → extraction (sortie du cercle autorisée, sortie de salle annule) → bilan → refuge ; mort → bilan → refuge ; pause/reprise ; ferme/réouvre app ; ouverture des trois coffres ; crédit atomique ; sauvegarde import/export ; offline/PWA.

**Graphique :** zéro caractère emoji visible ; 40 icônes réutilisables ; 16 armes vérifiées dans 5 contextes ; 3 coffres × 3 états ; 4 couleurs de rareté ; focus clavier/VoiceOver ; mouvement réduit si configuré.

**Livrable suivant :** une seule version jouable de la passe graphique globale, accompagnée de captures refuge/expédition/menus/coffres, de tests et d'un ZIP, **après** application de la charte à tout le jeu.
