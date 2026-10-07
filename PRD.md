# eCare+ — Product Requirements Document (PRD)

## 1. Présentation du produit

### 1.1 Nom

**eCare+**

### 1.2 Domaine

**E-Santé / Suivi des maladies chroniques**

### 1.3 Description

eCare+ est une solution numérique destinée à améliorer le suivi des personnes vivant avec des maladies chroniques, notamment le **diabète** et l'**hypertension artérielle**.

La solution permet de faciliter la continuité du suivi entre les consultations en centralisant les informations importantes du patient et en permettant aux professionnels de santé autorisés de consulter son historique et ses mesures.

eCare+ est composée de plusieurs parties distinctes :

- une application mobile destinée principalement aux patients ;
- une application web destinée aux professionnels de santé et au personnel autorisé ;
- un backend/API commun aux différentes applications.

### 1.4 Périmètre de ce repository

Ce repository concerne uniquement le **frontend web** de eCare+.

Le frontend web communique avec le backend/API et ne contient pas la logique serveur.

---

# 2. Problème

Le suivi d'une maladie chronique ne se limite pas aux consultations médicales.

Entre deux consultations, les patients peuvent :

- mesurer leur tension ;
- mesurer leur glycémie ;
- surveiller leur poids ;
- prendre leurs traitements ;
- ressentir certains symptômes ;
- avoir des rendez-vous de suivi.

Cependant, ces informations peuvent être difficiles à suivre et à organiser régulièrement.

Les professionnels de santé peuvent ainsi manquer de visibilité sur l'évolution du patient entre deux consultations.

eCare+ vise à améliorer cette continuité du suivi grâce à une centralisation des informations utiles et à une meilleure communication entre le patient et les professionnels autorisés.

---

# 3. Objectifs du produit

## 3.1 Objectif principal

Faciliter le suivi régulier des patients vivant avec le diabète et/ou l'hypertension en permettant aux informations pertinentes d'être collectées, centralisées et consultées par les personnes autorisées.

## 3.2 Objectifs spécifiques

eCare+ doit permettre de :

- gérer les dossiers patients ;
- consulter les informations d'un patient ;
- consulter l'historique du suivi ;
- consulter les mesures enregistrées ;
- faciliter le suivi médical ;
- faciliter la communication entre patient et professionnel de santé ;
- permettre une meilleure continuité du suivi entre les consultations ;
- fonctionner dans un contexte où la connectivité et les ressources peuvent être limitées.

---

# 4. Utilisateurs

## 4.1 Gestionnaire

Le gestionnaire est responsable de la **gestion des dossiers patients**.

Ses principales responsabilités sont :

- créer un dossier patient ;
- modifier un dossier patient ;
- consulter les informations du dossier ;
- gérer les informations administratives nécessaires ;
- rechercher un patient ;
- accéder aux dossiers selon ses permissions.

Le gestionnaire n'est pas responsable de la décision médicale.

---

## 4.2 Médecin

Le médecin est principalement responsable du **suivi médical** des patients auxquels il a accès.

Il peut notamment :

- consulter les dossiers des patients autorisés ;
- consulter les informations du patient ;
- consulter l'historique du suivi ;
- consulter les mesures enregistrées ;
- suivre l'évolution des mesures ;
- consulter les informations pertinentes au suivi ;
- identifier les situations nécessitant une attention médicale.

Le médecin reste responsable de l'interprétation médicale des informations.

---

## 4.3 Patient

Le patient utilise principalement l'application mobile.

Il peut notamment :

- consulter certaines informations personnelles ;
- enregistrer ou transmettre ses mesures ;
- renseigner certains symptômes ;
- recevoir des rappels ;
- consulter certaines informations relatives à son suivi.

Le patient n'est pas le principal utilisateur du frontend web.

---

## 4.4 Autres rôles

D'autres rôles pourront être ajoutés ultérieurement selon les besoins du produit.

Aucun rôle ou permission ne doit être supposé sans avoir été défini.

---

# 5. Principes fondamentaux

## 5.1 Suivi et non diagnostic

eCare+ est un outil de **suivi et d'aide à la continuité des soins**.

La plateforme ne doit pas :

- poser automatiquement un diagnostic ;
- prescrire un traitement ;
- remplacer le médecin ;
- présenter une recommandation automatique comme une décision médicale.

Les informations fournies par la plateforme doivent aider le professionnel à prendre connaissance de la situation du patient.

---

## 5.2 Sécurité des données

Les informations manipulées par eCare+ peuvent constituer des données de santé sensibles.

Le produit doit donc :

- respecter les droits d'accès ;
- limiter l'accès aux données selon les rôles ;
- éviter l'exposition inutile de données sensibles ;
- ne jamais utiliser de données réelles de patients dans le développement ou les tests ;
- protéger les informations lors de leur transmission et de leur stockage.

---

# 6. Fonctionnalités du frontend web

## 6.1 Authentification

Le frontend doit permettre aux utilisateurs autorisés de :

- se connecter ;
- se déconnecter ;
- maintenir leur session selon les mécanismes prévus par le backend ;
- accéder uniquement aux fonctionnalités correspondant à leur rôle.

### Contraintes

Le frontend ne doit pas être considéré comme l'autorité finale concernant les permissions.

Le backend reste responsable de l'autorisation.

---

# 7. Gestion des patients

## 7.1 Liste des patients

Le gestionnaire et les utilisateurs autorisés doivent pouvoir consulter une liste des patients auxquels ils ont accès.

La liste doit permettre de retrouver rapidement un patient.

Selon les besoins, elle pourra proposer :

- recherche ;
- filtres ;
- tri ;
- pagination.

---

## 7.2 Création d'un dossier patient

Le gestionnaire doit pouvoir créer un nouveau dossier patient.

Le formulaire doit permettre de renseigner les informations nécessaires définies par le produit.

Les informations doivent être organisées de manière claire afin d'éviter un formulaire inutilement complexe.

### Principes

- champs clairement identifiés ;
- distinction entre informations obligatoires et facultatives ;
- validation des données ;
- messages d'erreur compréhensibles ;
- confirmation claire après création.

---

## 7.3 Consultation d'un dossier patient

Un utilisateur autorisé doit pouvoir consulter le dossier d'un patient.

Le dossier peut notamment présenter :

- informations personnelles ;
- informations administratives ;
- informations relatives aux pathologies suivies ;
- historique du suivi ;
- mesures ;
- autres informations pertinentes.

Les informations doivent être organisées par sections afin de faciliter la lecture.

---

## 7.4 Modification d'un dossier patient

Le gestionnaire doit pouvoir modifier les informations qu'il est autorisé à modifier.

Le système doit :

- afficher clairement les champs modifiables ;
- valider les nouvelles informations ;
- confirmer la réussite de la modification ;
- afficher clairement les erreurs éventuelles.

---

# 8. Suivi des mesures

Les mesures peuvent notamment concerner :

- glycémie ;
- tension artérielle ;
- poids ;
- fréquence cardiaque ;
- autres mesures définies ultérieurement.

Les mesures enregistrées doivent pouvoir être consultées par les professionnels autorisés.

---

## 8.1 Historique

Le professionnel doit pouvoir consulter l'historique des mesures d'un patient.

Les données doivent être présentées de manière compréhensible.

Selon le besoin, elles peuvent être affichées sous forme de :

- tableau ;
- liste chronologique ;
- graphique ;
- résumé.

La représentation graphique ne doit pas remplacer les valeurs précises.

---

## 8.2 Date et heure

Lorsqu'une mesure est enregistrée depuis l'application mobile, la date et l'heure doivent être associées automatiquement à la mesure.

Le patient ne doit pas avoir à saisir manuellement ces informations lorsque le système peut les récupérer automatiquement.

---

# 9. Suivi médical

Le médecin doit disposer d'une vue permettant de comprendre rapidement l'évolution du patient.

Cette vue peut regrouper :

- informations essentielles du patient ;
- pathologies suivies ;
- dernières mesures ;
- historique ;
- évolution des mesures ;
- événements ou informations importantes du suivi.

L'interface doit privilégier les informations réellement utiles au suivi.

---

# 10. Alertes

eCare+ pourra afficher certaines alertes ou informations nécessitant l'attention d'un professionnel.

Les alertes doivent être :

- compréhensibles ;
- contextualisées ;
- visuellement distinguables ;
- associées à leur source lorsque nécessaire.

Une alerte ne doit pas être présentée comme un diagnostic.

---

# 11. Recherche et navigation

La navigation doit être simple et cohérente.

L'utilisateur doit pouvoir :

- accéder rapidement à son espace ;
- retrouver un patient ;
- consulter un dossier ;
- revenir à la liste précédente ;
- comprendre où il se trouve dans l'application.

Les menus et éléments de navigation doivent dépendre du rôle lorsque cela est nécessaire.

---

# 12. États des interfaces

Les écrans doivent prévoir les principaux états nécessaires.

### Chargement

Afficher un état de chargement lorsque les données sont en cours de récupération.

### État vide

Lorsqu'aucune donnée n'est disponible, afficher un message expliquant clairement la situation.

### Erreur

Les erreurs doivent être compréhensibles et indiquer, lorsque possible, l'action à effectuer.

### Succès

Les actions importantes doivent fournir un retour visuel clair.

Exemples :

- patient créé ;
- dossier modifié ;
- opération réussie.

---

# 13. Responsive Design

Le frontend doit être responsive.

L'interface doit rester utilisable sur différentes tailles d'écran, notamment :

- ordinateur portable ;
- ordinateur de bureau ;
- tablette.

Le design doit privilégier la lisibilité et l'efficacité plutôt qu'une simple adaptation mécanique des dimensions.

---

# 14. Accessibilité et utilisabilité

L'application doit privilégier :

- un contraste suffisant ;
- une typographie lisible ;
- des tailles de texte adaptées ;
- des boutons clairement identifiables ;
- des formulaires compréhensibles ;
- des messages d'erreur explicites ;
- une navigation cohérente ;
- des états interactifs visibles.

Les éléments visuels ne doivent pas être utilisés uniquement à des fins décoratives lorsqu'ils peuvent nuire à la compréhension.

---

# 15. Design UI/UX

L'identité visuelle de eCare+ doit être :

- professionnelle ;
- sobre ;
- moderne ;
- rassurante ;
- claire ;
- adaptée au domaine de la santé.

Le design doit privilégier la lisibilité et la compréhension des informations médicales.

Les tendances visuelles ne doivent pas être utilisées simplement parce qu'elles sont populaires.

Les règles détaillées concernant les choix visuels sont définies dans `CLAUDE.md`.

---

# 16. Architecture frontend

Le frontend utilise une architecture **Feature-Based / Modular**.

Structure principale :

```text
src/
├── app/
│   ├── providers/
│   ├── routes/
│   └── App.tsx
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

Les fonctionnalités doivent être organisées par domaine.

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

---

# 17. Technologies

Le frontend utilise actuellement :

- React ;
- TypeScript ;
- Vite ;
- Oxlint.

Les nouvelles dépendances doivent être ajoutées uniquement lorsqu'elles répondent à un besoin réel.

---

# 18. Backend et API

Le backend est développé séparément.

Le frontend doit communiquer avec l'API prévue à cet effet.

Le frontend ne doit pas :

- reproduire la logique métier du backend ;
- inventer des contrats API définitifs ;
- contourner les règles d'autorisation ;
- intégrer directement une base de données.

Les contrats API doivent être définis et validés avant leur utilisation définitive dans le frontend.

---

# 19. Données de test

Les données utilisées en développement doivent être fictives.

Exemple :

```text
Nom : Kossi Exemple
Prénom : Jean
Téléphone : +228 XX XX XX XX
```

Ne jamais utiliser les informations personnelles ou médicales réelles d'un patient.

---

# 20. MVP

Le MVP du frontend web doit prioritairement permettre :

### Authentification
- connexion ;
- déconnexion ;
- gestion de l'accès selon le rôle.

### Gestion des patients
- liste des patients ;
- recherche ;
- création d'un dossier patient par le gestionnaire ;
- consultation d'un dossier ;
- modification d'un dossier.

### Suivi
- consultation des mesures ;
- consultation de l'historique ;
- vue de suivi destinée au médecin.

Les fonctionnalités secondaires pourront être ajoutées progressivement.

---

# 21. Hors périmètre du frontend web

Les éléments suivants ne font pas partie du périmètre direct de ce repository :

- développement de l'application mobile ;
- développement du backend ;
- gestion directe de la base de données ;
- logique serveur ;
- prescription automatique ;
- diagnostic automatique ;
- remplacement du professionnel de santé.

---

# 22. Critères généraux d'acceptation

Une fonctionnalité est considérée comme correctement implémentée lorsqu'elle :

- respecte le besoin fonctionnel défini ;
- respecte les rôles et permissions ;
- respecte l'architecture frontend ;
- possède des états de chargement, erreur, succès ou vide lorsque nécessaires ;
- fonctionne sur les tailles d'écran prévues ;
- respecte les règles UI/UX du projet ;
- ne contient pas de données réelles ;
- ne génère pas d'erreurs TypeScript ;
- passe le lint ;
- ne casse pas les fonctionnalités existantes.

---

# 23. Priorités de développement

Les fonctionnalités doivent être développées progressivement.

Ordre initial recommandé :

1. Fondations du frontend
2. Authentification
3. Layout et navigation
4. Gestion des patients
5. Création d'un dossier patient
6. Consultation d'un dossier
7. Modification d'un dossier
8. Suivi des mesures
9. Historique
10. Vue de suivi médical
11. Alertes
12. Fonctionnalités secondaires

Cet ordre peut évoluer selon les besoins du projet.

---

# 24. Règle de référence

Lorsqu'une décision concernant une fonctionnalité n'est pas claire :

1. consulter le présent PRD ;
2. vérifier les règles du projet dans `AGENTS.md` ;
3. vérifier les règles spécifiques de Claude dans `CLAUDE.md` ;
4. si le besoin reste ambigu, ne pas inventer une règle métier définitive.

Le PRD constitue la référence fonctionnelle du produit.