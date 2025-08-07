# Déploiement Vercel - Boutique Client

## Prérequis

1. Compte Vercel (gratuit)
2. Node.js 18+ installé
3. Git configuré

## Étapes de déploiement

### 1. Préparer le projet

```bash
# Dans le dossier boutique-client
cd boutique-client
npm install
npm run build
```

### 2. Déployer sur Vercel

#### Option A : Via l'interface web Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"
4. Importez votre repository GitHub
5. Sélectionnez le dossier `boutique-client` comme racine
6. Configurez les variables d'environnement si nécessaire
7. Cliquez sur "Deploy"

#### Option B : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier boutique-client
cd boutique-client
vercel

# Suivez les instructions pour configurer le projet
```

### 3. Configuration des variables d'environnement

Dans Vercel Dashboard > Project Settings > Environment Variables :

```
REACT_APP_API_URL=https://votre-backend.vercel.app
REACT_APP_PAYMENT_API_URL=https://votre-backend.vercel.app/api
```

### 4. Configuration des routes

Le fichier `vercel.json` est déjà configuré pour gérer les routes React Router.

### 5. Domaines personnalisés (optionnel)

1. Allez dans Vercel Dashboard > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

## Structure du projet

```
boutique-client/
├── src/
│   ├── components/
│   │   ├── CheckoutComplete.tsx
│   │   ├── PaymentMethodSelector.tsx
│   │   └── ...
│   ├── pages/
│   │   └── CheckoutPage.tsx
│   └── ...
├── public/
├── package.json
├── vercel.json
└── craco.config.js
```

## Scripts disponibles

- `npm start` : Développement local
- `npm run build` : Build de production
- `npm test` : Tests

## Fonctionnalités déployées

- ✅ Système de checkout
- ✅ Intégration des méthodes de paiement
- ✅ Validation des numéros de téléphone
- ✅ Interface responsive
- ✅ Support multi-pays (Côte d'Ivoire, Sénégal, etc.)

## Support

Pour toute question, consultez la documentation Vercel ou contactez l'équipe de développement.
