# 🎯 Guide de Séparation des Projets Vercel

## 🌐 Problème identifié

Tous les domaines (`wozif.com`, `app.wozif.com`, `my.wozif.com`) redirigent vers le même dossier `frontend`. Il faut séparer les projets Vercel pour chaque application.

## 🚀 Solution : Séparation des projets

### Structure des projets Vercel

```
Projet 1: coovia (frontend)
├── wozif.com (domaine principal)
└── app.wozif.com (administration)

Projet 2: boutique-client (boutique publique)
└── my.wozif.com (boutique client)
```

## 🔧 Configuration étape par étape

### Étape 1 : Projet Frontend (coovia)
**Dossier** : `frontend/`
**Domaines** : 
- `wozif.com` (domaine principal)
- `app.wozif.com` (administration)

### Étape 2 : Projet Boutique Client (boutique-client)
**Dossier** : `boutique-client/`
**Domaines** :
- `my.wozif.com` (boutique publique)

## 📋 URLs d'accès correctes

### URLs principales
- **Domaine principal** : https://wozif.com → Frontend
- **Administration** : https://app.wozif.com → Frontend
- **Boutique publique** : https://my.wozif.com → Boutique Client

### Structure des applications
```
wozif.com         → Frontend (administration)
app.wozif.com     → Frontend (administration)
my.wozif.com      → Boutique Client (public)
```

## 🧪 Tests

### Script de test pour boutique-client
```bash
# Dans le dossier boutique-client
./test-urls.sh

# Test manuel
curl -I https://my.wozif.com
nslookup my.wozif.com
```

### Script de test pour frontend
```bash
# Dans le dossier frontend
./test-app-domain.sh

# Test manuel
curl -I https://app.wozif.com
curl -I https://wozif.com
```

## 🔒 Configuration DNS chez Hostinger

### Configuration requise
```
Type: A
Nom: @ (pour wozif.com)
Valeur: 76.76.21.21
TTL: 3600

Type: A
Nom: app
Valeur: 76.76.21.21
TTL: 3600

Type: A
Nom: my
Valeur: 76.76.21.21
TTL: 3600
```

## 🚨 Dépannage

### Problème : Tous les domaines pointent vers frontend
1. Vérifier que chaque projet Vercel est séparé
2. Vérifier la configuration DNS
3. Vérifier les domaines assignés dans chaque projet

### Problème : Domaine non accessible
1. Vérifier la configuration DNS chez Hostinger
2. Vérifier que le domaine est configuré dans le bon projet Vercel
3. Vérifier les logs Vercel

### Problème : Erreur 404
1. Vérifier que l'application est déployée
2. Vérifier la configuration vercel.json
3. Vérifier les logs Vercel

## 🎯 Avantages

### ✅ Séparation des applications
- Frontend d'administration sur wozif.com et app.wozif.com
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

### ✅ Sécurité
- HTTPS obligatoire
- Headers de sécurité
- Protection contre les attaques

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
wozif.com         → Frontend (administration)
app.wozif.com     → Frontend (administration)
my.wozif.com      → Boutique Client (public)
```

### 📋 Fichiers créés
- `PROJECT_SEPARATION_GUIDE.md` - Ce guide
- `test-urls.sh` - Script de test pour boutique-client
- `test-app-domain.sh` - Script de test pour frontend

### 🚀 Commandes utiles
```bash
# Déploiement boutique-client
cd boutique-client && vercel --prod

# Déploiement frontend
cd frontend && vercel --prod

# Tests
./test-urls.sh
./test-app-domain.sh

# Logs
vercel logs
```

**Vos applications sont maintenant correctement séparées !** 🚀
