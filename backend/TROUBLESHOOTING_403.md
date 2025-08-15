# 🔧 DÉPANNAGE - Erreur 403 Persistante

## Problème
```
directory index of "/var/www/html/public/" is forbidden
```

## Analyse du problème

Le problème persiste malgré les changements de configuration. Cela indique que :

1. **Laravel Cloud utilise sa propre configuration nginx** qui ne peut pas être facilement modifiée
2. **Le fichier index.php existe** mais nginx ne peut pas l'accéder
3. **Les permissions ou la structure de déploiement** ne sont pas correctes

## Solutions à essayer dans l'ordre

### Solution 1: Vérification complète du déploiement

1. **Exécuter le script de vérification :**
   ```bash
   php verify-deployment.php
   ```

2. **Vérifier que tous les fichiers sont présents et accessibles**

### Solution 2: Configuration Laravel Cloud native

Utiliser la configuration Laravel Cloud par défaut sans personnalisation :

1. **Supprimer les fichiers de configuration personnalisés :**
   ```bash
   rm .laravel-cloud/nginx.conf
   rm frankenphp.conf
   ```

2. **Utiliser le Procfile le plus simple :**
   ```bash
   echo "web: vendor/bin/heroku-php-apache2 public/" > Procfile
   ```

3. **Redéployer :**
   ```bash
   laravel cloud deploy
   ```

### Solution 3: Configuration alternative

Si Apache2 ne fonctionne pas, essayer Nginx :

```bash
echo "web: vendor/bin/heroku-php-nginx public/" > Procfile
git add Procfile
git commit -m "Essai configuration Nginx"
git push
```

### Solution 4: Serveur de développement

Si les serveurs web ne fonctionnent pas, utiliser le serveur Laravel :

```bash
echo "web: php artisan serve --host=0.0.0.0 --port=\$PORT" > Procfile
git add Procfile
git commit -m "Essai serveur Laravel"
git push
```

### Solution 5: Vérification des variables d'environnement

**Variables CRITIQUES à configurer dans Laravel Cloud :**

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

### Solution 6: Diagnostic avancé

1. **Vérifier les logs détaillés :**
   ```bash
   laravel cloud logs --type=error
   laravel cloud logs --type=nginx
   laravel cloud logs --type=web
   ```

2. **Vérifier la structure de déploiement :**
   ```bash
   laravel cloud ssh
   ls -la /var/www/html/
   ls -la /var/www/html/public/
   ```

3. **Tester manuellement :**
   ```bash
   laravel cloud ssh
   cd /var/www/html
   php -S localhost:8000 -t public/
   ```

## Vérifications spécifiques

### 1. Structure des fichiers
- ✅ Le dossier `public/` existe
- ✅ Le fichier `public/index.php` existe
- ✅ Les permissions sont correctes (755 pour les dossiers, 644 pour les fichiers)

### 2. Configuration Laravel
- ✅ Le fichier `.env` est copié correctement
- ✅ Les variables d'environnement sont définies
- ✅ La base de données est accessible

### 3. Serveur web
- ✅ Le serveur web démarre correctement
- ✅ PHP-FPM fonctionne
- ✅ Les logs nginx ne montrent pas d'erreurs de permissions

## Actions recommandées

1. **Exécuter le diagnostic complet :**
   ```bash
   php verify-deployment.php
   ```

2. **Configurer toutes les variables d'environnement**

3. **Essayer les configurations dans l'ordre :**
   - Apache2 (actuel)
   - Nginx + PHP-FPM
   - Serveur Laravel

4. **Vérifier les logs après chaque tentative**

5. **Si rien ne fonctionne, contacter le support Laravel Cloud**

## Logs utiles

```bash
# Logs complets
laravel cloud logs

# Logs d'erreur uniquement
laravel cloud logs --type=error

# Logs nginx
laravel cloud logs --type=nginx

# Logs du serveur web
laravel cloud logs --type=web
```

## Support

Si aucune solution ne fonctionne :
1. Vérifiez la documentation Laravel Cloud
2. Consultez les forums Laravel
3. Contactez le support Laravel Cloud
4. Considérez une migration vers une autre plateforme (Heroku, DigitalOcean, etc.)
