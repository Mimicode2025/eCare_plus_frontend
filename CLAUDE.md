# CLAUDE.md

## Règles à respecter

Ce fichier définit les règles spécifiques à respecter par Claude lors de toute intervention sur le frontend web de eCare+.

### 01 — Dégradés violet vers bleu
Ne pas utiliser de dégradé violet vers bleu comme élément visuel principal.

### 02 — Hero text en dégradé
Ne pas utiliser de texte de titre principal avec un dégradé de couleurs.

### 03 — Emojis dans les titres
Ne pas utiliser d'emojis dans les titres, sauf demande explicite.

### 04 — Police Inter partout
Ne pas utiliser automatiquement la police Inter pour toute l'interface. Respecter la typographie définie pour eCare+.

### 05 — Cartes à bordure colorée
Éviter les cartes avec des bordures colorées uniquement pour créer un effet visuel.

### 06 — Cartes en glassmorphism
Ne pas utiliser le glassmorphism comme style par défaut.

### 07 — Dark mode sans contraste
Ne jamais sacrifier le contraste et la lisibilité pour obtenir un design sombre. Toute interface dark mode doit rester accessible et lisible.

### 08 — Trois icon boxes alignées
Éviter les sections composées systématiquement de trois cartes avec une icône, un titre et une description.

### 09 — Badge au-dessus du titre
Ne pas ajouter systématiquement un badge ou une petite étiquette au-dessus de chaque titre.

### 10 — Icônes Lucide partout
Ne pas utiliser des icônes simplement pour remplir l'interface. Les icônes doivent avoir une fonction ou améliorer réellement la compréhension.

### 11 — Composants shadcn jamais retouchés
Les composants shadcn/ui peuvent être personnalisés lorsque cela est nécessaire pour respecter l'identité visuelle et l'expérience utilisateur de eCare+.

Ne pas utiliser les composants par défaut sans réfléchir au contexte.

### 12 — Fade-in au scroll
Ne pas ajouter automatiquement des animations de fade-in au scroll.

Les animations doivent être discrètes, utiles et justifiées par l'expérience utilisateur.

### 13 — Traînée qui suit le curseur
Ne pas créer d'effet de traînée, de curseur personnalisé ou d'effet décoratif suivant la souris, sauf demande explicite.

### 14 — Boutons qui s'estompent au survol
Les boutons doivent conserver une bonne visibilité au survol.

Éviter les effets qui diminuent leur lisibilité ou donnent l'impression que le bouton disparaît.

### 15 — Espacements incohérents
Maintenir une échelle d'espacement cohérente dans toute l'application.

Les marges, paddings, gaps et hauteurs doivent suivre les conventions déjà établies dans le projet.

### 16 — Em dashes partout
Éviter l'utilisation excessive du tiret cadratin `—` dans les textes de l'interface.

### 17 — Texte plein de buzzwords
Privilégier un langage simple, concret et compréhensible.

Éviter les formulations artificielles ou les buzzwords marketing inutiles.

### 18 — Italique serif sur les mots d'accent
Ne pas utiliser systématiquement des mots en italique avec une police serif comme élément décoratif.

### 19 — Space Grotesk + Instrument Serif
Ne pas utiliser automatiquement la combinaison Space Grotesk + Instrument Serif.

La typographie doit être choisie en fonction de l'identité visuelle et de la lisibilité de eCare+.

### 20 — Texture de grain sur un dégradé
Ne pas ajouter automatiquement une texture de grain par-dessus un dégradé pour créer un effet "premium".

---

## Principes UI/UX à privilégier

L'interface eCare+ doit privilégier :

- une interface sobre, professionnelle et moderne ;
- une hiérarchie visuelle claire ;
- une excellente lisibilité ;
- des contrastes suffisants ;
- des espacements cohérents ;
- une navigation simple et prévisible ;
- des composants réutilisables ;
- des interactions compréhensibles ;
- des animations discrètes et fonctionnelles ;
- un design responsive ;
- une bonne accessibilité ;
- une identité visuelle cohérente sur toutes les pages.

Le design doit servir l'utilisateur avant de chercher à suivre une tendance visuelle.

---

## Règles de développement

### Architecture

Respecter l'architecture Feature-Based / Modular déjà définie dans le projet.

Avant de créer un nouveau fichier ou dossier :

1. Vérifier si une structure existante peut être réutilisée.
2. Vérifier si un composant similaire existe déjà.
3. Placer le nouveau code au niveau approprié de l'architecture.
4. Éviter de créer des abstractions inutiles.

### TypeScript

Le projet utilise TypeScript.

- Écrire du code typé.
- Éviter `any` sauf nécessité réelle.
- Créer les types dans les emplacements prévus.
- Ne pas contourner le typage avec des casts inutiles.

### Composants

Les composants doivent rester :

- simples ;
- réutilisables lorsque cela apporte une vraie valeur ;
- faciles à comprendre ;
- responsables d'une seule préoccupation principale.

Ne pas transformer chaque petit élément en composant séparé sans raison.

### Styles

Avant d'ajouter de nouveaux styles :

1. Vérifier les styles existants.
2. Réutiliser les variables, tokens et composants existants.
3. Éviter les valeurs arbitraires répétées.
4. Maintenir une cohérence visuelle entre les pages.

### Dépendances

Ne pas installer une nouvelle dépendance simplement parce qu'elle existe.

Avant d'ajouter une librairie :

- vérifier si le projet possède déjà une solution ;
- vérifier si le besoin justifie réellement la dépendance ;
- privilégier les solutions simples.

---

## Règles spécifiques à eCare+

eCare+ est une plateforme e-santé destinée au suivi des personnes vivant avec des maladies chroniques, notamment le diabète et l'hypertension.

Le frontend web est destiné principalement aux professionnels de santé et au personnel autorisé.

### Gestionnaire

Le gestionnaire est responsable de la gestion des dossiers patients.

Il peut notamment :

- créer un dossier patient ;
- modifier les informations du patient ;
- consulter les informations administratives du patient ;
- gérer les informations nécessaires au dossier.

### Médecin

Le médecin est principalement chargé du suivi médical.

Il peut notamment :

- consulter les dossiers des patients auxquels il a accès ;
- consulter l'historique du suivi ;
- consulter les mesures enregistrées ;
- suivre l'évolution du patient ;
- identifier les situations nécessitant une attention médicale.

Ne jamais supposer qu'un rôle possède un accès qui n'a pas été défini.

---

## Données de santé et sécurité

Les données manipulées par eCare+ sont des données de santé sensibles.

Par conséquent :

- ne jamais utiliser de vraies données de patients dans le code ;
- utiliser uniquement des données fictives pour les tests ;
- ne pas afficher de données sensibles dans les logs ;
- éviter de stocker inutilement des données de santé côté client ;
- respecter les permissions et les rôles ;
- ne jamais contourner les contrôles d'accès du backend.

Le frontend ne doit jamais être considéré comme l'autorité finale pour les permissions.

---

## Limites médicales

eCare+ est un outil de suivi et d'aide à la continuité des soins.

Le frontend ne doit pas :

- présenter une information comme un diagnostic automatique ;
- proposer une prescription automatique ;
- présenter une recommandation algorithmique comme une décision médicale ;
- remplacer le jugement d'un professionnel de santé.

Les alertes et informations affichées doivent rester cohérentes avec le rôle d'outil de suivi de la plateforme.

---

## API et backend

Le backend de eCare+ est développé séparément.

Claude ne doit pas inventer de manière définitive :

- des endpoints ;
- des routes API ;
- des structures de réponse ;
- des règles métier ;
- des permissions backend.

Lorsqu'un contrat API n'est pas encore défini, le signaler plutôt que de le considérer comme définitif.

Ne pas implémenter de logique backend dans le frontend.

---

## Workflow avant toute modification

Avant de modifier le projet :

1. Lire le contexte de la tâche.
2. Inspecter la structure existante.
3. Vérifier les composants et fonctionnalités déjà disponibles.
4. Identifier la feature concernée.
5. Réutiliser ce qui existe lorsque c'est pertinent.
6. Implémenter uniquement ce qui est demandé.
7. Vérifier le typage.
8. Vérifier le lint.
9. Vérifier le build lorsque pertinent.
10. Résumer clairement les modifications effectuées.

Ne pas anticiper plusieurs fonctionnalités non demandées.

---

## Règle importante

**Ne pas ajouter de complexité simplement parce qu'elle semble intéressante.**

Pour chaque modification, privilégier :

> simplicité → cohérence → maintenabilité → expérience utilisateur.

Le code et le design doivent rester au service du produit eCare+.