# 🏪 Configuration des Sous-domaines wozif.store

## 🌐 Format des URLs

Votre application utilise maintenant le format : `{slug}.wozif.store`

### Exemples d'URLs
```
✅ test-store.wozif.store
✅ ma-boutique.wozif.store
✅ digital-store.wozif.store
✅ boutique-2024.wozif.store
```

## 🔧 Configuration technique

### 1. Détection des sous-domaines
```typescript
// Dans useSubdomain.ts
const hostParts = hostname.split('.');
const subdomain = hostParts[0];

// Vérifier si c'est un sous-domaine valide
if (hostParts.length > 2 && subdomain && subdomain !== 'www') {
  setSubdomain(subdomain);
  setIsSubdomain(true);
}
```

### 2. Fonction API Vercel
```javascript
// Dans api/subdomain.js
export default function handler(req, res) {
  const { hostname } = req.headers;
  const hostParts = hostname.split('.');
  const subdomain = hostParts[0];
  
  if (hostParts.length > 2 && subdomain && subdomain !== 'www') {
    const targetUrl = `https://wozif.store/${subdomain}${req.url}`;
    return res.redirect(301, targetUrl);
  }
}
```

### 3. Configuration Vercel
```json
{
  "domains": ["wozif.store", "*.wozif.store"],
  "rewrites": [
    {
      "source": "/api/subdomain",
      "destination": "/api/subdomain.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🚀 Comment ça fonctionne

### Flux de redirection
1. Utilisateur visite `test-store.wozif.store`
2. Vercel détecte le sous-domaine
3. La fonction `api/subdomain.js` extrait le slug
4. Redirection vers `wozif.store/test-store`
5. Application React charge la boutique correspondante

### Détection dans l'application
```typescript
// Dans App.tsx
const { subdomain, isSubdomain } = useSubdomain();
const storeSlug = isSubdomain && subdomain ? subdomain : (pathSegments[0] || 'test-store');
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
npm start
```

### Test en production
1. Créer une boutique avec un slug
2. Accéder via : `{slug}.wozif.store`
3. Vérifier la redirection et le chargement

## ✅ Avantages

- URLs propres et lisibles
- Sous-domaines automatiques
- SEO optimisé
- Compatible avec tous les navigateurs
- Configuration DNS simple

## 🔧 Déploiement

```bash
# Déployer sur Vercel
vercel --prod

# Vérifier les domaines
vercel domains ls
```
