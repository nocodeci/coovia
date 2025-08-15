# 🎯 SOLUTION FINALE - Erreur 403 Forbidden

## Problème identifié
Laravel Cloud utilise nginx par défaut et ne peut pas servir le contenu du répertoire `/var/www/html/public/`. FrankenPHP se termine immédiatement.

## Solution : Utiliser Apache2 au lieu de FrankenPHP

### 1. Configuration actuelle
Le `Procfile` utilise maintenant Apache2 qui est plus compatible avec Laravel Cloud :
```bash
web: vendor/bin/heroku-php-apache2 public/
```

### 2. Alternatives disponibles
Si Apache2 ne fonctionne pas, essayez ces alternatives :

**Option A : Nginx avec PHP-FPM**
```bash
# Copier cette configuration
cp Procfile.php-fpm Procfile
```

**Option B : Serveur de développement Laravel**
```bash
# Copier cette configuration
cp Procfile.dev Procfile
```

### 3. Variables d'environnement OBLIGATOIRES

Configurez ces variables dans Laravel Cloud Dashboard :

```bash
# Variables essentielles
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-cursor-ozzf9a.laravel.cloud
APP_KEY=base64:VOTRE_CLE_GENEREE

# Base de données
DB_CONNECTION=mysql
DB_HOST=VOTRE_HOST_DB
DB_PORT=3306
DB_DATABASE=VOTRE_DATABASE
DB_USERNAME=VOTRE_USERNAME
DB_PASSWORD=VOTRE_PASSWORD

# Cache et sessions
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Logs
LOG_CHANNEL=stack
LOG_LEVEL=error
```

### 4. Étapes de résolution

1. **Générer une clé d'application :**
   ```bash
   cd backend
   php artisan key:generate
   ```

2. **Tester localement :**
   ```bash
   php test-local.php
   ```

3. **Configurer les variables dans Laravel Cloud**

4. **Redéployer :**
   ```bash
   laravel cloud deploy
   ```

5. **Tester :**
   - `https://coovia-cursor-ozzf9a.laravel.cloud/test`
   - `https://coovia-cursor-ozzf9a.laravel.cloud/`

### 5. Si le problème persiste

**Essayer les alternatives dans l'ordre :**

1. **Apache2 (actuel) :** `web: vendor/bin/heroku-php-apache2 public/`
2. **Nginx + PHP-FPM :** `web: vendor/bin/heroku-php-nginx public/`
3. **Serveur Laravel :** `web: php artisan serve --host=0.0.0.0 --port=$PORT`

### 6. Diagnostic

Utilisez ces scripts de diagnostic :
```bash
# Test local complet
php test-local.php

# Diagnostic nginx
php debug-nginx-issue.php

# Diagnostic général
php debug-deployment.php
```

### 7. Vérifications finales

- ✅ Le fichier `public/index.php` existe
- ✅ Les permissions sont correctes (755)
- ✅ Les variables d'environnement sont configurées
- ✅ La base de données est accessible
- ✅ Le serveur web démarre correctement

### 8. Logs utiles

```bash
# Voir tous les logs
laravel cloud logs

# Voir les logs d'erreur
laravel cloud logs --type=error

# Voir les logs du serveur web
laravel cloud logs --type=web
```

## Résultat attendu

Après avoir configuré les variables d'environnement et redéployé avec Apache2, votre application devrait fonctionner correctement sur Laravel Cloud.

**La clé est d'utiliser un serveur web compatible avec Laravel Cloud plutôt que FrankenPHP.**
