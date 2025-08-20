# Résolution du Problème de Sous-domaine

## Problème Initial
- Erreur 404 lors de l'accès à `https://test.wozif.store`
- Le middleware fonctionnait mais la page n'était pas trouvée

## Cause du Problème
**Conflit entre le middleware et les rewrites dans `next.config.mjs`**

Le fichier `next.config.mjs` contenait une configuration de rewrites qui entrait en conflit avec le middleware :

```javascript
// Configuration problématique dans next.config.mjs
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

Cette configuration créait une double redirection avec le middleware, causant des erreurs 404.

## Solution Appliquée

### 1. Suppression des Rewrites dans next.config.mjs
Supprimé la section `rewrites()` du fichier `next.config.mjs` pour éviter les conflits.

### 2. Middleware Optimisé
Le middleware dans `src/middleware.ts` gère maintenant entièrement la logique des sous-domaines :

```typescript
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Extraire le storeId du sous-domaine
  const storeIdMatch = hostname.match(/^([^.]+)\.wozif\.store$/)
  
  if (storeIdMatch) {
    let storeId = storeIdMatch[1]
    
    // Redirection spéciale pour le sous-domaine de test
    if (storeId === 'test') {
      storeId = 'test-store'
    }
    
    // Rediriger vers la page du store
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(new URL(`/${storeId}`, request.url))
    }
    
    // Pour les autres routes
    const url = request.nextUrl.clone()
    url.pathname = `/${storeId}${url.pathname}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}
```

## Configuration Finale

### Fichiers Modifiés
1. **`next.config.mjs`** - Suppression des rewrites
2. **`src/middleware.ts`** - Logique de sous-domaine optimisée

### Structure des Routes
```
src/app/
├── page.tsx (page d'accueil)
└── [storeId]/
    ├── page.tsx (page de boutique)
    ├── product/
    └── checkout/
```

## Test de Fonctionnement

### Sous-domaine de Test
- **URL** : `https://test.wozif.store`
- **Redirection** : `test` → `test-store`
- **Route finale** : `/[storeId]/test-store`
- **Status** : ✅ 200 OK

### Vérification
```bash
curl -I https://test.wozif.store
# HTTP/2 200
# x-matched-path: /[storeId]
```

## Prochaines Étapes

1. **Créer d'autres sous-domaines** en ajoutant des conditions dans le middleware
2. **Connecter à l'API** pour récupérer les vraies données des boutiques
3. **Gérer les erreurs** pour les sous-domaines inexistants
4. **Optimiser les performances** avec du cache

## Notes Importantes

- Le middleware doit être la seule source de vérité pour la gestion des sous-domaines
- Éviter les conflits entre middleware et rewrites dans `next.config.mjs`
- Tester toujours avec `curl -I` pour vérifier les headers de réponse
- Les logs Vercel sont essentiels pour le débogage
