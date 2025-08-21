# Guide de Configuration Forge pour Coovia Backend

## 🚨 Problèmes Identifiés et Solutions

### 1. Erreur npm : package-lock.json manquant
**Solution :** ✅ Ajout d'un `package.json` et génération du `package-lock.json`

### 2. Erreur de migration : Colonne dupliquée
**Solution :** ✅ Migration sécurisée avec vérification d'existence des colonnes

## 🛠️ Configuration Forge

### Script de Déploiement à Utiliser

Dans l'interface Forge, remplacez le script de déploiement par :

```bash
cd /home/forge/default
git pull origin backend-laravel-clean
composer install --no-dev --optimize-autoloader
npm install --production
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl reload php8.2-fpm
```

### Variables d'Environnement Requises

```env
APP_NAME="Coovia Backend"
APP_ENV=production
APP_KEY=base64:VOTRE_CLE_GENEREE
APP_DEBUG=false
APP_URL=https://votre-domaine.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coovia
DB_USERNAME=forge
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

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-audience

# Cloudflare R2 Configuration
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=your-endpoint
R2_REGION=auto
R2_URL=your-public-url
```

## 🔧 Configuration du Serveur

### Permissions des Dossiers

```bash
# Sur le serveur Forge
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

### Services à Vérifier

```bash
# Vérifier le statut des services
sudo systemctl status php8.2-fpm
sudo systemctl status nginx
sudo systemctl status mysql

# Redémarrer si nécessaire
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

## 🚀 Déploiement Manuel

Si le déploiement automatique échoue, utilisez ces commandes manuelles :

```bash
# 1. Aller dans le répertoire du site
cd /home/forge/default

# 2. Pull du code
git fetch origin
git reset --hard origin/backend-laravel-clean

# 3. Installation des dépendances
composer install --no-dev --optimize-autoloader
npm install --production

# 4. Configuration
cp .env.example .env
php artisan key:generate

# 5. Permissions
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache

# 6. Migrations
php artisan migrate --force

# 7. Optimisation
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 8. Redémarrage
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx
```

## 🧪 Tests de Validation

### Test de l'Application

```bash
# Test de la page d'accueil
curl -I https://votre-domaine.com

# Test de l'API
curl -I https://votre-domaine.com/api

# Test de la base de données
php artisan migrate:status

# Test des logs
tail -f storage/logs/laravel.log
```

### Vérification des Services

```bash
# Statut des services
sudo systemctl is-active php8.2-fpm
sudo systemctl is-active nginx
sudo systemctl is-active mysql

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/php8.2-fpm.log
```

## 🆘 Résolution de Problèmes

### Si npm échoue encore

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install --production
```

### Si les migrations échouent

```bash
# Vérifier l'état des migrations
php artisan migrate:status

# Forcer la migration
php artisan migrate --force

# Si problème persiste, rollback
php artisan migrate:rollback --step=1
php artisan migrate
```

### Si l'application ne répond pas

```bash
# Vérifier les logs
tail -f storage/logs/laravel.log

# Vérifier les permissions
ls -la storage/
ls -la bootstrap/cache/

# Redémarrer les services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

## ✅ Checklist de Déploiement

- [ ] Code pullé depuis `backend-laravel-clean`
- [ ] Dépendances Composer installées
- [ ] Dépendances npm installées
- [ ] Fichier `.env` configuré
- [ ] Clé d'application générée
- [ ] Permissions des dossiers correctes
- [ ] Migrations exécutées sans erreur
- [ ] Cache Laravel optimisé
- [ ] Services redémarrés
- [ ] Application accessible via HTTPS
- [ ] API fonctionnelle

## 🎯 Résultat Final

Après application de cette configuration :
- ✅ Déploiement sans erreurs npm
- ✅ Migrations exécutées avec succès
- ✅ Application Laravel fonctionnelle
- ✅ API accessible et opérationnelle
- ✅ Services stables et performants
- ✅ Déploiement automatisé fonctionnel
