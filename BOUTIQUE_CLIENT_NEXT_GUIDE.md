# 🏪 Guide Boutique Client Next.js

## 🎯 Projet : boutique-client-next

### **📁 Structure :**
```
boutique-client-next/
├── package.json          # Dépendances Next.js
├── next.config.mjs       # Configuration Next.js
├── src/
│   ├── app/             # Pages et composants
│   ├── components/      # Composants UI
│   └── ...
└── public/              # Assets statiques
```

### **🔧 Configuration :**

#### **Package.json :**
```json
{
  "name": "boutique-client-next",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",        // Démarrage développement
    "build": "next build",    // Build production
    "start": "next start",    // Démarrage production
    "deploy": "vercel --prod" // Déploiement Vercel
  }
}
```

#### **Next.config.mjs :**
```javascript
// Configuration pour les sous-domaines dynamiques
async rewrites() {
  return [
    {
      source: '/:path*',
      destination: '/[storeId]/:path*',
      has: [
        {
          type: 'host',
          value: '(?<storeId>[^.]+)\.wozif\.store',
        },
      ],
    },
  ]
}
```

## 🚀 Démarrage Rapide

### **1. Installation :**
```bash
cd boutique-client-next
npm install
```

### **2. Démarrage Développement :**
```bash
# Option 1: Directement
npm run dev

# Option 2: Avec le script
./start-boutique-next.sh
```

### **3. Accès :**
- **URL** : `http://localhost:3000`
- **Format boutique** : `http://localhost:3000/{slug}`

## 🔗 Intégration avec le Frontend Principal

### **Configuration Frontend :**
```typescript
// frontend/src/utils/environment.ts
export const BOUTIQUE_CLIENT_BASE_URL = isDevelopment 
  ? 'http://localhost:3000' 
  : 'https://wozif.store'

export function getBoutiqueUrl(slug: string): string {
  if (isDevelopment) {
    return `${BOUTIQUE_CLIENT_BASE_URL}/${slug}`
  }
  return `https://${slug}.wozif.store`
}
```

### **Flux de Redirection :**
1. **Clic bouton** → `handleViewStorefront(store)`
2. **API call** → `/api/boutique/slug/{storeId}`
3. **URL générée** → `http://localhost:3000/{slug}`
4. **Onglet ouvert** → `window.open(url, '_blank')`

## 🧪 Tests

### **Test Local :**
```bash
# 1. Démarrer le serveur
./start-boutique-next.sh

# 2. Créer une boutique via le frontend principal
# 3. Cliquer sur "Voir la boutique"
# 4. Vérifier que l'URL est: http://localhost:3000/{slug}
```

### **Test API :**
```bash
# Tester l'endpoint API
curl -X GET "http://localhost:8000/api/boutique/slug/{storeId}"
```

## 🎯 Fonctionnalités

### **✅ Configuré :**
- **Next.js 15** avec React 19
- **Sous-domaines dynamiques** pour Vercel
- **Images optimisées** avec domaines autorisés
- **Routing dynamique** avec `[storeId]`
- **Tailwind CSS** pour le styling

### **🔧 Optimisations :**
- **Images** : Domaines `*.wozif.store` autorisés
- **Performance** : Optimisation des imports
- **Développement** : Hot reload configuré
- **Build** : ESLint désactivé pour le build

## 🚀 Déploiement

### **Développement :**
```bash
npm run dev
# http://localhost:3000
```

### **Production (Vercel) :**
```bash
npm run deploy
# https://{slug}.wozif.store
```

### **Configuration Vercel :**
- **Projet** : boutique-client-next
- **Domaine** : wozif.store
- **Sous-domaines** : Dynamiques
- **Build Command** : `npm run build`

## 📋 Checklist

### **Développement :**
- [x] **Next.js configuré** avec sous-domaines
- [x] **Script de démarrage** créé
- [x] **Intégration frontend** configurée
- [x] **API endpoint** fonctionne
- [ ] **Test local** avec vraie boutique

### **Production :**
- [x] **Configuration Vercel** prête
- [x] **Sous-domaines** configurés
- [ ] **Déploiement** effectué
- [ ] **Test production** validé

## 🎉 Résultat

**Le projet boutique-client-next est configuré pour :**
- ✅ **Développement** : `http://localhost:3000/{slug}`
- ✅ **Production** : `https://{slug}.wozif.store`
- ✅ **Intégration** avec le frontend principal
- ✅ **Sous-domaines dynamiques** sur Vercel

**Prêt pour le test du bouton "Voir la boutique" !** 🚀
