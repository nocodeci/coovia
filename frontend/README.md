# Frontend Coovia - Plateforme E-commerce Multivendeur

## 📁 Structure du Projet

```
coovia/frontend/
├── 📁 src/                    # Code source principal
│   ├── 📁 components/         # Composants réutilisables
│   ├── 📁 features/           # Fonctionnalités par domaine
│   ├── 📁 pages/              # Pages de l'application
│   ├── 📁 routes/             # Configuration des routes
│   ├── 📁 hooks/              # Hooks personnalisés
│   ├── 📁 services/           # Services API
│   ├── 📁 types/              # Définitions TypeScript
│   └── 📁 utils/              # Utilitaires
├── 📁 components/             # Composants UI de base
│   └── 📁 ui/                 # Composants UI shadcn/ui
├── 📁 config/                 # Fichiers de configuration
├── 📁 docs/                   # Documentation du projet
├── 📁 scripts/                # Scripts de test et utilitaires
├── 📁 public/                 # Assets statiques
└── 📁 docker/                 # Configuration Docker
```

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build de production
npm run build

# Preview de production
npm run preview
```

## 📚 Documentation

Toute la documentation détaillée se trouve dans le dossier `docs/` :
- Guide d'authentification
- Configuration des domaines
- Optimisations de performance
- Guides de déploiement

## 🛠️ Configuration

Les fichiers de configuration sont organisés dans `config/` :
- TypeScript : `tsconfig.*.json`
- ESLint : `eslint.config.js`
- Composants : `components.json`

## 🧪 Tests et Scripts

Les scripts de test et utilitaires sont dans `scripts/` :
- Tests d'authentification
- Scripts de déploiement
- Outils de debug

## 🎨 Composants UI

Les composants UI de base (shadcn/ui) sont dans `components/ui/` :
- button.tsx
- input.tsx
- popover.tsx
- select.tsx
- etc.

## 📦 Technologies

- **React 18** avec TypeScript
- **Vite** pour le build
- **TanStack Router** pour le routing
- **shadcn/ui** pour les composants
- **Tailwind CSS** pour le styling
- **Auth0** pour l'authentification
