# 🚀 Guide de Déploiement - Sous-domaine de Test

## 🎯 Objectif
Déployer le projet Next.js pour que le sous-domaine `test.wozif.store` soit accessible et redirige vers la boutique "test-store"

## 📋 État actuel
- ✅ Domaine `wozif.store` configuré chez Vercel
- ✅ Sous-domaine `test.wozif.store` résout correctement
- ✅ API backend accessible (boutique test-store existe)
- ❌ Application Next.js non déployée (erreur 404)

## 🔧 Étapes de déploiement

### 1. Vérifier la configuration
```bash
# Vérifier que vous êtes dans le bon dossier
pwd
# Doit afficher : /Users/koffiyohanerickouakou/Documents/GitHub/coovia/boutique-client-next

# Vérifier les fichiers de configuration
ls -la next.config.mjs src/middleware.ts vercel.json
```

### 2. Installer les dépendances
```bash
# Installer les dépendances
npm install

# Vérifier qu'il n'y a pas d'erreurs
npm run build
```

### 3. Déployer sur Vercel
```bash
# Déployer le projet
vercel --prod

# Suivre les instructions :
# - Sélectionner le projet existant ou créer un nouveau
# - Confirmer le déploiement
```

### 4. Assigner le domaine
```bash
# Vérifier les domaines disponibles
vercel domains ls

# Assigner le domaine au projet (si nécessaire)
vercel domains add wozif.store

# Vérifier l'assignation
vercel domains ls
```

### 5. Tester le déploiement
```bash
# Test du domaine principal
curl -I https://wozif.store

# Test du sous-domaine de test
curl -I https://test.wozif.store

# Test de la boutique cible
curl -I https://test-store.wozif.store
```

## 🧪 Tests après déploiement

### Test automatisé
```bash
# Exécuter le script de test
./test-specific-subdomain.sh
```

### Test manuel
1. Ouvrir https://test.wozif.store dans un navigateur
2. Vérifier que la page se charge
3. Vérifier que les données de la boutique "test-store" s'affichent
4. Vérifier que les produits sont visibles

## 🔧 Configuration du middleware

Le middleware Next.js est déjà configuré pour gérer les sous-domaines :

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const storeIdMatch = hostname.match(/^([^.]+)\.wozif\.store$/)
  
  if (storeIdMatch) {
    const storeId = storeIdMatch[1] // "test" pour test.wozif.store
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(new URL(`/${storeId}`, request.url))
    }
    const url = request.nextUrl.clone()
    url.pathname = `/${storeId}${url.pathname}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}
```

## 🎯 Flux de fonctionnement

### Pour test.wozif.store
1. Utilisateur visite `https://test.wozif.store`
2. Le middleware extrait `storeId = "test"`
3. Redirection vers `/{storeId}` = `/test`
4. Chargement de `src/app/[storeId]/page.tsx`
5. Récupération des données de la boutique "test-store" via l'API
6. Affichage de l'interface personnalisée

## 🚨 Dépannage

### Problème : Erreur 404 après déploiement
1. Vérifier que le déploiement s'est bien passé : `vercel ls`
2. Vérifier l'assignation du domaine : `vercel domains ls`
3. Attendre quelques minutes pour la propagation DNS
4. Vérifier les logs de déploiement : `vercel logs`

### Problème : Erreur de build
```bash
# Voir les erreurs de build
npm run build

# Corriger les erreurs et redéployer
vercel --prod
```

### Problème : Middleware ne fonctionne pas
1. Vérifier que `src/middleware.ts` existe
2. Vérifier la configuration dans `next.config.mjs`
3. Redéployer après correction

## ✅ Checklist de déploiement

- [ ] Projet Next.js configuré
- [ ] Dépendances installées (`npm install`)
- [ ] Build réussi (`npm run build`)
- [ ] Déploiement Vercel (`vercel --prod`)
- [ ] Domaine assigné (`vercel domains add wozif.store`)
- [ ] Tests des URLs effectués
- [ ] Sous-domaine test.wozif.store fonctionnel

## 🎉 Résultat attendu

Après le déploiement, vous devriez pouvoir accéder à :
- https://test.wozif.store → Boutique "test-store"
- https://test-store.wozif.store → Boutique "test-store" (direct)
- https://wozif.store → Page d'accueil principale

Le sous-domaine `test.wozif.store` redirigera automatiquement vers la boutique "test-store" avec son interface personnalisée ! 🚀
