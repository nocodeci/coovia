# 🔧 Dépannage des Sous-domaines

## 🚨 Problème identifié

Les sous-domaines retournent une erreur 404 avec le message `DEPLOYMENT_NOT_FOUND`.

### URLs testées
- ✅ https://wozif.store (fonctionne - status 200)
- ❌ https://test.wozif.store (erreur 404)
- ❌ https://test-store.wozif.store (erreur 404)

## 🔍 Diagnostic

### 1. Configuration Vercel
Le domaine `wozif.store` est bien configuré et fonctionne pour le domaine principal.

### 2. Problème des sous-domaines
Les sous-domaines ne sont pas correctement configurés dans Vercel.

## 🛠️ Solutions

### Solution 1 : Configuration DNS manuelle

1. **Accéder au dashboard Vercel**
   - Aller sur https://vercel.com/dashboard
   - Sélectionner le projet `woziff`
   - Aller dans "Settings" > "Domains"

2. **Configurer les sous-domaines**
   - Ajouter `*.wozif.store` comme domaine wildcard
   - Ou ajouter individuellement `test.wozif.store`

### Solution 2 : Configuration via CLI

```bash
# Ajouter un sous-domaine spécifique
vercel domains add test.wozif.store

# Ou ajouter un domaine wildcard
vercel domains add "*.wozif.store"
```

### Solution 3 : Configuration DNS chez Vercel

1. **Vérifier la configuration DNS**
   ```bash
   nslookup test.wozif.store
   nslookup test-store.wozif.store
   ```

2. **Ajouter des enregistrements DNS**
   - Type: A
   - Nom: * (pour tous les sous-domaines)
   - Valeur: 76.76.21.21 (Vercel)

## 🔧 Configuration alternative

### Redirection via rewrites Vercel

Ajouter dans `vercel.json` :

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.wozif.store"
  },
  "rewrites": [
    {
      "source": "/test",
      "destination": "/test-store"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Configuration Next.js

Modifier `next.config.mjs` :

```javascript
const nextConfig = {
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
      // Redirection spécifique pour test.wozif.store
      {
        source: '/test',
        destination: '/test-store',
        has: [
          {
            type: 'host',
            value: 'test\.wozif\.store',
          },
        ],
      },
    ]
  },
}
```

## 🧪 Tests

### Test de résolution DNS
```bash
nslookup test.wozif.store
nslookup test-store.wozif.store
```

### Test de l'application
```bash
curl -I https://test.wozif.store
curl -I https://test-store.wozif.store
```

### Test local
```bash
# Ajouter au fichier /etc/hosts
127.0.0.1 test.wozif.store
127.0.0.1 test-store.wozif.store

# Démarrer le serveur
npm run dev

# Tester
http://test.wozif.store:3000
http://test-store.wozif.store:3000
```

## 🚨 Problèmes courants

### 1. Erreur DEPLOYMENT_NOT_FOUND
- Vérifier que le projet est déployé
- Vérifier la configuration DNS
- Vérifier l'assignation des domaines

### 2. Sous-domaines non accessibles
- Vérifier la configuration wildcard DNS
- Vérifier les enregistrements A
- Attendre la propagation DNS (jusqu'à 24h)

### 3. Middleware ne fonctionne pas
- Vérifier la configuration Next.js
- Vérifier les rewrites
- Redéployer après modification

## 📋 Checklist de résolution

- [ ] Vérifier la configuration DNS
- [ ] Ajouter les sous-domaines dans Vercel
- [ ] Configurer les rewrites
- [ ] Redéployer le projet
- [ ] Tester les sous-domaines
- [ ] Vérifier le middleware

## 🎯 Résultat attendu

Après résolution, vous devriez pouvoir accéder à :
- ✅ https://wozif.store (domaine principal)
- ✅ https://test.wozif.store (sous-domaine de test)
- ✅ https://test-store.wozif.store (boutique directe)

Tous les sous-domaines devraient rediriger vers les bonnes boutiques ! 🚀
