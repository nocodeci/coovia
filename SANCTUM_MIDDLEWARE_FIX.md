# 🔧 Correction du Middleware Sanctum - Guide de Déploiement

## 🚨 **Problème Identifié**

La route `/api/user/stores` retournait une erreur `500 Internal Server Error` au lieu de `401 Unauthorized` pour les utilisateurs non authentifiés.

## 🔍 **Cause Racine**

Le middleware `ForceCors` était appliqué globalement dans `app/Http/Kernel.php` et interférait avec le fonctionnement de Sanctum, empêchant l'authentification de fonctionner correctement.

## ✅ **Corrections Appliquées**

### 1. **Suppression du Middleware ForceCors Global**
- ❌ Supprimé `\App\Http\Middleware\ForceCors::class` du tableau `$middleware` global
- ✅ Gardé `\Illuminate\Http\Middleware\HandleCors::class` (CORS natif Laravel)

### 2. **Configuration Sanctum Mise à Jour**
- ✅ Ajouté `app.wozif.store` et `api.wozif.com` aux domaines stateful
- ✅ Permet l'authentification depuis le frontend

### 3. **Fichier ForceCors Supprimé**
- 🗑️ Supprimé `app/Http/Middleware/ForceCors.php` (plus nécessaire)

## 🚀 **Déploiement sur Forge**

### **Étape 1: Pousser les Modifications**
```bash
git add .
git commit -m "🔧 Fix Sanctum middleware - Remove ForceCors global middleware"
git push origin main
```

### **Étape 2: Déployer sur Forge**
```bash
# Via Forge Dashboard ou CLI
forge deploy api.wozif.com
```

### **Étape 3: Vider les Caches**
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
```

## 🧪 **Test de Vérification**

### **Test 1: Route sans Authentification**
```bash
curl "https://api.wozif.com/api/user/stores"
# Attendu: 401 Unauthorized (au lieu de 500)
```

### **Test 2: Route avec Token Invalide**
```bash
curl -H "Authorization: Bearer invalid_token" "https://api.wozif.com/api/user/stores"
# Attendu: 401 Unauthorized
```

### **Test 3: Route Publique**
```bash
curl "https://api.wozif.com/api/stores"
# Attendu: 200 OK
```

## 📋 **Fichiers Modifiés**

1. **`app/Http/Kernel.php`** - Suppression de ForceCors global
2. **`config/sanctum.php`** - Ajout des domaines frontend
3. **`app/Http/Middleware/ForceCors.php`** - Supprimé

## 🎯 **Résultat Attendu**

- ✅ Route `/api/user/stores` retourne `401` pour les utilisateurs non authentifiés
- ✅ Route `/api/user/stores` fonctionne avec un token valide
- ✅ CORS continue de fonctionner via le middleware natif Laravel
- ✅ Sanctum peut authentifier correctement les requêtes

## 🔍 **En Cas de Problème**

Si l'erreur persiste après déploiement :

1. **Vérifier les logs Laravel** : `tail -f storage/logs/laravel.log`
2. **Vérifier les logs Nginx** : `tail -f /var/log/nginx/error.log`
3. **Redémarrer PHP-FPM** : `sudo systemctl restart php8.3-fpm`
4. **Redémarrer Nginx** : `sudo systemctl restart nginx`

## 📝 **Notes Importantes**

- Le middleware CORS natif de Laravel (`HandleCors`) reste actif
- La configuration CORS dans `config/cors.php` reste inchangée
- Sanctum peut maintenant traiter correctement les requêtes authentifiées
