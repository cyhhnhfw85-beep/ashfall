# ASHFALL — Charte visuelle verrouillée / Phase 1A

**Référence : ASHFALL 0.8.9.63.** Statut : *validée pour préparer l'intégration, non appliquée au moteur dans ce lot.*

## 1. Identité

**Univers :** industriel tactique, rétro-futuriste, survivant K-17. Sombre, métallique et technique, mais lisible au premier regard. L'ambre sert aux **actions principales** et à l'économie, le cyan aux **informations et interactions**, le rouge à la **vie et aux dégâts**, le bleu clair à l'**XP**. Les couleurs de rareté sont toujours réservées aux objets et équipements. Ni smileys ni emoji dans les interfaces finales.

**Principes de lisibilité :** priorité à la vie, aux actions et au butin ; maximum deux niveaux de mise en évidence sur un même panneau ; ne jamais dépendre uniquement de la couleur pour signaler un état ; pas de texte de décor répétitif ; un symbole ne doit jamais remplacer un libellé lorsque l'action peut être ambiguë.

## 2. Palette de référence

| Rôle | Token | Hex | Usage |
|---|---|---|---|
| Fond profond | `--ash-void` | `#0A141F` | Hors jeu / séparateurs |
| Fond | `--ash-bg` | `#0F2230` | Page et overlays |
| Surface | `--ash-surface` | `#152F3E` | Cartes, panneaux |
| Surface élevée | `--ash-surface-raised` | `#1B394A` | Modales et éléments actifs |
| Bordure | `--ash-border` | `#36566B` | Cartes et champs |
| Bordure forte | `--ash-border-strong` | `#66899A` | Focus, éléments actifs |
| Texte | `--ash-text` | `#EEF5F7` | Corps et titres |
| Texte secondaire | `--ash-text-muted` | `#ADC5D1` | Indications |
| Action principale | `--ash-amber` | `#E5B772` | Achat, lancement, validation |
| Interaction | `--ash-cyan` | `#65CFCD` | Carte, terminal, scanner |
| Vie | `--ash-health` | `#EF727C` | Barre de santé |
| Expérience | `--ash-xp` | `#64BFE9` | Barre XP |
| Succès | `--ash-success` | `#6BD5AD` | Extraction et sauvegarde réussies |
| Avertissement | `--ash-warning` | `#EFAC6D` | Dangers proches |
| Échec | `--ash-danger` | `#DE8088` | Mort, annulation, abandon |

**Palette des raretés (verrouillée) :** Commun `#AFC4D0` ; Rare `#68B8F6` ; Épique `#BC85F2` ; Légendaire `#F5C36B`. Les pictogrammes de rareté sont des losanges en contour ; texte de rareté toujours affiché, pas uniquement une lueur colorée.

## 3. Typographie et densité

- Police système Apple / Segoe UI / system-ui ; aucune police externe requise (jouable hors ligne).
- Grand titre : `21–27 px`, 850, espacement 0,035 em ; titre de section 17–20 px ; corps 14–16 px ; étiquette 10–11 px, graisse 750–850, espacement 0,08–0,16 em.
- Hauteur minimale d'une action tactile : **44 px** ; action principale 48–54 px. Espacements : grille de **4 px** (4/8/12/16/20/24).
- Rayons : 6, 10, 14, 20 px selon le composant. Une bordure sobre et une ombre de profondeur suffisent ; halo seulement pour le focus et les événements exceptionnels.
- Interfaces prioritaires sur une largeur de 320, 390 et 430 px. Cinq onglets doivent tenir sans déborder ; sur 320 px, privilégier icône + titre court (pas de labels trop longs).

## 4. Icônes

Bibliothèque livrée : `assets/ash-icons.svg` avec **40 symboles vectoriels** dessinés en contour, grille 24 × 24, trait **1,8 px**, terminaisons arrondies. Les symboles sont personnalisables par couleur (`currentColor`), sans emoji et sans réseau.

Usage une fois la feuille de symboles injectée dans le DOM :

```html
<svg class="ash-ui-icon" aria-hidden="true"><use href="#ash-i-bag"></use></svg>
```

**Important :** embarquer la feuille de symboles **dans** `index.html` ou la précharger en ressource de même origine incluse dans le cache PWA. Ne pas utiliser de dépendance CDN. Pour les alertes dessinées dans `<canvas>`, utiliser des tracés Canvas dédiés, pas du texte emoji (`fillText`).

## 5. Composants

La bibliothèque `assets/ash-ui.css` définit ces classes préfixées afin de ne pas casser les écrans existants avant leur migration :

- `ash-ui-card`, `ash-ui-card--raised`, `ash-ui-card--compact` : conteneurs.
- `ash-ui-btn` + `--primary / --secondary / --quiet / --danger / --block` : actions.
- `ash-ui-tabs`, `ash-ui-tab` : navigation à cinq onglets.
- `ash-ui-stat`, `ash-ui-meter`, `--hp`, `--xp` : statistiques et jauges.
- `ash-ui-rarity[data-rarity]` : raretés et losanges.
- `ash-ui-item`, `ash-ui-item-image` : fiches d'armes.
- `ash-ui-modal-scrim`, `ash-ui-modal` : pause, bilan de run, récompenses.
- `ash-ui-chest-image` : visuels de coffres en `object-fit:contain`.

Le focus clavier/tactile reste visible. `prefers-reduced-motion` désactive les animations décoratives sans supprimer les retours fonctionnels.

## 6. Cadrage des armes et coffres

- Conserver **à l'identique** les 16 dessins existants et les fichiers `assets/weapons_framed/*.png` de la 0.8.9.63. Ne pas retailler/couper le sujet ni appliquer de `transform:scale(...)` au hasard.
- Pour les armes, cadre horizontal de **76 × 64 px** dans les listes ; utiliser un cadre plus grand de ratio 5:3 dans la fiche détaillée et la récompense. `object-fit:contain` ; `object-position:center` ; fond neutre ; aucune déformation, jamais `object-fit:cover`.
- Pour les coffres, utiliser les neuf illustrations actuelles (commun/rare/épique × fermé/chargement/ouvert) en `object-fit:contain` dans un espace dédié. L'animation **1,6 / 2,7 / 4,3 secondes** reste inchangée.
- Dans les slots carrés (sac), afficher **l'arme en entier** au centre d'une zone horizontale, avec nom et rareté en dessous. Ne pas utiliser le ratio 1:1 de l'image comme si le dessin était carré.
- La rareté change la bordure et le badge, **pas** le cadrage de l'image.

## 7. Animations équilibrées

- Interactions discrètes : 140 ms ; ouverture de panneau : 220 ms ; révélation d'objet : 420 ms.
- Éviter zoom pulsé permanent et flashs invasifs ; aucune animation ne doit changer la largeur d'un bouton ou déplacer le joystick.
- Utiliser la propriété `transform`/`opacity` plutôt que des animations modifiant la géométrie des panneaux.
- Ne jamais bloquer la révélation d'une récompense sauvegardée par un timeout non récupérable ; conserver la procédure atomique existante pour les coffres.

## 8. Règles de non-régression

**En dehors du périmètre design :** combat, dégâts, projectiles, IA, coffres (prix de 900/2800/7500 crédits et probabilités), tirage du loot, extraction, mort, progression, carte 50 salles, save key, `service-worker` et compatibilité des sauvegardes.

Le kit **ne modifie pas ces éléments**. Le changement de version du moteur et du cache PWA ne doit intervenir qu'au moment de la véritable intégration visuelle, après contrôle mobile et tests fonctionnels.
