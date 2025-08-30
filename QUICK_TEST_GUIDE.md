# 🧪 Guide de Test Rapide - Endpoint /api/stores

## 🎯 Objectif
Vérifier que l'endpoint `/api/stores` fonctionne correctement après le déploiement sur Forge.

## 🚨 **ÉTAPE CRITIQUE : Redémarrer Forge**
Avant de tester, **REDÉMARREZ votre serveur Forge** :
1. Dashboard Forge → Votre serveur → Sites → `api.wozif.com`
2. **Restart PHP-FPM**
3. **Restart Nginx**

## 🧪 Tests à Effectuer

### Test 1: Vérification CORS
```bash
curl -H "Origin: https://app.wozif.store" -I https://api.wozif.com/api/stores
```

**Résultat attendu :**
```
HTTP/2 200
access-control-allow-origin: https://app.wozif.store
access-control-allow-credentials: true
```

### Test 2: Test de l'Endpoint
```bash
curl -H "Origin: https://app.wozif.store" https://api.wozif.com/api/stores
```

**Résultats possibles :**

#### ✅ **Succès (Base de données)**
```json
{
  "success": true,
  "message": "Boutiques récupérées avec succès",
  "data": [...]
}
```

#### ✅ **Succès (Données statiques)**
```json
{
  "success": true,
  "message": "Boutiques récupérées (données de démonstration)",
  "data": [
    {
      "id": "demo-1",
      "name": "Boutique Demo 1",
      "description": "Boutique de démonstration",
      "slug": "demo-1",
      "logo": null,
      "banner": null,
      "created_at": "2025-08-27T..."
    }
  ],
  "note": "Utilisation de données statiques en raison d'une erreur de base de données"
}
```

#### ❌ **Erreur persistante**
```json
{
  "success": false,
  "message": "Erreur lors de la récupération des boutiques"
}
```

## 🔍 Dépannage

### Si l'erreur persiste :

1. **Vérifiez les logs Laravel** sur Forge :
   ```bash
   # Sur votre serveur Forge
   tail -f /var/www/api.wozif.com/storage/logs/laravel.log
   ```

2. **Vérifiez que la route est bien enregistrée** :
   ```bash
   # Sur votre serveur Forge
   cd /var/www/api.wozif.com
   php artisan route:list | grep stores
   ```

3. **Vérifiez que le contrôleur est bien déployé** :
   ```bash
   # Sur votre serveur Forge
   ls -la /var/www/api.wozif.com/app/Http/Controllers/Api/StoreController.php
   ```

### Problèmes courants :

1. **Serveur non redémarré** → Redémarrez PHP-FPM et Nginx
2. **Cache Laravel** → Videz le cache : `php artisan config:clear`
3. **Permissions** → Vérifiez les permissions des fichiers
4. **Base de données** → Vérifiez la connexion à la base

## 🎯 Résultats Attendus

### ✅ **Après le Redémarrage Forge**
- **CORS fonctionne** : En-têtes `Access-Control-Allow-Origin` présents
- **Endpoint répond** : Plus d'erreur 500
- **Données retournées** : Soit depuis la base, soit données statiques
- **Frontend peut accéder** à l'API sans erreur CORS

### 🔄 **Si Problème Persiste**
1. Vérifiez les logs d'erreur
2. Vérifiez la configuration de la base de données
3. Vérifiez que tous les fichiers sont bien déployés
4. Contactez le support Forge si nécessaire

## 📱 Test Frontend

Une fois l'API fonctionnelle, testez depuis votre frontend :

```javascript
// Dans la console de https://app.wozif.store
fetch('https://api.wozif.com/api/stores')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

**🎯 Objectif : Avoir un endpoint `/api/stores` fonctionnel avec CORS !**
