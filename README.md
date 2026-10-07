# eCare+ — Frontend Web

Frontend web de **eCare+**, une solution e-santé destinée au suivi des patients atteints de maladies chroniques, notamment le diabète et/ou l'hypertension.

## 🎯 Objectif

eCare+ vise à améliorer le suivi des patients atteints de maladies chroniques en facilitant la centralisation et la consultation des informations de suivi par les professionnels de santé.

Le frontend web est principalement destiné aux **professionnels de santé**, notamment aux médecins.

## 🏗️ Architecture

Le projet utilise une architecture **Feature-Based / Modular**.

```text
src/
├── app/            # Configuration globale de l'application
│   ├── providers/  # Providers globaux
│   ├── routes/     # Configuration des routes
│   └── App.tsx
│
├── assets/         # Ressources statiques
├── components/     # Composants réutilisables
│   ├── ui/         # Composants UI génériques
│   └── layouts/    # Composants de mise en page
│
├── config/         # Configuration de l'application
├── features/       # Fonctionnalités métier
├── hooks/          # Hooks React réutilisables
├── lib/            # Bibliothèques et intégrations
├── stores/         # Gestion de l'état global
├── styles/         # Styles globaux
├── types/          # Types TypeScript partagés
└── utils/          # Fonctions utilitaires
```

Les fonctionnalités métier seront organisées dans `src/features/`.

Exemple :

```text
src/features/
└── patients/
    ├── components/
    ├── pages/
    ├── services/
    ├── hooks/
    ├── types/
    └── index.ts
```

## 🛠️ Technologies

- React
- TypeScript
- Vite
- CSS
- Oxlint

D'autres dépendances pourront être ajoutées au fur et à mesure des besoins du projet.

## 🚀 Installation

Cloner le repository puis installer les dépendances :

```bash
npm install
```

## 💻 Développement

Lancer le serveur de développement :

```bash
npm run dev
```

## 🏗️ Build

Créer le build de production :

```bash
npm run build
```

## 🔍 Lint

Vérifier le code avec Oxlint :

```bash
npm run lint
```

## 📌 État du projet

Le projet est actuellement au stade d'initialisation du frontend.

Aucune fonctionnalité métier n'est encore implémentée.

La première fonctionnalité prévue est la **création d'un dossier patient par un médecin**.