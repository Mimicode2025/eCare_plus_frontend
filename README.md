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
- Tailwind CSS
- React Router
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

Fonctionnalités en place :

- connexion et déconnexion, avec des écrans adaptés au rôle ;
- gestionnaire : liste des patients avec recherche et filtre, création, consultation et modification d'un dossier ;
- médecin : consultation des dossiers et suivi des mesures (dernières valeurs et historique).

Toutes les données sont **fictives** : l'authentification, les patients et les mesures sont simulés dans les fichiers `services/` de chaque feature, en attendant l'API du backend.

Comptes de démonstration (toute structure, mot de passe `12345678`) :

| Rôle         | Identifiant |
| ------------ | ----------- |
| Gestionnaire | `abi2026`   |
| Médecin      | `dr2026`    |
