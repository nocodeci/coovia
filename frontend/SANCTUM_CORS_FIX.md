# 🔧 Fix CORS pour Sanctum - Guide de dépannage

## 🚨 Problème identifié

Erreur CORS lors de la connexion Sanctum :
```
Access to fetch at 'http://localhost:8000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## ✅ Solutions appliquées

### 1. **Configuration CORS corrigée**

**Fichier : `backend/config/cors.php`**
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ✅ Changé de false à true
];
```

### 2. **Variables d'environnement ajoutées**

**Fichier : `backend/env.example`**
```env
# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173,127.0.0.1:3000,127.0.0.1:5173
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:3000
```

### 3. **Middleware CORS amélioré**

**Fichier : `backend/app/Http/Middleware/Cors.php`**
```php
// Utilise l'origine de la requête au lieu de '*'
$response->headers->set('Access-Control-Allow-Origin', $request->header('Origin', '*'));
$response->headers->set('Access-Control-Allow-Credentials', 'true');
```

## 🚀 Redémarrage du serveur

### Option 1 : Script automatique
```bash
cd backend
./restart-server.sh
```

### Option 2 : Commande manuelle
```bash
cd backend

# Arrêter le serveur existant
pkill -f "php artisan serve"

# Vider le cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Redémarrer
php artisan serve --host=0.0.0.0 --port=8000
```

## 🔍 Vérification

### 1. **Test de l'API**
```bash
# Test de santé
curl http://localhost:8000/api/health

# Test CORS preflight
curl -X OPTIONS -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:8000/api/auth/login
```

### 2. **Vérification des en-têtes**
Les en-têtes de réponse doivent inclure :
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-TOKEN
```

## 🐛 Dépannage avancé

### **Problème : Origin non autorisé**
```bash
# Vérifier les origines autorisées
grep -r "allowed_origins" backend/config/
```

### **Problème : Credentials non supportés**
```bash
# Vérifier supports_credentials
grep -r "supports_credentials" backend/config/
```

### **Problème : Cache de configuration**
```bash
# Vider tous les caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### **Problème : Variables d'environnement**
```bash
# Vérifier que .env existe
ls -la backend/.env

# Vérifier les variables Sanctum
grep -E "(SANCTUM|SESSION|FRONTEND)" backend/.env
```

## 📱 Test frontend

### 1. **Vérifier la configuration frontend**
```typescript
// Dans frontend/src/services/sanctumAuth.ts
constructor() {
  this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  // ...
}
```

### 2. **Test de connexion**
1. Ouvrir http://localhost:5173/sign-in
2. Remplir le formulaire de connexion
3. Vérifier la console du navigateur (F12)
4. Pas d'erreurs CORS = ✅ Succès

## 🔧 Configuration alternative

### **Si le problème persiste, essayer :**

1. **Utiliser des domaines spécifiques**
```php
// backend/config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

2. **Forcer les en-têtes CORS**
```php
// backend/app/Http/Middleware/Cors.php
$response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
```

3. **Configuration Sanctum stricte**
```php
// backend/config/sanctum.php
'stateful' => ['localhost:5173', '127.0.0.1:5173'],
```

## 📞 Support

Si le problème persiste après ces corrections :

1. **Vérifier les logs Laravel**
```bash
tail -f backend/storage/logs/laravel.log
```

2. **Vérifier les logs du navigateur**
- Ouvrir F12 → Console
- Tenter la connexion
- Copier les erreurs exactes

3. **Tester avec Postman**
- Créer une requête POST vers `http://localhost:8000/api/auth/login`
- Ajouter les en-têtes CORS manuellement
- Vérifier la réponse

## ✅ Checklist de vérification

- [ ] `supports_credentials` = `true` dans `config/cors.php`
- [ ] Origines autorisées incluent `http://localhost:5173`
- [ ] Variables d'environnement Sanctum configurées
- [ ] Cache Laravel vidé
- [ ] Serveur redémarré
- [ ] Test de connexion réussi

L'erreur CORS devrait maintenant être résolue ! 🎉
