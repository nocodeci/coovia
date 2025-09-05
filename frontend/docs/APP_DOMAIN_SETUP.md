# 🎯 Configuration du domaine app.wozif.com

## 🌐 Objectif

Configurer le dossier `frontend` pour qu'il soit accessible sur `app.wozif.com`

## 🔧 Configuration DNS chez Hostinger

### Étape 1 : Accès au panneau Hostinger
1. Connectez-vous à votre compte Hostinger
2. Allez dans "Domaines" > "wozif.com"
3. Cliquez sur "Gérer" > "DNS"

### Étape 2 : Configuration du sous-domaine app
```
Type: A
Nom: app
Valeur: 76.76.21.21
TTL: 3600
```

## 🌐 Configuration Vercel

### Étape 1 : Domaine ajouté
✅ Le domaine `app.wozif.com` a été ajouté au projet Vercel

### Étape 2 : Vérification de la configuration
```bash
vercel domains ls
```

## 🚀 Déploiement

### Étape 1 : Déploiement en production
```bash
vercel --prod
```

### Étape 2 : Vérification
```bash
curl -I https://app.wozif.com
```

## 📋 URLs d'accès

### URLs principales
- **Frontend** : https://app.wozif.com
- **Boutique Client** : https://my.wozif.com

### Structure des applications
```
app.wozif.com     → Frontend (administration)
my.wozif.com      → Boutique Client (public)
```

## 🧪 Tests

### Script de test
```bash
# Test du domaine app
curl -I https://app.wozif.com

# Test de la résolution DNS
nslookup app.wozif.com
```

## 🔒 Sécurité

### Headers de sécurité configurés
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## 📊 Monitoring

### Logs Vercel
- Accès aux logs de l'application
- Monitoring des erreurs
- Analytics par domaine

## 🚨 Dépannage

### Problème : Domaine non accessible
1. Vérifier la configuration DNS chez Hostinger
2. Vérifier que le domaine est configuré dans Vercel
3. Vérifier les logs Vercel

### Problème : Erreur 404
1. Vérifier que l'application est déployée
2. Vérifier la configuration vercel.json
3. Vérifier les logs Vercel

## 🎯 Avantages

### ✅ Séparation des applications
- Frontend d'administration sur app.wozif.com
- Boutique client sur my.wozif.com
- Structure claire et organisée

### ✅ Performance
- CDN Vercel pour chaque application
- Cache intelligent
- Performance mondiale

### ✅ Flexibilité
- Déploiements indépendants
- Configuration séparée
- Maintenance facilitée

## 📞 Support

### Hostinger
- **Panneau de contrôle** : https://hpanel.hostinger.com
- **Support** : Via le chat en direct
- **Documentation** : https://www.hostinger.com/help

### Vercel
- **Documentation** : https://vercel.com/docs
- **Dashboard** : https://vercel.com/dashboard
- **Support** : https://vercel.com/support

---

## 🎊 Configuration finale

Avec cette configuration, vous aurez :

```
app.wozif.com     → Frontend (administration)
my.wozif.com      → Boutique Client (public)
```

Le système est organisé et prêt pour la production ! 🚀
