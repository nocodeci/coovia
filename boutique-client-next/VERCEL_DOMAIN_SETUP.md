# 🎯 Configuration Vercel - wozif.store

## ✅ Domaine Vercel Configuré

Votre domaine `wozif.store` est acheté et configuré chez Vercel :

### Informations du domaine
- **Domaine** : wozif.store
- **Registrar** : Vercel
- **Expiration** : 12 août 2026 (361 jours restants)
- **Nameservers** : ns1.vercel-dns.com, ns2.vercel-dns.com ✅
- **Edge Network** : Activé ✅

## 🌐 Configuration automatique

Avec un domaine Vercel, les sous-domaines sont automatiquement gérés :

### URLs d'accès
```
✅ https://wozif.store (domaine principal)
✅ https://test-store.wozif.store (sous-domaine automatique)
✅ https://ma-boutique.wozif.store (sous-domaine automatique)
✅ https://*.wozif.store (tous les sous-domaines)
```

## 🔧 Configuration simplifiée

### 1. Vercel.json (simplifié)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.wozif.store"
  }
}
```

### 2. Next.js config (inchangé)
```javascript
// next.config.mjs
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

## 🚀 Déploiement

### 1. Déployer le projet
```bash
# Dans le dossier boutique-client-next
vercel --prod
```

### 2. Assigner le domaine (si nécessaire)
```bash
# Assigner le domaine au projet
vercel domains add wozif.store

# Vérifier l'assignation
vercel domains ls
```

### 3. Configuration des sous-domaines
Les sous-domaines sont automatiquement gérés par Vercel. Aucune configuration DNS supplémentaire n'est nécessaire.

## 🧪 Tests

### Test de résolution DNS
```bash
# Test du domaine principal
nslookup wozif.store

# Test des sous-domaines
nslookup test-store.wozif.store
nslookup ma-boutique.wozif.store
```

### Test de l'application
```bash
# Test du domaine principal
curl -I https://wozif.store

# Test des sous-domaines
curl -I https://test-store.wozif.store
curl -I https://ma-boutique.wozif.store
```

## ✅ Avantages Vercel

### Configuration automatique
- ✅ Sous-domaines automatiques
- ✅ Certificats SSL automatiques
- ✅ CDN global
- ✅ Edge Network
- ✅ Configuration DNS simplifiée

### Performance
- ✅ Déploiement automatique
- ✅ Cache intelligent
- ✅ Optimisation des images
- ✅ Compression automatique

### Sécurité
- ✅ HTTPS automatique
- ✅ Protection DDoS
- ✅ Headers de sécurité
- ✅ Certificats renouvelés automatiquement

## 🔧 Gestion des domaines

### Commandes utiles
```bash
# Lister tous les domaines
vercel domains ls

# Inspecter un domaine
vercel domains inspect wozif.store

# Ajouter un domaine
vercel domains add wozif.store

# Supprimer un domaine
vercel domains rm wozif.store
```

### Configuration DNS
Aucune configuration DNS manuelle n'est nécessaire. Vercel gère automatiquement :
- Les enregistrements A pour le domaine principal
- Les enregistrements wildcard pour les sous-domaines
- Les certificats SSL
- La propagation DNS

## 🚨 Dépannage

### Problème : Sous-domaines non accessibles
1. Vérifier que le projet est déployé : `vercel ls`
2. Vérifier l'assignation du domaine : `vercel domains ls`
3. Attendre la propagation DNS (peut prendre jusqu'à 24h)

### Problème : Erreur SSL
1. Vercel génère automatiquement les certificats
2. Attendre quelques minutes après le déploiement
3. Vérifier que le domaine pointe vers Vercel

### Problème : Erreur 404
1. Vérifier que le middleware Next.js fonctionne
2. Vérifier que les routes `[storeId]` existent
3. Vérifier que l'API backend est accessible

## 📋 Checklist de déploiement

- [ ] Projet déployé sur Vercel
- [ ] Domaine `wozif.store` assigné au projet
- [ ] Middleware Next.js configuré
- [ ] Routes `[storeId]` créées
- [ ] API backend accessible
- [ ] Tests des sous-domaines effectués

## 🎉 Résultat final

Avec cette configuration, chaque boutique aura automatiquement son propre sous-domaine :
- Boutique "test-store" → https://test-store.wozif.store
- Boutique "ma-boutique" → https://ma-boutique.wozif.store
- Boutique "digital-store" → https://digital-store.wozif.store

Tout fonctionne automatiquement sans configuration DNS manuelle ! 🚀
