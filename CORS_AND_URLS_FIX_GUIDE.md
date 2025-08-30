# 🚀 Guide de Résolution CORS et URLs pour WOZIF

## 📋 Problèmes Identifiés

### 1. **Erreur CORS Persistante**
```
Access to fetch at 'https://api.wozif.com/api/stores' 
from origin 'https://app.wozif.store' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 2. **Connexions localhost:8000**
```
localhost:8000/api/stores/subdomain/flro/check:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:8000/api/stores/subdomain/flora/check:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:8000/api/files/upload-image:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

### 3. **Erreur 500 sur /api/stores**
L'endpoint `/api/stores` retourne une erreur 500 car il nécessite une authentification.

## ✅ Solutions Implémentées

### 1. **Route Publique pour /api/stores**
- ✅ Ajout d'une route publique `/api/stores` qui ne nécessite pas d'authentification
- ✅ Méthode `listPublicStores()` dans le StoreController API
- ✅ Retourne toutes les boutiques actives sans authentification

### 2. **Script de Mise à Jour des URLs**
- ✅ Script `update-frontend-urls.sh` pour remplacer toutes les références `localhost:8000`
- ✅ Remplace automatiquement par `api.wozif.com`
- ✅ Crée des sauvegardes avant modification

## 🔧 Étapes de Résolution

### Phase 1: Vérifier la Configuration CORS (Déjà Fait)
```bash
cd backend
php test-cors-production.php
```

### Phase 2: Tester l'API Mise à Jour
```bash
# Test de l'endpoint /api/stores (maintenant public)
curl -H "Origin: https://app.wozif.store" https://api.wozif.com/api/stores

# Test CORS preflight
curl -H "Origin: https://app.wozif.store" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     https://api.wozif.com/api/stores
```

### Phase 3: Mettre à Jour les URLs Frontend
```bash
# Depuis le dossier backend
./update-frontend-urls.sh
```

### Phase 4: Déployer les Modifications
```bash
# Backend
git add .
git commit -m "Add public stores endpoint and fix CORS issues"
git push origin backend-laravel-clean

# Frontend (après mise à jour des URLs)
cd ../frontend/wozif
git add .
git commit -m "Update API URLs from localhost to api.wozif.com"
git push origin cursor
```

## 🧪 Tests de Vérification

### Test 1: API Backend
```bash
# Test CORS
curl -H "Origin: https://app.wozif.store" -I https://api.wozif.com/api/stores

# Test de la réponse
curl -H "Origin: https://app.wozif.store" https://api.wozif.com/api/stores
```

### Test 2: Frontend (Console Navigateur)
```javascript
// Test simple
fetch('https://api.wozif.com/api/stores')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test avec authentification
fetch('https://api.wozif.com/api/auth/check', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## 📁 Fichiers Modifiés

### Backend
| Fichier | Modification | Statut |
|---------|-------------|---------|
| `routes/api.php` | Ajout route publique `/api/stores` | ✅ Modifié |
| `app/Http/Controllers/Api/StoreController.php` | Ajout méthode `listPublicStores()` | ✅ Modifié |

### Frontend
- Script `update-frontend-urls.sh` créé pour automatiser les remplacements
- Toutes les références `localhost:8000` seront remplacées par `api.wozif.com`

## 🔍 Dépannage

### Si CORS ne fonctionne toujours pas :
1. **Vérifiez que le serveur Forge a été redémarré**
2. **Vérifiez les logs Laravel** : `tail -f storage/logs/laravel.log`
3. **Vérifiez les logs Nginx** : `sudo tail -f /var/log/nginx/error.log`

### Si l'endpoint /api/stores retourne encore une erreur :
1. **Vérifiez que la route est bien ajoutée** dans `routes/api.php`
2. **Vérifiez que la méthode `listPublicStores()` existe** dans le StoreController
3. **Vérifiez que le modèle Store est bien importé**

### Si les URLs localhost persistent :
1. **Exécutez le script** : `./update-frontend-urls.sh`
2. **Vérifiez manuellement** les fichiers modifiés
3. **Redéployez le frontend** sur Vercel

## 🚀 Prochaines Étapes

1. **Déployez le backend** sur Forge
2. **Redémarrez le serveur** (PHP-FPM + Nginx)
3. **Mettez à jour les URLs frontend** avec le script
4. **Déployez le frontend** sur Vercel
5. **Testez l'application complète**

## 📊 Résultats Attendus

### ✅ Après le Déploiement
- **Plus d'erreurs CORS** sur `/api/stores`
- **Endpoint `/api/stores` accessible** sans authentification
- **Plus de connexions localhost:8000**
- **API complètement fonctionnelle** depuis le frontend

### 🔒 Sécurité
- **Route publique** pour lister les boutiques (lecture seule)
- **Routes authentifiées** pour la gestion des boutiques
- **CORS configuré** pour `https://app.wozif.store`

---

**🎯 Objectif : Résoudre complètement les erreurs CORS et les connexions localhost !**
