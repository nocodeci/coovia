# 🔧 SOLUTION DÉFINITIVE - Erreur nginx 403

## Problème identifié
```
directory index of "/var/www/html/public/" is forbidden
```

## Cause de l'erreur
Laravel Cloud utilise nginx par défaut, mais la configuration n'est pas adaptée pour servir correctement l'application Laravel. Nginx essaie d'accéder au répertoire `/var/www/html/public/` mais ne trouve pas de fichier `index.php` ou la configuration n'est pas correcte.

## Solution étape par étape

### 1. Configuration nginx (Déjà appliquée)
Le `Procfile` a été modifié pour utiliser nginx :
```bash
web: vendor/bin/heroku-php-nginx public/
```

### 2. Variables d'environnement OBLIGATOIRES

Configurez ces variables dans votre dashboard Laravel Cloud :

```bash
# Variables essentielles
APP_NAME="coovia"
APP_ENV=production
APP_DEBUG=false
APP_URL="https://coovia-cursor-ozzf9a.laravel.cloud"
APP_KEY=base64:z5fiEF5L3AH8th0g1ATxxv5EhgHsOD14V0D7QTe5wdo=

# Logs
LOG_CHANNEL=laravel-cloud-socket
LOG_STDERR_FORMATTER=Monolog\Formatter\JsonFormatter

# Sessions
SESSION_DRIVER=cookie

# Cache et queue
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Base de données (remplacez par vos vraies valeurs)
DB_CONNECTION=mysql
DB_HOST=VOTRE_HOST_DB
DB_PORT=3306
DB_DATABASE=VOTRE_DATABASE
DB_USERNAME=VOTRE_USERNAME
DB_PASSWORD=VOTRE_PASSWORD

# Frontend
VITE_APP_NAME="${APP_NAME}"
```

### 3. Redéployer l'application

```bash
laravel cloud deploy
```

### 4. Vérifier le déploiement

Après le déploiement, vérifiez que :
- Le dossier `public/` existe
- Le fichier `public/index.php` existe
- Les permissions sont correctes (755 pour les dossiers, 644 pour les fichiers)

### 5. Tester l'application

Testez ces URLs :
- `https://coovia-cursor-ozzf9a.laravel.cloud/test`
- `https://coovia-cursor-ozzf9a.laravel.cloud/`

## Diagnostic si le problème persiste

### Exécuter le diagnostic
```bash
php debug-nginx-403.php
```

### Vérifier les logs
```bash
# Logs complets
laravel cloud logs

# Logs nginx spécifiques
laravel cloud logs --type=nginx

# Logs d'erreur
laravel cloud logs --type=error
```

### Vérifier la structure de déploiement
```bash
laravel cloud ssh
ls -la /var/www/html/
ls -la /var/www/html/public/
cat /var/www/html/public/index.php
```

## Solutions alternatives si nginx ne fonctionne pas

### Option 1 : Serveur Laravel standard
```bash
echo "web: php artisan serve --host=0.0.0.0 --port=\$PORT" > Procfile
git add Procfile
git commit -m "Essai serveur Laravel standard"
git push
```

### Option 2 : Apache2
```bash
echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile
git add Procfile
git commit -m "Essai Apache2"
git push
```

## Vérifications spécifiques

### 1. Structure des fichiers
- ✅ Le dossier `public/` existe
- ✅ Le fichier `public/index.php` existe
- ✅ Les permissions sont correctes

### 2. Configuration Laravel
- ✅ Le fichier `.env` est copié correctement
- ✅ Les variables d'environnement sont définies
- ✅ La base de données est accessible

### 3. Serveur web
- ✅ nginx démarre correctement
- ✅ PHP-FPM fonctionne
- ✅ Les logs nginx ne montrent pas d'erreurs de permissions

## Logs utiles pour le diagnostic

```bash
# Voir tous les logs
laravel cloud logs

# Voir les logs nginx
laravel cloud logs --type=nginx

# Voir les logs d'erreur
laravel cloud logs --type=error

# Voir les logs du serveur web
laravel cloud logs --type=web
```

## Résultat attendu

Après avoir configuré nginx et toutes les variables d'environnement, votre application Laravel devrait fonctionner correctement sur Laravel Cloud.

**La configuration nginx devrait résoudre l'erreur 403 !** 🚀
