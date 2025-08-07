# Configuration Hostinger + Vercel

## 🏗️ Architecture actuelle

### Configuration
- **Nom de domaine** : `wozif.com` (hébergé chez Hostinger)
- **Sous-domaine** : `my.wozif.com` (configuré avec Vercel)
- **Déploiement** : Vercel
- **Application** : React (boutique-client)

### DNS Configuration
```
wozif.com          → Hostinger (64.29.17.65, 216.198.79.65)
my.wozif.com       → Vercel (via nameservers Vercel)
```

## ✅ Configuration actuelle

### 1. Vérification DNS
```bash
# Domaine principal
nslookup wozif.com
# ✅ Résout vers Hostinger

# Sous-domaine
nslookup my.wozif.com
# ✅ Résout vers Vercel
```

### 2. URLs fonctionnelles
```
✅ https://my.wozif.com (application principale)
✅ https://my.wozif.com/boutique123 (boutique avec slug)
✅ https://my.wozif.com/ma-boutique (boutique avec slug)
```

## 🔧 Configuration DNS chez Hostinger

### 1. Accès au panneau Hostinger
1. Connectez-vous à votre compte Hostinger
2. Allez dans "Domaines" > "wozif.com"
3. Cliquez sur "Gérer" > "DNS"

### 2. Configuration des nameservers
Pour que `my.wozif.com` fonctionne avec Vercel, vous devez configurer les nameservers Vercel :

```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

### 3. Configuration alternative (si nécessaire)
Si vous ne voulez pas changer les nameservers pour tout le domaine, vous pouvez :

#### Option A : Sous-domaine spécifique
```
Type: CNAME
Nom: my
Valeur: cname.vercel-dns.com
TTL: 3600
```

#### Option B : Apex domain avec A records
```
Type: A
Nom: @
Valeur: 76.76.19.76
TTL: 3600
```

## 🌐 Configuration Vercel

### 1. Domaine configuré
- ✅ `my.wozif.com` est configuré dans Vercel
- ✅ Les nameservers Vercel sont actifs
- ✅ HTTPS est activé automatiquement

### 2. Déploiement automatique
- ✅ Chaque push sur la branche principale déclenche un déploiement
- ✅ Les déploiements sont automatiques
- ✅ Les logs sont disponibles dans le dashboard Vercel

## 🚀 URLs d'accès

### URLs principales
```
🌐 Application principale : https://my.wozif.com
🏪 Boutiques clients : https://my.wozif.com/{slug}
```

### Exemples de boutiques
```
✅ https://my.wozif.com/boutique123
✅ https://my.wozif.com/ma-boutique
✅ https://my.wozif.com/store-abc
✅ https://my.wozif.com/boutique-2024
```

## 📋 Gestion des domaines

### 1. Vercel Dashboard
- Allez sur https://vercel.com/dashboard
- Sélectionnez votre projet `coovia`
- Allez dans "Settings" > "Domains"
- Vérifiez que `my.wozif.com` est configuré

### 2. Hostinger Dashboard
- Connectez-vous à votre compte Hostinger
- Allez dans "Domaines" > "wozif.com"
- Vérifiez la configuration DNS

## 🔒 Sécurité

### HTTPS automatique
- ✅ Vercel génère automatiquement les certificats SSL
- ✅ HTTPS est activé pour tous les sous-domaines
- ✅ Redirection automatique HTTP → HTTPS

### Headers de sécurité
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## 📊 Monitoring

### 1. Vercel Analytics
- Accès via le dashboard Vercel
- Métriques de performance
- Logs de déploiement

### 2. Hostinger Analytics
- Accès via le panneau Hostinger
- Statistiques du domaine principal
- Logs d'accès

## 🚨 Dépannage

### Problème : my.wozif.com ne fonctionne pas
1. Vérifier la configuration DNS chez Hostinger
2. Vérifier que les nameservers Vercel sont configurés
3. Attendre la propagation DNS (peut prendre 24h)

### Problème : HTTPS ne fonctionne pas
1. Vercel génère automatiquement les certificats
2. Vérifier dans le dashboard Vercel
3. Attendre la génération du certificat

### Problème : Déploiement échoue
1. Vérifier les logs dans le dashboard Vercel
2. Vérifier la configuration du projet
3. Tester localement avant déploiement

## 🎯 Avantages de cette configuration

### ✅ Performance
- CDN Vercel pour les fichiers statiques
- Serveurs optimisés pour React
- Cache intelligent

### ✅ Fiabilité
- Déploiement automatique
- Rollback facile
- Monitoring intégré

### ✅ Sécurité
- HTTPS automatique
- Headers de sécurité
- Protection DDoS

### ✅ Scalabilité
- Infrastructure Vercel
- Pas de limite de bande passante
- Performance mondiale

## 📞 Support

### Vercel
- **Documentation** : https://vercel.com/docs
- **Dashboard** : https://vercel.com/dashboard
- **Support** : https://vercel.com/support

### Hostinger
- **Panneau de contrôle** : https://hpanel.hostinger.com
- **Support** : Via le chat en direct
- **Documentation** : https://www.hostinger.com/help

## 🎊 Configuration finale

Votre configuration Hostinger + Vercel est optimale :

- ✅ **Domaine** : wozif.com (Hostinger)
- ✅ **Sous-domaine** : my.wozif.com (Vercel)
- ✅ **Application** : Déployée sur Vercel
- ✅ **URLs** : my.wozif.com/{slug} fonctionnelles
- ✅ **HTTPS** : Activé automatiquement
- ✅ **Performance** : Optimisée par Vercel

### URLs de test
```
✅ https://my.wozif.com
✅ https://my.wozif.com/boutique123
✅ https://my.wozif.com/ma-boutique
```

Votre système est prêt pour la production ! 🚀
