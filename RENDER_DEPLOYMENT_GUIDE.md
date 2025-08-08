# 🚀 Guide de Déploiement Laravel sur Render

## 📋 Prérequis

- Compte Render.com
- Repository GitHub avec votre code Laravel
- Base de données Supabase configurée

## 🔧 Configuration

### 1. Fichiers de Configuration

Votre projet est déjà configuré avec :
- ✅ `backend/render.yaml` - Configuration Render
- ✅ `backend/deploy.sh` - Script de déploiement
- ✅ `backend/composer.json` - Dépendances PHP

### 2. Variables d'Environnement Requises

Configurez ces variables dans Render Dashboard :

```env
# Application
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.render.com

# Base de données Supabase
DB_CONNECTION=pgsql
DB_HOST=votre-supabase-host.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre-supabase-password

# Cache et Sessions
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Logs
LOG_CHANNEL=stack
LOG_LEVEL=error

# Payment Gateways
PAYDUNYA_MASTER_KEY=votre-paydunya-master-key
PAYDUNYA_PUBLIC_KEY=votre-paydunya-public-key
PAYDUNYA_PRIVATE_KEY=votre-paydunya-private-key
PAYDUNYA_TOKEN=votre-paydunya-token

MONEROO_PUBLIC_KEY=votre-moneroo-public-key
MONEROO_SECRET_KEY=votre-moneroo-secret-key
MONEROO_ENVIRONMENT=production

# CORS
FRONTEND_URL=https://votre-frontend.vercel.app
```

## 🚀 Étapes de Déploiement

### Étape 1 : Préparer le Repository

```bash
# Assurez-vous que tous les fichiers sont commités
git add .
git commit -m "Préparation pour déploiement Render"
git push origin main
```

### Étape 2 : Créer le Service sur Render

1. Allez sur [render.com](https://render.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New +" → "Web Service"
4. Connectez votre repository GitHub
5. Configurez le service :

**Configuration de base :**
- **Name** : `coovia-backend`
- **Environment** : `PHP`
- **Region** : `Frankfurt (EU Central)`
- **Branch** : `main`
- **Root Directory** : `backend`

**Build Command :**
```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Start Command :**
```bash
chmod +x deploy.sh
./deploy.sh
vendor/bin/heroku-php-apache2 public/
```

### Étape 3 : Configurer les Variables d'Environnement

Dans le dashboard Render, allez dans "Environment" et ajoutez toutes les variables listées ci-dessus.

### Étape 4 : Déployer

1. Cliquez sur "Create Web Service"
2. Render va automatiquement :
   - Cloner votre repository
   - Installer les dépendances
   - Exécuter le script de déploiement
   - Démarrer l'application

## 🔍 Vérification du Déploiement

### 1. Logs de Déploiement

Vérifiez les logs dans Render Dashboard :
- ✅ Installation des dépendances
- ✅ Génération de la clé d'application
- ✅ Optimisation du cache
- ✅ Connexion à Supabase
- ✅ Exécution des migrations

### 2. Test de l'API

```bash
# Test de l'endpoint de santé
curl https://votre-app.render.com/api/health

# Test de l'API
curl https://votre-app.render.com/api/stores
```

### 3. Vérification des Routes

```bash
# Lister toutes les routes
curl https://votre-app.render.com/api/routes
```

## 🛠️ Dépannage

### Problème 1 : Erreur de Connexion Supabase

**Symptôme :** `SQLSTATE[08006] [7] could not connect to server`

**Solution :**
1. Vérifiez les variables d'environnement Supabase
2. Assurez-vous que l'IP de Render est autorisée dans Supabase
3. Testez la connexion localement

### Problème 2 : Erreur de Permissions

**Symptôme :** `Permission denied` dans les logs

**Solution :**
```bash
# Dans le script deploy.sh, ajoutez :
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Problème 3 : Erreur de Cache

**Symptôme :** `Class not found` ou erreurs de cache

**Solution :**
```bash
# Dans le script deploy.sh, ajoutez :
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

## 📊 Monitoring

### 1. Logs en Temps Réel

Dans Render Dashboard :
- **Logs** : Voir les logs en temps réel
- **Metrics** : CPU, mémoire, requêtes
- **Events** : Déploiements, redémarrages

### 2. Health Checks

Configurez un endpoint de santé :

```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected'
    ]);
});
```

## 🔄 Mise à Jour

### Déploiement Automatique

Render déploie automatiquement à chaque push sur la branche configurée.

### Déploiement Manuel

```bash
# Dans Render Dashboard
1. Allez dans votre service
2. Cliquez sur "Manual Deploy"
3. Sélectionnez la branche
4. Cliquez sur "Deploy"
```

## 🎯 URLs Finales

Après le déploiement, vous aurez :
- **Backend API** : `https://coovia-backend.onrender.com`
- **Frontend** : `https://votre-frontend.vercel.app`
- **Boutique** : `https://votre-boutique.vercel.app`

## 📞 Support

- **Documentation Render** : [render.com/docs](https://render.com/docs)
- **Laravel sur Render** : [render.com/docs/deploy-laravel](https://render.com/docs/deploy-laravel)
- **Logs de déploiement** : Dashboard Render → Votre service → Logs

---

**Prochaine étape** : Déployer le backend, puis configurer les frontends pour utiliser la nouvelle URL API.
