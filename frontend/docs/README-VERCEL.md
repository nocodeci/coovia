# Déploiement Vercel - Dashboard Frontend

## Prérequis

1. Compte Vercel (gratuit)
2. Node.js 18+ installé
3. Git configuré

## Étapes de déploiement

### 1. Préparer le projet

```bash
# Dans le dossier frontend
cd frontend
npm install
npm run build
```

### 2. Déployer sur Vercel

#### Option A : Via l'interface web Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"
4. Importez votre repository GitHub
5. Sélectionnez le dossier `frontend` comme racine
6. Configurez les variables d'environnement si nécessaire
7. Cliquez sur "Deploy"

#### Option B : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier frontend
cd frontend
vercel

# Suivez les instructions pour configurer le projet
```

### 3. Configuration des variables d'environnement

Dans Vercel Dashboard > Project Settings > Environment Variables :

```
VITE_API_URL=https://votre-backend.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=votre_clé_clerk
```

### 4. Domaines personnalisés (optionnel)

1. Allez dans Vercel Dashboard > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

## Structure du projet

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── public/
├── package.json
├── vercel.json
└── vite.config.ts
```

## Scripts disponibles

- `npm run dev` : Développement local
- `npm run build` : Build de production
- `npm run preview` : Prévisualisation du build

## Support

Pour toute question, consultez la documentation Vercel ou contactez l'équipe de développement.
