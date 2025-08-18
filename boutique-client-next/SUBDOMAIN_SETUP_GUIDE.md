# 🏪 Configuration des Sous-domaines wozif.store - Next.js

## 🌐 Format des URLs

Ce projet Next.js gère les sous-domaines au format : `{slug}.wozif.store`

### Exemples d'URLs
```
✅ test-store.wozif.store
✅ ma-boutique.wozif.store
✅ digital-store.wozif.store
✅ boutique-2024.wozif.store
```

## 🔧 Configuration technique

### 1. Middleware Next.js
```typescript
// Dans src/middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Extraire le storeId du sous-domaine
  const storeIdMatch = hostname.match(/^([^.]+)\.wozif\.store$/)
  
  if (storeIdMatch) {
    const storeId = storeIdMatch[1]
    
    // Si on est sur la racine, rediriger vers la page d'accueil du store
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(new URL(`/${storeId}`, request.url))
    }
    
    // Pour les autres routes, ajouter le storeId
    const url = request.nextUrl.clone()
    url.pathname = `/${storeId}${url.pathname}`
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}
```

### 2. Configuration Next.js
```javascript
// Dans next.config.mjs
const nextConfig = {
  // Configuration pour les sous-domaines
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
  },
  images: {
    domains: ['localhost', 'wozif.store', '*.wozif.store'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.wozif.store',
        port: '',
        pathname: '/**',
      },
    ],
  },
}
```

### 3. Configuration Vercel
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "domains": ["wozif.store", "*.wozif.store"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.wozif.store"
  }
}
```

## 🚀 Comment ça fonctionne

### Flux de traitement
1. Utilisateur visite `test-store.wozif.store`
2. Le middleware Next.js détecte le sous-domaine
3. Extraction du `storeId` (test-store)
4. Rewrite vers `/{storeId}` (test-store)
5. Chargement de la page `src/app/[storeId]/page.tsx`

### Structure des fichiers
```
src/
├── app/
│   ├── [storeId]/
│   │   ├── page.tsx          # Page d'accueil de la boutique
│   │   ├── product/          # Pages de produits
│   │   └── checkout/         # Pages de paiement
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Page d'accueil principale
├── middleware.ts             # Gestion des sous-domaines
└── ...
```

## 📋 Configuration DNS

### Configuration requise chez votre registrar
```
Type: A
Nom: @ (pour wozif.store)
Valeur: 76.76.21.21 (Vercel)

Type: A
Nom: * (pour *.wozif.store)
Valeur: 76.76.21.21 (Vercel)
```

## 🧪 Test du système

### Test local
1. Modifier le fichier hosts :
```
127.0.0.1 test-store.wozif.store
127.0.0.1 ma-boutique.wozif.store
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

3. Tester les URLs :
```
http://test-store.wozif.store:3000
http://ma-boutique.wozif.store:3000
```

### Test en production
1. Déployer sur Vercel :
```bash
vercel --prod
```

2. Tester les sous-domaines :
```
https://test-store.wozif.store
https://ma-boutique.wozif.store
```

## ✅ Avantages

- URLs propres et lisibles
- Sous-domaines automatiques
- SEO optimisé
- Compatible avec tous les navigateurs
- Configuration DNS simple
- Performance optimisée avec Next.js

## 🔧 Déploiement

```bash
# Installation des dépendances
npm install

# Build de production
npm run build

# Déploiement sur Vercel
vercel --prod

# Vérifier les domaines
vercel domains ls
```

## 🚨 Dépannage

### Problème : Erreur 404 sur les sous-domaines
1. Vérifier la configuration DNS
2. Vérifier que le middleware fonctionne
3. Vérifier que les routes `[storeId]` existent

### Problème : Images non chargées
1. Vérifier la configuration `images` dans `next.config.mjs`
2. Vérifier les domaines autorisés

### Problème : Redirection incorrecte
1. Vérifier le middleware
2. Vérifier les rewrites dans `next.config.mjs`
