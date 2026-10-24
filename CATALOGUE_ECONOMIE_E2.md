# ASHFALL — Catalogue et économie initiale Équipements 2.0

Ces nombres sont des **valeurs initiales de développement**, non des paramètres validés précédemment par Game Design ; les seuils du Sac Sécurisateur, les six emplacements, les huit places, le +5 et les 50 % de remboursement sont en revanche des règles validées.

## Catalogue final implémenté (15 modèles)

| Type | Modèle | Effet principal automatique | Base brute |
|---|---|---|---:|
| armor | armor-bastion | Réduit les dégâts subis | 0.055 |
| armor | armor-predator | Dégâts accrus après élimination | 0.055 |
| armor | armor-regenerator | Régénération hors pression | 0.28 |
| boots | boots-scout | Accélère les déplacements | 0.055 |
| boots | boots-spectre | Accélération après élimination | 0.1 |
| boots | boots-anchor | Stabilité : réduit légèrement les dégâts subis | 0.025 |
| module | module-tesla | Impulsion électrique automatique | 8 |
| module | module-aegis | Bouclier périodique automatique | 10 |
| module | module-medic | Soin conditionnel automatique | 8 |
| bag | bag-prospector | Petit bonus de crédits extraits | 0.02 |
| bag | bag-reclaimer | Composant bonus à l’extraction longue | 1 |
| bag | bag-securizer | Sécurise un objet après des salles nettoyées | 1 |
| artifact | artifact-resonance | Renforce les impulsions électriques | 0.13 |
| artifact | artifact-vitality | Amplifie les soins | 0.1 |
| artifact | artifact-frenzy | Renforce les enchaînements offensifs | 0.045 |

**Précisions d'application :**
- Bastion : réduit proportionnellement les dégâts ; Prédateur : fenêtre offensive de 5 s après élimination ; Régénérateur : récupération faible hors combat.
- Éclaireur : vitesse constante ; Spectre : accélération durant 5 s après élimination ; Ancrage : petite résistance aux dégâts (adaptation de la résistance aux ralentissements initialement proposée, non applicable sans mécanique pertinente stable).
- Tesla : impulsion automatique sur une cible proche, temporisation 12 s ; Égide : absorbe un impact, recharge 32 s ; Médic : soin conditionnel sous 50 % des PV, temporisation 28 s.
- Prospecteur : +2 % de crédits extraits avec plafond **80 crédits** ; Récupérateur : **1 Composant bonus** si au moins 15 salles uniques ont été visitées puis extraction ; Sécurisateur : protection d'un nouveau butin.
- Résonance : amplification de Tesla ; Vitalité : amplification du soin Médic ; Frénésie : bonus offensif après élimination.

La statistique d'efficacité est issue de la qualité (94–106 %), tandis que le niveau 1–4 suit les secteurs 0–3. Un bonus lié à l'effet principal est ajusté par la rareté, le niveau, l'amélioration et éventuellement l'optimisation d'efficacité ; les bonus globaux principaux sont plafonnés dans le moteur. **La puissance réelle en combat devra être observée en parties jouées.**

## Budget de drops initial

Probabilités d'orientation d'un drop *déjà déclenché* : arme 54 %, armure 13 %, bottes 10 %, module 10 %, sac 9 %, artefact 4 %. Ainsi, cette intégration ne multiplie pas le nombre total d'objets générés en ajoutant une source de loot supplémentaire. Les artefacts tombent uniquement Rare, Épique et Légendaire.

**Simulation déterministe de 100 000 orientations**, graine `20261025` :

| Type | Compte mesuré |
|---|---:|
| Arme | 53,864 |
| Armure | 13,136 |
| Bottes | 9,992 |
| Module | 9,955 |
| Sac | 9,015 |
| Artefact | 4,038 |

Ces valeurs mesurent la distribution des tirages, **pas des objets réellement extraits ou vendus**.

## Ressources et barèmes

- Rendement normal recyclage : **Commun 1, Inhabituel 1, Rare 2, Épique 3, Légendaire 5, Mythique 6 Composants** + `(niveau - 1)`.
- Recycler un objet amélioré ajoute **`floor(composants réellement investis × 0,5)`** ; aucun remboursement des crédits investis.
- Coût +1 à +5 pour le prochain niveau `n` (1 à 5) : crédits = `70 × n × niveau_objet` ; Composants = `n + niveau_objet`.
- Optimisation d'une statistique : crédits = `120 × niveau_objet`, Composants = `4 + niveau_objet`. Une nouvelle optimisation **remplace** l'ancienne sans empilement.
- Revente des nouvelles pièces hors armes : `min(220, 15 × rendement_normal_recyclage)` crédits. Les armes préservent leur formule de revente historique.
- Opérations permanentes (vente, recyclage, upgrade, optimisation) **seulement au refuge**.

| Niveau de l'objet | +1 à +5 (crédits cumulés) | Composants cumulés | Composants récupérables max | Optimisation : crédits/Composants |
|---|---:|---:|---:|---:|
| 1 | 1050 | 20 | 10 | 120 / 5 |
| 2 | 2100 | 25 | 12 | 240 / 6 |
| 3 | 3150 | 30 | 15 | 360 / 7 |
| 4 | 4200 | 35 | 17 | 480 / 8 |

Recyclage d'une pièce nouvelle non améliorée : **2.99 Composants en moyenne** dans la simulation (niveaux 1–4 équilibrés artificiellement pour ce test). Les sources de Composants ne permettent pas une création gratuite en boucle par recyclage de sa propre production ; aucun achat de Composants n'est ajouté. Une rentabilité économique *en session* ne peut pas être garantie sans télémétrie de parties.

## Limites économiques

Les prix marchands des armes, les trois coffres payants et les récompenses des arènes restent inchangés. Les réglages de revente des nouveaux objets et les effets peuvent nécessiter une itération après données terrain ; aucun essai long terme sur iPhone n'a été réalisé.
