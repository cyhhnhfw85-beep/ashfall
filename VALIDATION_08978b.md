# ASHFALL 0.8.9.78b — Validation d'interface

## Contrôles automatisés exécutés en Chromium

**75 vérifications ciblées réussies sur 75 exécutées**, réparties en :

- **50 contrôles UI et fonctionnels** : 5 pages × 4 tailles (320, 375, 390, 430 px), absence de débordement document, absence d'erreur JavaScript, portrait, casques/modules dépliables, atelier PV, offre marchand, achat/vente, détails probabilités, achat de coffre commun, collecte, secteurs, carrière, maîtrise et sauvegarde en mémoire.
- **20 contrôles étendus** : lancement d'une expédition par le moteur 0.8.9.78a, rechargement de cette sauvegarde dans 0.8.9.78b avec 50 salles, inventaire 31 armes / pagination / recherche / filtrage / équipement / assurance, achat et rechargement en cours d'animation des coffres commun/rare/épique, collecte ultérieure sans perdre l'arme.
- **5 contrôles complémentaires** : marchand sans crédits et stock épuisé, renouvellement du stock au cycle existant, balises/Gardien/Helix, déblocage tactique casque ou module.

## Contrôles statiques
- `node --check game.js` et `node --check service-worker.js` réussis.
- Toutes les clés DOM sont uniques ; les points d'entrées `id`, `data-*` des actions historiques ont été conservés.
- Les paramètres de gameplay, données catalogues, raretés, économie et distribution de coffre ne sont pas modifiés.
- Le service worker utilise un nouveau nom de cache ; tous les chemins du précache correspondent à des fichiers présents dans le ZIP.
- Accueil 390 px : zone visuelle centrale identique pixel par pixel à la version 0.8.9.78a (l'en-tête et le pied de page affichent désormais le nouveau numéro de version).

## Portée et limites
Les contrôles ont été effectués avec un banc Chromium injectant les fichiers locaux, avec stockage local simulé pour permettre la navigation sur cet environnement. Les scénarios de paiement utilisent les dialogues natifs acceptés automatiquement et les ressources de test sont injectées uniquement dans le banc. Le protocole réel du navigateur, le service worker installé, la persistance Safari iPhone et l'expérience d'une partie humaine complète ne sont **pas testés**. Les 75 contrôles ne représentent pas 75 parties complètes.

## Retour arrière
L'archive source `ASHFALL_08978a_Accueil_Epure(2).zip` n'a pas été modifiée. Exporter une sauvegarde réelle avant déploiement, puis installer tous les fichiers de la nouvelle version sur le **même domaine** pour conserver le stockage local.
