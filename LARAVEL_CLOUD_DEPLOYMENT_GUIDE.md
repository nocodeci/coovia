# 🚀 Guide de Déploiement Laravel Cloud

## 📋 **Prérequis**

### **1. Compte Laravel Cloud**
- ✅ Compte Laravel Cloud actif
- ✅ Projet créé sur Laravel Cloud
- ✅ Clés SSH configurées

### **2. Configuration Locale**
- ✅ Git configuré
- ✅ Composer installé
- ✅ PHP 8.2+ installé

## 🔧 **Préparation du Code**

### **1. Optimisations de Production**
```bash
# Installer les dépendances de production uniquement
cd backend
composer install --optimize-autoloader --no-dev

# Cacher les configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **2. Variables d'Environnement**
Créer un fichier `.env.production` avec les variables suivantes :

```env
APP_NAME="Coovia API"
APP_ENV=production
APP_KEY=base64:VOTRE_CLE_ICI
APP_DEBUG=false
APP_URL=https://votre-app.laravelcloud.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coovia_prod
DB_USERNAME=coovia_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

# Configuration Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=VOTRE_ACCESS_KEY
CLOUDFLARE_R2_SECRET_ACCESS_KEY=VOTRE_SECRET_KEY
CLOUDFLARE_R2_DEFAULT_REGION=auto
CLOUDFLARE_R2_BUCKET=VOTRE_BUCKET
CLOUDFLARE_R2_ENDPOINT=https://VOTRE_ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://VOTRE_DOMAIN.r2.dev

# Configuration Sanctum
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com,localhost:3000,localhost:5173
SESSION_DOMAIN=.votre-domaine.com
```

## 🚀 **Déploiement sur Laravel Cloud**

### **1. Connexion à Laravel Cloud**
```bash
# Installer Laravel Cloud CLI (si pas déjà fait)
composer global require laravel/cloud

# Se connecter à votre compte
laravel cloud login
```

### **2. Créer un Projet (si pas déjà fait)**
```bash
# Lister les projets existants
laravel cloud projects

# Créer un nouveau projet
laravel cloud projects:create coovia-api

# Ou utiliser un projet existant
laravel cloud projects:use VOTRE_PROJET_ID
```

### **3. Configurer l'Environnement**
```bash
# Configurer les variables d'environnement
laravel cloud env:set APP_NAME="Coovia API"
laravel cloud env:set APP_ENV=production
laravel cloud env:set APP_DEBUG=false
laravel cloud env:set APP_URL=https://votre-app.laravelcloud.com

# Configurer la base de données
laravel cloud env:set DB_CONNECTION=mysql
laravel cloud env:set DB_HOST=127.0.0.1
laravel cloud env:set DB_PORT=3306
laravel cloud env:set DB_DATABASE=coovia_prod
laravel cloud env:set DB_USERNAME=coovia_user
laravel cloud env:set DB_PASSWORD=VOTRE_MOT_DE_PASSE

# Configurer Sanctum
laravel cloud env:set SANCTUM_STATEFUL_DOMAINS=votre-frontend.com,localhost:3000,localhost:5173
laravel cloud env:set SESSION_DOMAIN=.votre-domaine.com

# Configurer Cloudflare R2
laravel cloud env:set CLOUDFLARE_R2_ACCESS_KEY_ID=VOTRE_ACCESS_KEY
laravel cloud env:set CLOUDFLARE_R2_SECRET_ACCESS_KEY=VOTRE_SECRET_KEY
laravel cloud env:set CLOUDFLARE_R2_DEFAULT_REGION=auto
laravel cloud env:set CLOUDFLARE_R2_BUCKET=VOTRE_BUCKET
laravel cloud env:set CLOUDFLARE_R2_ENDPOINT=https://VOTRE_ACCOUNT_ID.r2.cloudflarestorage.com
laravel cloud env:set CLOUDFLARE_R2_URL=https://VOTRE_DOMAIN.r2.dev
```

### **4. Déployer l'Application**
```bash
# Déployer depuis le répertoire backend
cd backend
laravel cloud deploy

# Ou déployer depuis la racine du projet
laravel cloud deploy --path=backend
```

### **5. Exécuter les Migrations**
```bash
# Exécuter les migrations en production
laravel cloud ssh
php artisan migrate --force

# Ou depuis l'extérieur
laravel cloud ssh --command="php artisan migrate --force"
```

### **6. Configurer les Permissions**
```bash
# Se connecter au serveur
laravel cloud ssh

# Configurer les permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 🔍 **Vérification du Déploiement**

### **1. Test des Endpoints**
```bash
# Test de l'endpoint de santé
curl -X GET "https://votre-app.laravelcloud.com/api/health"

# Test de l'endpoint public
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test"

# Test de l'endpoint des produits
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/products"
```

### **2. Vérification des Logs**
```bash
# Voir les logs en temps réel
laravel cloud logs

# Voir les logs d'erreur
laravel cloud logs --type=error
```

### **3. Monitoring**
```bash
# Voir les métriques de l'application
laravel cloud metrics

# Voir les performances
laravel cloud performance
```

## 🔧 **Configuration Post-Déploiement**

### **1. Mettre à Jour les URLs Frontend**
Mettre à jour les URLs API dans les fichiers frontend :

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';

// boutique-client/src/services/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';

// temp-deploy/src/services/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';
```

### **2. Configurer CORS**
Vérifier que CORS est configuré pour permettre l'accès depuis vos domaines frontend :

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://votre-frontend.com',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### **3. Configurer les Domaines Sanctum**
```bash
laravel cloud env:set SANCTUM_STATEFUL_DOMAINS=votre-frontend.com,localhost:3000,localhost:5173
laravel cloud env:set SESSION_DOMAIN=.votre-domaine.com
```

## 🚨 **Dépannage**

### **1. Erreurs Courantes**

#### **Erreur 500 - Configuration**
```bash
# Vérifier les logs
laravel cloud logs --type=error

# Régénérer la clé d'application
laravel cloud ssh --command="php artisan key:generate"
```

#### **Erreur de Base de Données**
```bash
# Vérifier la connexion
laravel cloud ssh --command="php artisan tinker"
# Test: DB::connection()->getPdo();

# Exécuter les migrations
laravel cloud ssh --command="php artisan migrate --force"
```

#### **Erreur de Permissions**
```bash
# Corriger les permissions
laravel cloud ssh --command="chmod -R 755 storage bootstrap/cache"
laravel cloud ssh --command="chown -R www-data:www-data storage bootstrap/cache"
```

### **2. Commandes Utiles**
```bash
# Redémarrer l'application
laravel cloud restart

# Voir les variables d'environnement
laravel cloud env

# Voir les métriques
laravel cloud metrics

# Se connecter au serveur
laravel cloud ssh

# Voir les logs
laravel cloud logs
```

## 📊 **Monitoring et Maintenance**

### **1. Surveillance Continue**
- ✅ **Logs** : Surveiller les logs d'erreur
- ✅ **Performance** : Vérifier les métriques de performance
- ✅ **Base de données** : Surveiller l'utilisation de la base de données
- ✅ **Stockage** : Surveiller l'utilisation du stockage

### **2. Sauvegardes**
```bash
# Sauvegarder la base de données
laravel cloud ssh --command="php artisan backup:run"

# Sauvegarder les fichiers
laravel cloud ssh --command="tar -czf backup-$(date +%Y%m%d).tar.gz storage/"
```

### **3. Mises à Jour**
```bash
# Mettre à jour l'application
git pull origin main
laravel cloud deploy

# Mettre à jour les dépendances
composer update --no-dev
laravel cloud deploy
```

## 🎉 **Validation Finale**

### **1. Tests de Fonctionnalité**
```bash
# Test des endpoints publics
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test"
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/products"
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/categories"

# Test des endpoints protégés (avec authentification)
curl -X GET "https://votre-app.laravelcloud.com/api/stores" \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### **2. Tests Frontend**
- ✅ **Frontend public** : Vérifier que les produits se chargent
- ✅ **Frontend authentifié** : Vérifier l'authentification
- ✅ **Upload de fichiers** : Tester l'upload vers Cloudflare R2
- ✅ **Paiements** : Tester les intégrations de paiement

### **3. Performance**
- ✅ **Temps de réponse** : < 200ms pour les endpoints publics
- ✅ **Disponibilité** : 99.9% uptime
- ✅ **Erreurs** : < 0.1% de taux d'erreur

**Votre backend Laravel est maintenant déployé et opérationnel sur Laravel Cloud !** 🚀✨
