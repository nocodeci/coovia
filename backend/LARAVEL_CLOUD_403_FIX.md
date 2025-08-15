# Guide de résolution de l'erreur 403 Forbidden sur Laravel Cloud

## Problème
Vous obtenez une erreur 403 Forbidden avec nginx lors de l'accès à votre application déployée sur Laravel Cloud.

## Causes possibles

### 1. Variables d'environnement manquantes
Les variables d'environnement essentielles ne sont pas configurées dans Laravel Cloud.

### 2. Permissions de fichiers incorrectes
Les dossiers `storage` et `bootstrap/cache` n'ont pas les bonnes permissions.

### 3. Configuration de base de données
La base de données n'est pas configurée ou accessible.

## Solution étape par étape

### Étape 1: Configurer les variables d'environnement

Connectez-vous à votre dashboard Laravel Cloud et configurez ces variables d'environnement :

```bash
# Variables essentielles
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-cursor-ozzf9a.laravel.cloud
APP_KEY=base64:VOTRE_CLE_GENEREE

# Base de données (remplacez par vos vraies valeurs)
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

# CORS et Sanctum
FRONTEND_URL=https://votre-frontend.com
SANCTUM_STATEFUL_DOMAINS=coovia-cursor-ozzf9a.laravel.cloud,votre-frontend.com
SESSION_DOMAIN=.laravel.cloud
```

### Étape 2: Générer une clé d'application

Si vous n'avez pas de clé d'application, générez-en une :

```bash
php artisan key:generate
```

Copiez la clé générée dans la variable `APP_KEY`.

### Étape 3: Vérifier la configuration de la base de données

Assurez-vous que votre base de données est accessible depuis Laravel Cloud. Vérifiez :
- Les informations de connexion
- Les permissions de l'utilisateur de base de données
- La connectivité réseau

### Étape 4: Redéployer l'application

Après avoir configuré les variables d'environnement :

```bash
# Redéployer
laravel cloud deploy
```

### Étape 5: Vérifier les logs

Si le problème persiste, vérifiez les logs :

```bash
# Voir les logs de l'application
laravel cloud logs

# Voir les logs d'erreur spécifiques
laravel cloud logs --type=error
```

## Scripts de diagnostic

Utilisez les scripts créés pour diagnostiquer le problème :

```bash
# Diagnostic complet
php debug-deployment.php

# Correction automatique
php fix-deployment-issues.php
```

## Vérifications supplémentaires

### 1. Vérifier la configuration nginx
Assurez-vous que le fichier `public/index.php` est accessible et que les permissions sont correctes.

### 2. Vérifier les routes
Assurez-vous que vous avez au moins une route définie dans `routes/web.php` :

```php
Route::get('/', function () {
    return 'Application Laravel fonctionnelle!';
});
```

### 3. Vérifier les middlewares
Assurez-vous qu'aucun middleware ne bloque l'accès à votre application.

## Commandes utiles

```bash
# Nettoyer le cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Recréer les liens de stockage
php artisan storage:link

# Vérifier les migrations
php artisan migrate:status

# Tester la connexion à la base de données
php artisan tinker
DB::connection()->getPdo();
```

## Support

Si le problème persiste après avoir suivi ces étapes, vérifiez :
1. Les logs d'erreur détaillés
2. La configuration de votre base de données
3. Les permissions de fichiers sur le serveur
4. La configuration de votre domaine et SSL
