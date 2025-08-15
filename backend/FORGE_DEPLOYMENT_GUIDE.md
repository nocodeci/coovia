# Guide de Déploiement Laravel Forge

## Prérequis

1. **Compte Laravel Forge** : Créez un compte sur [forge.laravel.com](https://forge.laravel.com)
2. **Serveur VPS** : Ayez un serveur VPS (DigitalOcean, Linode, Vultr, etc.)
3. **Domaine** : Ayez un domaine configuré pour pointer vers votre serveur
4. **Git Repository** : Votre code doit être dans un repository Git (GitHub, GitLab, etc.)

## Étape 1 : Configuration du Serveur sur Forge

### 1.1 Ajouter un nouveau serveur
1. Connectez-vous à Laravel Forge
2. Cliquez sur "Create Server"
3. Choisissez votre provider (DigitalOcean, Linode, etc.)
4. Sélectionnez la région et la taille du serveur
5. Choisissez PHP 8.2 ou supérieur
6. Activez "Install Redis" si nécessaire
7. Cliquez sur "Create Server"

### 1.2 Configuration du domaine
1. Une fois le serveur créé, allez dans "Sites"
2. Cliquez sur "New Site"
3. Entrez votre domaine (ex: `api.coovia.com`)
4. Sélectionnez PHP 8.2
5. Cliquez sur "Add Site"

## Étape 2 : Configuration de la Base de Données

### 2.1 Créer la base de données
1. Dans Forge, allez dans "Databases"
2. Cliquez sur "New Database"
3. Entrez le nom de la base de données (ex: `coovia_production`)
4. Créez un utilisateur avec les permissions appropriées
5. Notez les informations de connexion

### 2.2 Configuration PostgreSQL (si vous utilisez Supabase)
Si vous utilisez Supabase comme base de données, vous pouvez ignorer cette étape et utiliser directement les informations de connexion Supabase.

## Étape 3 : Configuration Git et Déploiement

### 3.1 Connecter le repository Git
1. Dans votre site Forge, allez dans "Git Repository"
2. Entrez l'URL de votre repository Git
3. Sélectionnez la branche (généralement `main` ou `master`)
4. Cliquez sur "Install Repository"

### 3.2 Configuration des variables d'environnement
1. Dans votre site, allez dans "Environment"
2. Copiez le contenu du fichier `production.env` et adaptez-le :

```env
# Application
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.coovia.com

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_DEPRECATIONS_CHANNEL=null

# Database (Supabase PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=[MOT_DE_PASSE_SUPABASE]

# Cache et Sessions
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync

# Filesystem - Cloudflare R2
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY=67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@coovia.com"
MAIL_FROM_NAME="Coovia"

# Frontend URL pour CORS
FRONTEND_URL=https://coovia.com

# Payment Gateways
PAYDUNYA_MASTER_KEY=votre_clé_master
PAYDUNYA_PUBLIC_KEY=votre_clé_publique
PAYDUNYA_PRIVATE_KEY=votre_clé_privée
PAYDUNYA_TOKEN=votre_token

MONEROO_PUBLIC_KEY=votre_clé_publique
MONEROO_SECRET_KEY=votre_clé_secrète
MONEROO_ENVIRONMENT=production

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=coovia.com,www.coovia.com
SESSION_DOMAIN=.coovia.com
```

### 3.3 Premier déploiement
1. Cliquez sur "Deploy Now"
2. Forge va automatiquement :
   - Cloner votre repository
   - Installer les dépendances Composer
   - Exécuter les migrations
   - Optimiser l'application

## Étape 4 : Configuration SSL

### 4.1 Certificat SSL automatique
1. Dans votre site, allez dans "SSL"
2. Cliquez sur "LetsEncrypt"
3. Entrez votre domaine
4. Cliquez sur "Obtain Certificate"

## Étape 5 : Configuration des Scripts de Déploiement

### 5.1 Script de déploiement personnalisé
Dans Forge, vous pouvez personnaliser le script de déploiement :

```bash
cd /home/forge/api.coovia.com
git pull origin main
composer install --no-interaction --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

## Étape 6 : Configuration des Queues (optionnel)

### 6.1 Si vous utilisez des queues
1. Dans Forge, allez dans "Daemons"
2. Créez un nouveau daemon :
   - Command: `php /home/forge/api.coovia.com/artisan queue:work --sleep=3 --tries=3 --max-time=3600`
   - User: `forge`
   - Directory: `/home/forge/api.coovia.com`

## Étape 7 : Monitoring et Logs

### 7.1 Accès aux logs
- Logs d'application : `/home/forge/api.coovia.com/storage/logs/laravel.log`
- Logs Nginx : `/var/log/nginx/`
- Logs PHP-FPM : `/var/log/php8.2-fpm.log`

### 7.2 Monitoring
Forge fournit un monitoring de base. Vous pouvez également configurer :
- New Relic
- Sentry pour les erreurs
- Logs personnalisés

## Étape 8 : Configuration CORS

Assurez-vous que votre configuration CORS dans `config/cors.php` inclut votre domaine frontend :

```php
'allowed_origins' => [
    'https://coovia.com',
    'https://www.coovia.com',
    'http://localhost:3000', // pour le développement
],
```

## Étape 9 : Tests Post-Déploiement

### 9.1 Tests de base
1. Testez l'URL de votre API : `https://api.coovia.com/api/health`
2. Vérifiez les migrations : `php artisan migrate:status`
3. Testez l'upload de fichiers vers Cloudflare R2
4. Testez l'envoi d'emails

### 9.2 Tests de sécurité
1. Vérifiez que `APP_DEBUG=false` en production
2. Testez les routes protégées
3. Vérifiez la configuration SSL

## Dépannage

### Problèmes courants

1. **Erreur 500** : Vérifiez les logs Laravel et Nginx
2. **Problèmes de permissions** : `chmod -R 755 storage bootstrap/cache`
3. **Problèmes de base de données** : Vérifiez les variables d'environnement
4. **Problèmes CORS** : Vérifiez la configuration dans `config/cors.php`

### Commandes utiles
```bash
# Se connecter au serveur
ssh forge@votre-serveur.com

# Vérifier les logs
tail -f /home/forge/api.coovia.com/storage/logs/laravel.log

# Redémarrer les services
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h
```

## Maintenance

### Mises à jour automatiques
Configurez des déploiements automatiques en connectant votre repository Git à Forge.

### Sauvegardes
1. Configurez des sauvegardes automatiques de la base de données
2. Sauvegardez régulièrement les fichiers uploadés
3. Utilisez les snapshots de votre provider VPS

## Support

- Documentation Forge : [forge.laravel.com/docs](https://forge.laravel.com/docs)
- Support Laravel : [laravel.com/docs](https://laravel.com/docs)
- Communauté Laravel : [laracasts.com](https://laracasts.com)
