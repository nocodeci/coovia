# 🚀 Guide de Configuration Vercel pour les Sous-domaines

## ✅ Configuration Terminée !

### **🔧 Variables Configurées :**
```bash
VERCEL_TOKEN=rb3kfReBgk4l9adq74XKJMZx
VERCEL_PROJECT_ID=prj_Car1dBmRLlMSWfyDLPlKGPQGGLdj
VERCEL_DOMAIN=wozif.store
```

### **🧪 Tests Validés :**
- ✅ **Configuration Vercel** : Fonctionne
- ✅ **Création de sous-domaine** : Fonctionne
- ✅ **Suppression de sous-domaine** : Fonctionne
- ✅ **Validation de slug** : Fonctionne

## 🎯 Fonctionnement

### **Création Automatique**
Quand une boutique est créée via le frontend :
1. ✅ **Boutique créée** en base de données
2. ✅ **Sous-domaine créé** automatiquement sur Vercel
3. ✅ **URL générée** : `https://{slug}.wozif.store`

### **Exemple de Test**
```bash
# Test de création complète
php test-store-with-subdomain.php

# Résultat attendu :
# ✅ Sous-domaine créé avec succès!
# 🌐 URL: https://test-boutique-1234567890.wozif.store
```

## 📋 Structure des Sous-domaines

### **Format**
- **URL** : `https://{slug}.wozif.store`
- **Exemple** : `https://ma-boutique.wozif.store`

### **Validation des Slugs**
- ✅ **Autorisés** : lettres minuscules, chiffres, tirets
- ❌ **Interdits** : caractères spéciaux, espaces, majuscules
- ❌ **Réservés** : www, api, admin, shop, store, etc.

## 🔍 Monitoring

### **Logs en Temps Réel**
```bash
tail -f storage/logs/laravel.log | grep -i subdomain
```

### **Vérification dans Vercel**
1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez le projet `wozif-store`
3. Allez dans "Domains"
4. Vous verrez les sous-domaines créés

### **Test de Configuration**
```bash
php test-vercel-config.php
```

## 🚨 Problèmes Courants

### **1. Token Invalide**
```
Erreur: 401 Unauthorized
```
**Solution** : Vérifiez le token Vercel

### **2. Project ID Incorrect**
```
Erreur: 404 Not Found
```
**Solution** : Vérifiez le Project ID

### **3. Slug Invalide**
```
Erreur: Slug invalide
```
**Solution** : Utilisez un slug conforme aux règles

### **4. Sous-domaine Existant**
```
Erreur: Sous-domaine déjà utilisé
```
**Solution** : Choisissez un autre nom

## 🎉 Résultat Final

Maintenant, chaque boutique créée aura automatiquement :
- ✅ **Sous-domaine Vercel** : `https://{slug}.wozif.store`
- ✅ **Configuration automatique** : DNS, SSL, CDN
- ✅ **Performance optimisée** : Réseau global Vercel
- ✅ **Apparition dans Vercel Dashboard** : Immédiate

## 📞 Support

- **Documentation Vercel** : [Vercel Domains API](https://vercel.com/docs/rest-api/endpoints#domains)
- **Dashboard Vercel** : [Vercel Dashboard](https://vercel.com/dashboard)
- **Logs** : `storage/logs/laravel.log`

## 🚀 Prochaines Étapes

1. **Testez la création de boutique** via votre frontend
2. **Vérifiez dans Vercel Dashboard** que le sous-domaine apparaît
3. **Surveillez les logs** pour voir les détails de création
