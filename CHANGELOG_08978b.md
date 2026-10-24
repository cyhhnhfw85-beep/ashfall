# ASHFALL 0.8.9.78b — Opération Refuge UI Cleanup

**Base :** ZIP complet jouable `ASHFALL_08978a_Accueil_Epure(2).zip`, version vérifiée 0.8.9.78a.

## Objectif
Rendre les onglets Survivant, Marchand, Coffres et Secteurs plus visuels, plus lisibles et moins répétitifs, sans changer le gameplay, les données économiques, les ressources persistantes ni les interfaces d'action.

## Survivant
- Portrait existant agrandi et mis au premier plan ; slots actuels casque/arme/module alignés à côté.
- Indicateurs arme, vitalité, puissance et assurance présentés sans multiplication des panneaux.
- Casques et modules disponibles via un volet « Casques et modules » ; achats et équipement inchangés.
- Inventaire mobile à deux colonnes, images d'armes plus grandes, recherche/tri/raretés/pagination conservés.
- Fiche de sélection, équipement, assurance et atelier conservés.

## Marchand
- Haut de page réduit : visuel du marchand conservé, miroir des crédits masqué car déjà présent dans la barre commune.
- Cartes d'offres plus lisibles et illustrées, prix et action toujours visibles.
- Acheter/Vendre, filtres, tri, comparaison indicative, stock et confirmations conservés.
- Explication du cycle de stock accessible dans un volet.
- **Aucun changement d'algorithme de rotation ni de catalogue.**

## Coffres
- Illustrations existantes agrandies et mises au centre des trois offres.
- Prix visible et probabilités **exactes** accessibles en un toucher par coffre ; probabilités épique/légendaire affichées dès le résumé.
- Conditions du tirage et d'achat définitif conservées dans un volet explicatif.
- Animation en trois phases, enregistrement atomique, blocage des doublons et reprise conservés.
- Aucune modification des tables de tirage, prix ou récompenses.

## Secteurs
- Carte visuelle des quatre secteurs en premier, identité graphique différenciée par zone sans nouvel asset.
- Objectif principal, progression, balises et état du Gardien visibles immédiatement après la carte.
- Carrière, journal, maîtrise, paliers et collections conservés dans des volets dépliables.
- Lien avec Helix inchangé : débloquable mais non jouable.
- Carte non cliquable pour voyager ; nouveau départ depuis la Périphérie conservé.

## Technique
- Ajout d'une unique feuille de style **ciblée** : `refuge-ui-clean.css` chargée après les feuilles actuelles. Aucun asset existant supprimé.
- Reformatage HTML de présentation avec conservation des `id`, `data-*`, points d'entrée et handlers du jeu.
- `game.js` : seuls les templates de présentation des probabilités et informations marchand ont changé, ainsi que la chaîne de version.
- Version de jeu, scripts/CSS versionnés et clé de cache PWA mis à jour vers `0.8.9.78b` ; assets de coffres inclus dans le précache pour le premier usage hors ligne.
- Clé de sauvegarde **`ashfall_pwa_v1` inchangée** et aucune migration ajoutée.

## Hors périmètre
Économie, loot, prix, rotation marchande, dégâts, combats, boss, génération, navigation tactique, extraction, sauvegardes métier, rebranding.
