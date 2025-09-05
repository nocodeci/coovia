# Guide de Structure du Projet Frontend

## 📁 Organisation des Dossiers

### Structure Principale

```
coovia/frontend/
├── 📁 src/                    # Code source principal de l'application
├── 📁 components/             # Composants UI de base (shadcn/ui)
├── 📁 config/                 # Fichiers de configuration
├── 📁 docs/                   # Documentation du projet
├── 📁 scripts/                # Scripts de test et utilitaires
├── 📁 public/                 # Assets statiques
└── 📁 docker/                 # Configuration Docker
```

### Détail des Dossiers

#### 📁 `src/` - Code Source Principal
```
src/
├── 📁 components/         # Composants réutilisables de l'application
├── 📁 features/           # Fonctionnalités organisées par domaine
│   ├── 📁 auth/           # Authentification
│   ├── 📁 boutique/       # Gestion des boutiques
│   ├── 📁 produits/       # Gestion des produits
│   ├── 📁 commandes/      # Gestion des commandes
│   ├── 📁 clients/        # Gestion des clients
│   ├── 📁 dashboard/      # Tableau de bord
│   ├── 📁 media/          # Gestion des médias
│   ├── 📁 settings/       # Paramètres
│   └── 📁 users/          # Gestion des utilisateurs
├── 📁 pages/              # Pages de l'application
├── 📁 routes/             # Configuration des routes
├── 📁 hooks/              # Hooks personnalisés React
├── 📁 services/           # Services API
├── 📁 types/              # Définitions TypeScript
├── 📁 utils/              # Utilitaires
├── 📁 context/            # Contextes React
├── 📁 config/             # Configuration de l'application
└── 📁 lib/                # Bibliothèques utilitaires
```

#### 📁 `components/ui/` - Composants UI de Base
```
components/ui/
├── button.tsx             # Composant Button
├── input.tsx              # Composant Input
├── popover.tsx            # Composant Popover
├── select.tsx             # Composant Select
├── separator.tsx          # Composant Separator
├── toggle.tsx             # Composant Toggle
├── toggle-group.tsx       # Composant ToggleGroup
├── tooltip.tsx            # Composant Tooltip
└── index.ts               # Exports centralisés
```

#### 📁 `config/` - Configuration
```
config/
├── tsconfig.json          # Configuration TypeScript
├── tsconfig.app.json      # Configuration TypeScript App
├── tsconfig.node.json     # Configuration TypeScript Node
├── eslint.config.js       # Configuration ESLint
├── components.json        # Configuration shadcn/ui
├── knip.config.ts         # Configuration Knip
├── cz.yaml                # Configuration Commitizen
└── index.ts               # Exports centralisés
```

#### 📁 `docs/` - Documentation
```
docs/
├── README.md              # Documentation principale
├── STRUCTURE_GUIDE.md     # Ce guide
├── AUTH_*.md              # Guides d'authentification
├── MEDIA_*.md             # Guides de gestion des médias
├── OPTIMIZATION_*.md      # Guides d'optimisation
└── ...                    # Autres documentations
```

#### 📁 `scripts/` - Scripts et Tests
```
scripts/
├── test-*.sh              # Scripts de test shell
├── test-*.js              # Scripts de test JavaScript
├── test-*.html            # Pages de test HTML
├── fix-*.sh               # Scripts de correction
└── debug-*.html           # Pages de debug
```

## 🔧 Configuration des Alias

### TypeScript
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/ui/*": ["./components/ui/*"],
      "@/config/*": ["./config/*"],
      "@/docs/*": ["./docs/*"],
      "@/scripts/*": ["./scripts/*"]
    }
  }
}
```

### Vite
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/components/ui': path.resolve(__dirname, './components/ui'),
    '@/config': path.resolve(__dirname, './config'),
    '@/docs': path.resolve(__dirname, './docs'),
    '@/scripts': path.resolve(__dirname, './scripts'),
  },
}
```

## 📦 Imports Recommandés

### Composants UI
```typescript
// ✅ Bon
import { Button, Input } from '@/components/ui'

// ❌ Éviter
import Button from './components/ui/button'
```

### Configuration
```typescript
// ✅ Bon
import { config } from '@/config'

// ❌ Éviter
import { config } from './config'
```

### Documentation
```typescript
// ✅ Bon (pour les liens de documentation)
import docsPath from '@/docs/STRUCTURE_GUIDE.md'
```

## 🎯 Bonnes Pratiques

### 1. Organisation des Composants
- **Composants UI de base** → `components/ui/`
- **Composants métier** → `src/components/`
- **Composants de fonctionnalités** → `src/features/[domain]/components/`

### 2. Gestion des Imports
- Utiliser les alias `@/` pour tous les imports
- Éviter les imports relatifs complexes (`../../../`)
- Centraliser les exports dans les fichiers `index.ts`

### 3. Documentation
- Toute documentation dans `docs/`
- README principal à la racine
- Guides spécialisés dans `docs/`

### 4. Configuration
- Fichiers de config dans `config/`
- Copies de travail à la racine pour les outils
- Versioning des configurations importantes

### 5. Scripts et Tests
- Tous les scripts dans `scripts/`
- Nommage cohérent : `test-*`, `fix-*`, `debug-*`
- Documentation des scripts complexes

## 🚀 Avantages de cette Structure

1. **Clarté** : Chaque dossier a un rôle précis
2. **Maintenabilité** : Facile de trouver et modifier les fichiers
3. **Évolutivité** : Structure qui grandit avec le projet
4. **Collaboration** : Équipe peut facilement comprendre l'organisation
5. **Performance** : Imports optimisés et code splitting efficace
