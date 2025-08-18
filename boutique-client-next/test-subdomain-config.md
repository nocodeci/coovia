# 🧪 Configuration Sous-domaine de Test

## 🎯 Objectif
Créer un sous-domaine de test qui redirige automatiquement vers la boutique "test-store"

## 🌐 Sous-domaine de test
```
https://test.wozif.store → https://test-store.wozif.store
```

## 🔧 Configuration

### 1. Test de résolution DNS
```bash
# Vérifier que le sous-domaine résout
nslookup test.wozif.store

# Vérifier que la boutique cible existe
curl http://localhost:8000/api/boutique/test-store
```

### 2. Configuration du middleware
Le middleware Next.js détecte automatiquement les sous-domaines et redirige vers la bonne boutique.

### 3. Test de redirection
```bash
# Test de la redirection
curl -I https://test.wozif.store
curl -I https://test-store.wozif.store
```

## 🚀 Comment ça fonctionne

### Flux de redirection
1. Utilisateur visite `test.wozif.store`
2. Le middleware Next.js détecte le sous-domaine "test"
3. Extraction du `storeId` = "test"
4. Redirection vers `/{storeId}` = "/test"
5. Chargement de la page `src/app/[storeId]/page.tsx`
6. Récupération des données de la boutique "test-store" via l'API

### Configuration automatique
Avec Vercel, le sous-domaine `test.wozif.store` est automatiquement créé et géré.

## 🧪 Tests

### Test local
```bash
# Ajouter au fichier /etc/hosts
127.0.0.1 test.wozif.store

# Démarrer le serveur
npm run dev

# Tester l'URL
http://test.wozif.store:3000
```

### Test en production
```bash
# Déployer
vercel --prod

# Tester
https://test.wozif.store
```

## ✅ Résultat attendu

- URL d'accès : https://test.wozif.store
- Redirection automatique vers la boutique "test-store"
- Affichage des produits de la boutique test
- Interface personnalisée pour cette boutique

## 🔧 Configuration alternative

Si vous voulez une redirection explicite, vous pouvez ajouter cette configuration dans le middleware :

```typescript
// Dans src/middleware.ts
if (hostname === 'test.wozif.store') {
  return NextResponse.rewrite(new URL('/test-store', request.url))
}
```

## 📋 Checklist

- [x] Boutique "test-store" existe en base de données
- [x] Middleware Next.js configuré
- [x] Routes `[storeId]` créées
- [x] Domaine Vercel configuré
- [ ] Test de la redirection
- [ ] Vérification de l'affichage
