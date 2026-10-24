# ASHFALL 0.8.9.53 — Stabilisation de la phase 3

Base : archive complète 0.8.9.52. Compatible avec la sauvegarde `ashfall_pwa_v1` : aucune migration ni remise à zéro.

## Corrections

- Les coffres ne s'ouvrent automatiquement que lorsque la salle est réellement sécurisée, tous ennemis éliminés, et toute embuscade résolue. Corrige le bug reproduit où un coffre s'ouvrait pendant les 3 secondes précédant les renforts.
- L'ancienne action d'ouverture du coffre applique la même validation, même si l'interface mobile n'utilise plus de bouton d'action.
- Pendant l'embuscade, le joueur peut battre en retraite par une porte déjà visitée mais ne peut pas progresser vers une nouvelle salle avant de sécuriser celle-ci.
- Le tir automatique privilégie les ennemis et ne vise les explosifs que si deux ennemis ou plus sont exposés, ou s'il ne voit pas directement d'ennemi. L'explosion et les éventuelles réactions en chaîne ne doivent pas menacer immédiatement le Nomade.
- Marqueur visuel « CIBLE TACTIQUE » lorsqu'un explosif est choisi automatiquement.

## Invariants

Aucune modification des dégâts, récompenses, valeurs des objets, fréquence des événements, progression, refuge, nouveaux sprites ou géométrie. L'extraction et son compte à rebours conservent leurs règles. La version PWA et son cache passent à 0.8.9.53.
