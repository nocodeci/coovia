# 🚀 Déploiement sur Vercel - Boutique Client Next

## 📋 Configuration des Sous-domaines

Ce projet est configuré pour fonctionner avec le système de sous-domaines `{slug}.wozif.store`.

### 🔧 Configuration Vercel

1. **Connectez-vous à Vercel** et importez ce projet
2. **Configurez les variables d'environnement** :
   ```
   NEXT_PUBLIC_API_URL=https://api.wozif.store
   ```

3. **Configurez le domaine personnalisé** :
   - Ajoutez `wozif.store` comme domaine principal
   - Activez les sous-domaines wildcard `*.wozif.store`

### 🌐 Structure des URLs

- **Boutique principale** : `wozif.store`
- **Sous-domaines** : `{store-slug}.wozif.store`
- **Exemples** :
  - `boutique-demo.wozif.store`
  - `mon-magasin.wozif.store`
  - `store-123.wozif.store`

### 🔄 Fonctionnement

1. **Middleware** : Intercepte les requêtes et extrait le `storeId` du sous-domaine
2. **Routing** : Redirige vers `/[storeId]` automatiquement
3. **API** : Récupère les données de la boutique via l'API

### 📁 Structure des Fichiers

```
src/
├── app/
│   ├── page.tsx                    # Page d'accueil (redirection)
│   ├── [storeId]/
│   │   ├── page.tsx               # Page de la boutique
│   │   ├── product/
│   │   └── checkout/
│   └── layout.tsx
├── middleware.ts                   # Gestion des sous-domaines
└── components/
```

### 🚀 Déploiement

```bash
# Installation
npm install

# Build local
npm run build

# Déploiement sur Vercel
npm run deploy
```

### ⚙️ Configuration DNS

Assurez-vous que votre domaine `wozif.store` pointe vers Vercel :

```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

### 🔍 Test

Après le déploiement, testez avec :
- `https://test-store.wozif.store`
- `https://demo.wozif.store`
- `https://wozif.store` (page d'accueil)

### 📝 Notes Importantes

- Le middleware gère automatiquement l'extraction du `storeId`
- Les images sont configurées pour les domaines `*.wozif.store`
- L'API backend doit être accessible via `https://api.wozif.store`
- Les sous-domaines sont créés automatiquement par Vercel

### 🛠️ Développement Local

```bash
# Démarrer en mode développement
npm run dev

# Tester avec un sous-domaine local
# Ajoutez dans /etc/hosts :
# 127.0.0.1 test-store.wozif.store
```

### 🔧 Variables d'Environnement

```env
NEXT_PUBLIC_API_URL=https://api.wozif.store
NODE_ENV=production
```

### 📊 Monitoring

- **Vercel Analytics** : Activé automatiquement
- **Logs** : Accessibles via le dashboard Vercel
- **Performance** : Monitoring automatique des sous-domaines
