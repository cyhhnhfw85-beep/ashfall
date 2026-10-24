# ASHFALL — Migration des sauvegardes vers Équipements 2.0

## Contrat de compatibilité

- Ancienne clé conservée : `ashfall_pwa_v1` ; enveloppe historique `version: 1` maintenue pour les données existantes ; extension nouvelle `eq2.schema:2`.
- Sauvegarde avant migration `ashfall_pwa_v1_eq2_original_v1`, plus cliché distinct selon empreinte de l'état précédent ; chaque cliché est lu/vérifié avant écriture.
- Migration produite en mémoire puis validée ; sauvegarde de nouvelle version écrite et relue. Si échec, retour à l'état précédent et arrêt de la conversion.
- Une sauvegarde déjà dotée de `eq2.schema=2` n'est pas reconvertie : protection contre compensations répétées.
- Une expédition historique encore en cours **n'est pas migrée** ; elle se termine avec ses anciennes règles avant conversion au refuge. La sauvegarde d'expédition conserve ses objets et sa numérotation.

## Conversion des six anciens équipements permanents

| Ancien achat/slot | Nouvelle catégorie | Modèle migré | Avantage conservé |
|---|---|---|---|
| Casque Éclaireur | Bottes | Éclaireur héritage | +6 % de vitesse |
| Casque Bastion | Armure | Bastion héritage | -10 % de dégâts reçus |
| Casque Endurance | Armure | Endurance héritage | +20 PV |
| Module Stabilisateur de tir | Module | Stabilisateur de tir | +8 % de cadence |
| Module Amplificateur balistique | Module | Amplificateur balistique | +6 % de dégâts |
| Module Analyseur tactique | Module | Analyseur tactique | +12 % XP |

Les achats historiques présents dans `loadout.owned` sont individualisés en un seul objet par ancien achat. Les autres pièces achetées restent dans la réserve sans être perdues, même lorsque plusieurs anciens casques correspondent à la catégorie Armure. Seule la pièce auparavant équipée est rééquipée automatiquement, lorsque sa conversion est univoque.

**Assurance ancienne :** compensation limitée à une protection `insured` vérifiable, correspondant à l'arme équipée, par une restitution crédit égale à une estimation prudente d'une prime historique calculée sur ses caractéristiques enregistrées, au minimum 20 crédits. Ce calcul ne reconstitue **aucun historique** de primes, ne compense pas une assurance expirée et ne s'exécute qu'une fois. L'identifiant de la compensation est sauvegardé.

## Règles au départ, à l'extraction et à la mort

- Seules les six pièces acquises équipées au refuge sont emportées initialement ; aucune pièce acquise supplémentaire n'est stockée dans le nouveau sac.
- Les objets trouvés sur le terrain sont transportables par huit ; les nouveaux objets actifs occupent aussi une place.
- À l'extraction, tous les objets effectivement transportés sont acquis ; ceux laissés au sol sont perdus.
- À la mort, toutes les pièces acquises du départ restent possédées, la configuration initiale est restaurée ; un objet nouveau protégé est seul récupéré dans la réserve, jamais automatiquement équipé.
- Le Sac Sécurisateur protège un seul objet et n'autorise qu'un transfert par expédition ; renoncer ou abandonner un objet protégé entraîne une confirmation, sans réactivation abusive.

## À tester avec tes propres données

Exporter ta véritable sauvegarde 0.8.9.78b avant déploiement. Sur l'iPhone, inspecter les anciens casques/modules convertis, l'arme actuelle, les crédits et l'éventuel statut d'assurance. Terminer d'abord une éventuelle ancienne expédition, revenir au refuge, puis exporter une nouvelle sauvegarde migrée. Les cas historiques réellement corrompus restent exclus des scénarios automatiquement validés.
