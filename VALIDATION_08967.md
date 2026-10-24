# ASHFALL 0.8.9.67 — Rapport de validation

## Couverture automatisée (Chromium, test local avec scripts intégrés)
- Phase D / parcours de jeu : **124 / 124** contrôles : refuge, sélection, snapshot du contrat, HUD, réussite, échec, ancien run sans contrat, ancienneté des sauvegardes, prix des coffres, intégrité des images, largeurs 320/390/430 px.
- Régression coffres : **51 / 51** : prix 900/2800/7500, probabilités, achat atomique, récupération et reprise après rechargement, absence de double attribution.
- Reprise du dossier de carrière : **12 / 12** : historique limité aux 12 derniers rapports, tri récent, sauvegarde et récupération de sélection, statistiques anciennes non inventées.

**Total 187 / 187 contrôles automatisés réussis**. Aucun événement pageerror détecté durant ces essais.

## Garanties et limites
- Les opérations de contrat n'ajoutent aucun effet au moteur de combat et ne changent pas les chances des coffres ni les prix de revente.
- Les bonus de contrat sont inclus dans la sauvegarde de fin d'expédition ; pas de prime sur mort ou abandon.
- Les expéditions déjà commencées avant cette version n'ont pas de contrat attribué automatiquement.
- La progression historique détaillée n'est collectée qu'à partir de cette version. Le compte total d'extractions préexistant est conservé.
- Le navigateur utilisé est Chromium. **Les performances sur iPhone Safari/PWA réel et une expédition de longue durée n'ont pas été vérifiées.**
- Avant mise à jour, exporter la sauvegarde et remplacer *tous* les fichiers du site.
