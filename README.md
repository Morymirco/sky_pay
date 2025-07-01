# Sky Pay - Plateforme de Transfert d'Argent

## 📋 Description du Projet

Sky Pay est une plateforme de transfert d'argent sécurisée permettant d'envoyer de l'argent vers les comptes e-money suivants :
- **Kulu**
- **Soutra Money** 
- **Orange Money**

## 🏗️ Architecture

### Pages Principales

1. **Landing Page** (`/`) - Page d'accueil présentant les solutions
2. **Login** (`/login`) - Authentification sécurisée avec OTP
3. **Dashboard** (`/dashboard`) - Interface principale avec 4 modules

### Modules du Dashboard

#### 3.1 Gestion des Membres
- ✅ Affichage tableau des membres avec détails
- ✅ Édition complète des informations
- ✅ Suppression de membres
- ✅ Ajout unitaire de membres
- ✅ Ajout en masse (import Excel)
- ✅ Recherche avancée
- ✅ Export Excel

#### 3.2 Payer les Membres
- ✅ Export Excel de la liste existante
- ✅ Import Excel
- ✅ Affichage liste avec montants individuels
- ✅ Calcul du montant total
- ✅ Contrôle de confirmation des paiements

#### 3.3 Historique des Paiements
- ✅ Filtrage par mois/année
- ✅ Affichage par période
- ✅ Export Excel

#### 3.4 Gestion de Compte
- ✅ Création d'utilisateurs
- ✅ Attribution des rôles
- ✅ Suppression d'utilisateurs
- ✅ Gestion des permissions

## 🎨 Design

- **Thème** : Sombre avec accents bleus
- **Style** : Moderne et professionnel
- **Responsive** : Adaptatif mobile/desktop
- **Composants** : shadcn/ui + Radix UI

## 🔐 Authentification

### Identifiants de Test
- **Agent ID** : `admin`
- **Access Code** : `password`
- **OTP Code** : `123456`

### Sécurité
- Authentification à deux facteurs (OTP)
- Sessions sécurisées
- Protection des routes

## 🚀 Installation

```bash
# Installer les dépendances
npm install
# ou
pnpm install

# Lancer en mode développement
npm run dev
# ou
pnpm dev

# Build pour production
npm run build
# ou
pnpm build
```

## 📁 Structure des Fichiers

```
sky_pay/
├── app/
│   ├── page.tsx                 # Landing Page
│   ├── login/
│   │   ├── page.tsx            # Page de connexion
│   │   └── layout.tsx          # Layout de connexion
│   └── dashboard/
│       ├── page.tsx            # Dashboard principal
│       ├── members/
│       │   └── page.tsx        # Gestion des membres
│       ├── payments/
│       │   └── page.tsx        # Payer les membres
│       ├── history/
│       │   └── page.tsx        # Historique des paiements
│       └── account/
│           └── page.tsx        # Gestion de compte
├── components/
│   ├── ui/                     # Composants shadcn/ui
│   └── auth-guard.tsx          # Protection d'authentification
├── lib/
│   └── utils.ts               # Utilitaires
└── public/                    # Assets statiques
```

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 15 (App Router)
- **Frontend** : React 19 + TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui + Radix UI
- **Icons** : Lucide React
- **Forms** : React Hook Form + Zod
- **Charts** : Recharts

## 📊 Fonctionnalités Clés

### Transfert Multi-Plateforme
- Support pour Kulu, Soutra Money, Orange Money
- Interface unifiée pour tous les fournisseurs

### Gestion des Bénéficiaires
- Base de données des membres
- Import/Export Excel
- Recherche et filtrage avancés

### Suivi des Transactions
- Historique détaillé
- Filtres par période
- Export des données

### Sécurité
- Authentification à deux facteurs
- Chiffrement des données
- Gestion des rôles et permissions

## 🔄 Workflow Utilisateur

1. **Accès** : Landing Page → Login → Dashboard
2. **Gestion** : Ajout/Modification des membres
3. **Paiement** : Sélection des bénéficiaires → Attribution des montants → Confirmation
4. **Suivi** : Consultation de l'historique et export des données

## 📈 Statistiques

- **50K+** Transactions traitées
- **10K+** Utilisateurs actifs
- **99.9%** Disponibilité
- **24/7** Support

## 🔧 Configuration

Le projet utilise les configurations suivantes :
- `next.config.mjs` : Configuration Next.js
- `tailwind.config.ts` : Configuration Tailwind CSS
- `tsconfig.json` : Configuration TypeScript
- `components.json` : Configuration shadcn/ui

## 📝 Notes de Développement

- Design cohérent avec la palette bleue
- Composants réutilisables
- Structure modulaire
- Code TypeScript strict
- Responsive design

## 🚀 Déploiement

Le projet est prêt pour le déploiement sur :
- Vercel
- Netlify
- AWS
- Tout autre plateforme supportant Next.js

## 📞 Support

Pour toute question ou support technique, contactez l'équipe de développement. 