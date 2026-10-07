# AGENTS.md — eCare+ Web

## 1. Contexte du projet

**eCare+** est une solution e-santé destinée au suivi des personnes vivant avec des maladies chroniques, principalement :

- diabète ;
- hypertension artérielle ;
- diabète et hypertension.

La solution est composée de trois applications distinctes :

- **Web** : plateforme destinée aux professionnels et au personnel habilité ;
- **Mobile** : application destinée principalement aux patients ;
- **Backend** : API et logique serveur communes aux applications.

L'objectif de eCare+ est d'améliorer la continuité du suivi des patients entre les consultations en facilitant la collecte, la centralisation et la consultation des informations de suivi.

---

## 2. Périmètre de ce repository

Ce repository concerne **uniquement le frontend web de eCare+**.

Les différents projets sont séparés :

- `ecare-web` → frontend web React ;
- `ecare-backend` → backend / API ;
- `ecare-mobile` → application mobile patient.

### Règles de périmètre

- Ne pas implémenter de logique backend dans ce repository.
- Ne pas modifier le repository backend ou mobile.
- Ne pas dupliquer les fonctionnalités de l'application mobile dans le web sans besoin fonctionnel identifié.
- Le frontend communique avec le backend uniquement via les APIs définies par l'équipe.

---

## 3. Utilisateurs du frontend web

Le frontend web peut être utilisé par différents profils selon leurs droits.

### Gestionnaire

Le **gestionnaire** est responsable de la gestion des dossiers patients.

Ses principales responsabilités peuvent inclure :

- créer un dossier patient ;
- modifier les informations administratives du patient ;
- consulter un dossier patient ;
- gérer les informations nécessaires à la prise en charge du patient ;
- effectuer les opérations administratives liées aux patients selon ses permissions.

### Médecin

Le **médecin** utilise principalement la plateforme pour le suivi médical des patients qui lui sont accessibles.

Ses principales responsabilités peuvent inclure :

- consulter les dossiers des patients autorisés ;
- consulter l'historique des mesures ;
- suivre l'évolution de l'état du patient ;
- consulter les informations utiles au suivi ;
- identifier les situations nécessitant une attention médicale.

### Autres rôles

D'autres rôles pourront être ajoutés ultérieurement.

Les fonctionnalités doivent respecter les permissions associées à chaque rôle.

**Ne jamais supposer qu'un utilisateur a accès à une donnée ou à une fonctionnalité sans que cela soit défini par les règles fonctionnelles ou les permissions du système.**

---

## 4. Stack technique

Le projet utilise actuellement :

- React ;
- TypeScript ;
- Vite ;
- Oxlint.

L'alias suivant est configuré :

```text
@/ → src/
```

### Dépendances

Avant d'ajouter une nouvelle dépendance :

1. vérifier si le besoin peut être couvert par les outils déjà présents ;
2. vérifier que la dépendance est réellement nécessaire ;
3. privilégier une solution simple ;
4. éviter d'ajouter une dépendance uniquement pour une fonctionnalité facilement réalisable sans celle-ci.

Ne pas installer de librairie sans justification.

---

## 5. Architecture

Le projet utilise une architecture **Feature-Based / Modular**.

Structure principale :

```text
src/
├── app/
├── assets/
├── components/
│   ├── ui/
│   └── layouts/
├── config/
├── features/
├── hooks/
├── lib/
├── stores/
├── styles/
├── types/
└── utils/
```

### `app/`

Contient la configuration globale de l'application :

- providers ;
- routes ;
- configuration générale de l'application.

### `features/`

Contient les fonctionnalités métier organisées par domaine.

Exemple :

```text
src/features/patients/
├── components/
├── pages/
├── services/
├── hooks/
├── types/
└── index.ts
```

Chaque feature doit rester autant que possible autonome.

Les fonctionnalités futures pourront notamment être organisées autour de domaines tels que :

```text
patients/
measurements/
alerts/
appointments/
reports/
```

Ne pas créer ces features tant qu'elles ne sont pas nécessaires.

### `components/`

Contient les composants réutilisables à plusieurs endroits de l'application.

```text
components/
├── ui/
└── layouts/
```

- `ui/` → composants génériques d'interface ;
- `layouts/` → composants de structure et de mise en page.

Un composant spécifique à une fonctionnalité doit rester dans la feature concernée plutôt que d'être placé dans `components/`.

### `hooks/`

Contient les hooks réutilisables dans plusieurs parties de l'application.

Un hook spécifique à une feature doit être placé dans cette feature.

### `stores/`

Contient la gestion de l'état global lorsqu'elle est nécessaire.

Ne pas utiliser l'état global pour des données qui peuvent rester locales à un composant ou à une feature.

### `services/`

La logique de communication avec les APIs et les services externes doit être organisée proprement.

Les appels spécifiques à une fonctionnalité doivent, lorsque cela est pertinent, rester dans la feature concernée.

### `types/`

Contient les types TypeScript partagés par plusieurs fonctionnalités.

Les types spécifiques à une feature doivent rester dans cette feature.

### `utils/`

Contient uniquement les fonctions utilitaires réellement réutilisables.

---

## 6. Règles de développement

- Utiliser TypeScript.
- Privilégier des composants simples, lisibles et réutilisables.
- Respecter la séparation des responsabilités.
- Éviter la duplication de code.
- Garder la logique métier dans les features concernées.
- Ne pas mettre de logique métier dans les composants UI génériques.
- Utiliser l'alias `@/` lorsque cela améliore la lisibilité des imports.
- Gérer les états de chargement, succès, erreur et état vide lorsque nécessaire.
- Prévoir une gestion claire des erreurs utilisateur.
- Ne pas créer de fichiers ou de dossiers inutiles.
- Ne pas créer de code anticipant des fonctionnalités qui n'ont pas encore été définies.
- Réutiliser les composants existants avant d'en créer de nouveaux.
- Ne pas modifier une architecture existante sans raison technique ou fonctionnelle.

---

## 7. Navigation et routage

La navigation globale de l'application est gérée dans :

```text
src/app/routes/
```

Les routes doivent respecter les droits d'accès des utilisateurs.

Une page nécessitant une authentification ne doit pas être accessible directement par un utilisateur non authentifié.

Les règles d'autorisation doivent être respectées côté frontend, tout en considérant que **le backend reste la source d'autorité pour la sécurité et les permissions**.

---

## 8. API et backend

Le backend est développé dans un repository séparé.

Le frontend communique avec le backend via des APIs.

### Règles

- Ne pas inventer de contrats API définitifs.
- Ne pas inventer d'endpoints lorsque ceux-ci n'ont pas été définis.
- Ne pas supposer la structure des réponses API sans spécification.
- Ne pas créer de backend fictif ou mocké sans demande explicite.
- Si une information provenant du backend est nécessaire pour continuer le développement, demander ou vérifier le contrat API correspondant.
- Centraliser la configuration nécessaire à la communication avec l'API.

---

## 9. Données médicales et sécurité

eCare+ traite des **données de santé sensibles**.

Le frontend doit donc appliquer une attention particulière à la confidentialité et à la sécurité.

### Règles

- Respecter les droits d'accès associés aux rôles.
- Ne pas exposer inutilement les données médicales.
- Ne pas afficher de données sensibles dans les logs.
- Ne pas inclure de données médicales réelles dans le code source.
- Ne pas utiliser de vraies données patients pour les tests ou le développement.
- Ne pas stocker inutilement des données médicales sensibles côté client.
- Ne jamais considérer une donnée présente côté frontend comme sécurisée uniquement parce qu'elle est masquée dans l'interface.

Le backend reste responsable de l'autorisation réelle d'accès aux données.

---

## 10. Limites fonctionnelles et médicales

eCare+ est un outil de **suivi et d'aide aux professionnels de santé**.

Le système ne doit pas être présenté comme un outil de diagnostic ou de prescription automatique.

Le frontend ne doit pas :

- poser automatiquement un diagnostic médical ;
- prescrire automatiquement un traitement ;
- modifier une prescription sans intervention autorisée du professionnel ;
- présenter une recommandation automatisée comme une décision médicale ;
- inventer une interprétation médicale qui n'a pas été définie par l'équipe.

Toute fonctionnalité ayant un impact médical doit être définie et validée fonctionnellement avant son implémentation.

---

## 11. Données de test

Pendant le développement :

- utiliser uniquement des données fictives ;
- ne jamais utiliser de données personnelles ou médicales réelles ;
- identifier clairement les données mockées lorsqu'elles sont utilisées ;
- supprimer les mocks lorsqu'ils ne sont plus nécessaires et qu'une API réelle est disponible.

---

## 12. Workflow de développement

Avant toute modification :

1. Comprendre le besoin fonctionnel.
2. Vérifier l'architecture existante.
3. Identifier la feature concernée.
4. Vérifier les composants et fonctions déjà disponibles.
5. Réutiliser l'existant lorsque cela est pertinent.
6. Implémenter uniquement ce qui est demandé.
7. Vérifier les erreurs TypeScript.
8. Vérifier le lint.
9. Vérifier le build.
10. Résumer clairement les modifications effectuées.

### Principe important

**Ne pas anticiper plusieurs fonctionnalités à la fois.**

Lorsqu'une fonctionnalité est demandée, modifier uniquement ce qui est nécessaire à son implémentation et à son intégration.

---

## 13. État actuel du projet

Le projet frontend vient d'être initialisé.

À ce stade :

- l'architecture de base est en place ;
- aucune fonctionnalité métier n'est encore implémentée ;
- aucune feature métier ne doit être créée sans besoin fonctionnel ;
- le projet doit rester simple jusqu'au début du développement fonctionnel.

### Première fonctionnalité prévue

La première fonctionnalité métier sera :

**Gestion des dossiers patients — création d'un dossier patient par le gestionnaire.**

Cette fonctionnalité sera développée dans :

```text
src/features/patients/
```

Les critères fonctionnels détaillés seront définis avant son implémentation.

## 14. Règles UI/UX — À éviter

L'interface web de eCare+ doit privilégier un design **sobre, professionnel, accessible et cohérent**, adapté à une plateforme de santé.

Éviter les tendances visuelles utilisées uniquement pour donner un aspect « moderne » sans apporter de valeur à l'expérience utilisateur.

### À éviter

1. **Dégradés violet → bleu** comme traitement visuel par défaut.
2. **Texte de hero en dégradé**.
3. **Emojis dans les titres ou éléments principaux de l'interface**.
4. Utiliser **Inter partout** sans réflexion sur la typographie.
5. **Cartes avec bordures colorées** utilisées uniquement comme décoration.
6. **Glassmorphism** excessif ou systématique.
7. **Dark mode avec un contraste insuffisant**, particulièrement problématique pour l'accessibilité.
8. Multiplier les **trois icon boxes alignées** comme pattern de présentation par défaut.
9. Ajouter systématiquement **un badge au-dessus du titre** sans utilité fonctionnelle.
10. Utiliser des **icônes Lucide partout** sans cohérence avec le contexte ou le système visuel.
11. Utiliser des composants **shadcn/ui sans les adapter** lorsque leur apparence ne correspond pas au design eCare+.
12. Ajouter des **animations fade-in au scroll** sans nécessité.
13. Ajouter des **effets de traînée ou de suivi du curseur**.
14. Utiliser des **boutons qui s'estompent ou deviennent difficiles à distinguer au survol**.
15. Utiliser des **espacements incohérents** entre les différents écrans et composants.
16. Utiliser excessivement les **em dashes (—)** dans les textes de l'interface.
17. Utiliser des **buzzwords** ou du jargon marketing inutile.
18. Utiliser de l'**italique serif** uniquement pour mettre artificiellement certains mots en évidence.
19. Utiliser systématiquement la combinaison **Space Grotesk + Instrument Serif** comme solution esthétique par défaut.
20. Ajouter une **texture de grain sur les dégradés** uniquement pour créer un effet visuel.

### Principes à privilégier

- Hiérarchie visuelle claire.
- Lisibilité avant l'esthétique.
- Contraste suffisant.
- Espacements cohérents.
- Design sobre et professionnel.
- Interface adaptée aux usages médicaux et professionnels.
- Feedback visuel clair pour les actions de l'utilisateur.
- Animations discrètes et fonctionnelles.
- Composants cohérents entre les différentes pages.
- Design responsive.
- Accessibilité prise en compte dès la conception.
- Les éléments décoratifs ne doivent jamais nuire à la compréhension ou à l'utilisation de l'interface.

### Règle générale

**Ne pas utiliser une tendance UI simplement parce qu'elle est populaire.**

Chaque choix visuel doit avoir une raison liée à l'expérience utilisateur, à la lisibilité, à l'accessibilité ou à l'identité visuelle de eCare+.