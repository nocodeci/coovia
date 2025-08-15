# Résolution du problème nginx/FrankenPHP sur Laravel Cloud

## Problème identifié
```
directory index of "/var/www/html/public/" is forbidden
```

## Cause
Laravel Cloud utilise nginx comme proxy inverse, mais la configuration n'est pas adaptée pour Laravel Octane avec FrankenPHP.

## Solutions

### Solution 1: Configuration nginx personnalisée (Recommandée)

1. **Utiliser le fichier nginx.conf créé**
   - Le fichier `nginx.conf` contient la configuration appropriée
   - Il configure nginx pour proxy vers FrankenPHP sur le port 9000

2. **Modifier le Procfile**
   ```bash
   web: php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=9000
   ```

3. **Variables d'environnement requises**
   ```bash
   APP_NAME=Coovia
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://coovia-cursor-ozzf9a.laravel.cloud
   APP_KEY=base64:VOTRE_CLE_GENEREE
   
   # Base de données
   DB_CONNECTION=mysql
   DB_HOST=VOTRE_HOST
   DB_PORT=3306
   DB_DATABASE=VOTRE_DB
   DB_USERNAME=VOTRE_USER
   DB_PASSWORD=VOTRE_PASSWORD
   
   # Cache
   CACHE_DRIVER=file
   SESSION_DRIVER=file
   QUEUE_CONNECTION=sync
   ```

### Solution 2: Configuration simple (Alternative)

Si la solution 1 ne fonctionne pas, utilisez la configuration simple :

1. **Utiliser Procfile.simple**
   ```bash
   cp Procfile.simple Procfile
   ```

2. **Cette configuration utilise directement FrankenPHP sans nginx**

### Solution 3: Script de démarrage personnalisé

Utilisez le script `start-server.sh` qui :
- Configure automatiquement l'environnement
- Corrige les permissions
- Démarre FrankenPHP correctement

## Étapes de déploiement

1. **Choisir une solution** (1, 2 ou 3)
2. **Configurer les variables d'environnement** dans Laravel Cloud
3. **Redéployer** l'application
4. **Tester** l'URL `/test`

## Vérification

Après le déploiement, testez :
- `https://coovia-cursor-ozzf9a.laravel.cloud/test`
- `https://coovia-cursor-ozzf9a.laravel.cloud/`

## Logs utiles

```bash
# Voir les logs nginx
laravel cloud logs --type=nginx

# Voir les logs de l'application
laravel cloud logs --type=app

# Voir tous les logs
laravel cloud logs
```

## Dépannage

Si le problème persiste :

1. **Vérifier les logs** pour des erreurs spécifiques
2. **Tester la connexion à la base de données**
3. **Vérifier les permissions** des dossiers storage et bootstrap/cache
4. **Utiliser le script de diagnostic** : `php debug-deployment.php`
