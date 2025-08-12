# 🏪 Guide du Système de Sous-domaines des Boutiques

## 📋 Vue d'ensemble

Le système de sous-domaines permet à chaque boutique d'avoir sa propre URL personnalisée sous la forme :
```
{slug}.wozif.store
```

### 🌐 Exemples d'URLs
- `ma-boutique.wozif.store`
- `digital-store.wozif.store`
- `formation-pro.wozif.store`

## 🚀 Fonctionnalités

### ✅ Fonctionnalités implémentées
- ✅ Détection automatique des sous-domaines
- ✅ Chargement dynamique des données de boutique
- ✅ Interface personnalisée pour chaque boutique
- ✅ Gestion des erreurs (boutique introuvable)
- ✅ En-tête personnalisé avec logo et informations
- ✅ Navigation entre les boutiques

### 🔧 Configuration technique

#### 1. Configuration Vercel
```json
{
  "rewrites": [
    {
      "source": "/api/store/:slug",
      "destination": "/api/store/[slug].js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. Domaines configurés
- `wozif.store` (domaine principal)
- `*.wozif.store` (sous-domaines wildcard)
- `wizof.store` (domaine alternatif)

## 📁 Structure des fichiers

```
boutique-client/
├── api/
│   └── store/
│       └── [slug].js          # API pour gérer les sous-domaines
├── src/
│   ├── hooks/
│   │   └── useSubdomain.ts    # Hook pour détecter les sous-domaines
│   ├── services/
│   │   └── storeService.ts    # Service pour les données des boutiques
│   ├── components/
│   │   └── StoreHeader.tsx    # En-tête personnalisé des boutiques
│   └── App.tsx                # Logique principale de routage
└── vercel.json               # Configuration Vercel
```

## 🔄 Flux de fonctionnement

### 1. Détection du sous-domaine
```typescript
const { subdomain, isSubdomain } = useSubdomain();
```

### 2. Chargement des données
```typescript
const store = await storeService.getStoreBySlug(subdomain);
```

### 3. Affichage conditionnel
```typescript
{isSubdomain && store && (
  <StoreHeader store={store} subdomain={subdomain} />
)}
```

## 🛠️ API Endpoints

### Récupérer une boutique par slug
```typescript
GET /api/stores/{slug}
```

### Vérifier l'existence d'un sous-domaine
```typescript
GET /api/stores/check/{subdomain}
```

### Générer un slug unique
```typescript
POST /api/stores/generate-slug
Body: { name: "Nom de la boutique" }
```

## 🎨 Interface utilisateur

### En-tête de boutique
- Logo de la boutique
- Nom de la boutique
- Description
- URL du sous-domaine
- Lien de retour vers l'accueil

### Gestion des erreurs
- Page de chargement pendant la récupération des données
- Page d'erreur si la boutique n'existe pas
- Redirection vers l'accueil principal

## 🔧 Configuration backend

Pour que le système fonctionne complètement, le backend doit implémenter :

### 1. Table des boutiques
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  theme VARCHAR(100),
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Endpoints API requis
- `GET /api/stores/{slug}` - Récupérer une boutique
- `GET /api/stores/{slug}/products` - Produits d'une boutique
- `GET /api/stores/check/{subdomain}` - Vérifier l'existence
- `POST /api/stores/generate-slug` - Générer un slug unique

## 🚀 Déploiement

### 1. Configuration des domaines
```bash
# Ajouter le domaine principal
vercel domains add wozif.store

# Ajouter les sous-domaines wildcard
vercel domains add "*.wozif.store"
```

### 2. Déploiement
```bash
vercel --prod
```

## 🧪 Test du système

### Test local
1. Modifier le fichier hosts :
```
127.0.0.1 ma-boutique.wozif.store
127.0.0.1 test-store.wozif.store
```

2. Démarrer le serveur de développement :
```bash
npm start
```

### Test en production
1. Créer une boutique avec un slug
2. Accéder à `{slug}.wozif.store`
3. Vérifier que les données de la boutique s'affichent

## 🔒 Sécurité

### Validation des sous-domaines
- Vérification de l'existence de la boutique
- Protection contre les injections
- Validation des caractères autorisés

### Headers de sécurité
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}
```

## 📈 Performance

### Optimisations
- Cache des données de boutique
- Chargement asynchrone
- Compression des assets
- CDN pour les images

### Monitoring
- Logs des sous-domaines accédés
- Métriques de performance
- Alertes en cas d'erreur

## 🔄 Maintenance

### Mise à jour des données
- Synchronisation automatique avec le backend
- Cache invalidation
- Revalidation des données

### Monitoring
- Vérification de la disponibilité des sous-domaines
- Alertes en cas de problème
- Logs d'erreur détaillés

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs Vercel
2. Tester l'endpoint API directement
3. Vérifier la configuration DNS
4. Contacter l'équipe technique

---

**Dernière mise à jour :** 12 août 2025
**Version :** 1.0.0
