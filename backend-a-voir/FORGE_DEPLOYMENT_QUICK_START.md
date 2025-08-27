# 🚀 Déploiement Forge - Guide Rapide

## 📋 Prérequis

- ✅ Compte Forge créé sur [forge.laravel.com](https://forge.laravel.com)
- ✅ Serveur VPS acheté (DigitalOcean, Linode, etc.)
- ✅ Domaine configuré (ex: `api.coovia.com`)
- ✅ Repository Git accessible

## 🎯 Étapes de déploiement

### 1. Créer le serveur dans Forge

1. Connectez-vous à [forge.laravel.com](https://forge.laravel.com)
2. Cliquez sur "Create Server"
3. Choisissez votre provider (DigitalOcean recommandé)
4. Sélectionnez PHP 8.2
5. Choisissez un plan avec 2GB RAM minimum
6. Attendez que le serveur soit créé (5-10 minutes)

### 2. Créer le site

1. Dans votre serveur, cliquez sur "New Site"
2. Nom du site : `api.coovia.com`
3. Répertoire : `/home/forge/api.coovia.com`
4. PHP version : 8.2

### 3. Configurer Git

1. Dans votre site, allez dans "Git Repository"
2. URL : `https://github.com/votre-username/coovia.git`
3. Branche : `main`
4. Répertoire : `backend`
5. Cliquez sur "Install Repository"

### 4. Variables d'environnement

Dans "Environment Variables", ajoutez :

```env
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.coovia.com

# Database (Supabase)
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=[VOTRE_MOT_DE_PASSE_SUPABASE]

# Cloudflare R2
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=votre_clé_access
CLOUDFLARE_R2_SECRET_ACCESS_KEY=votre_clé_secret
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.xxxxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com

# Frontend URL
FRONTEND_URL=https://coovia.com

# Payment Gateways
PAYDUNYA_MASTER_KEY=votre_clé
MONEROO_PUBLIC_KEY=votre_clé
```

### 5. Script de déploiement

Dans "Deployment Script", copiez le contenu de `forge-deploy-script.sh`

### 6. Configuration Nginx

Dans "Files" > "Edit Nginx Configuration", copiez le contenu de `nginx-forge-simple.conf`

### 7. Premier déploiement

1. Cliquez sur "Deploy Now"
2. Attendez que le déploiement se termine
3. Vérifiez les logs de déploiement

### 8. Configuration SSL

1. Cliquez sur "SSL"
2. Cliquez sur "LetsEncrypt"
3. Domaine : `api.coovia.com`
4. Cliquez sur "Obtain Certificate"

### 9. Configuration des daemons

Dans "Daemons", ajoutez :

**Queue Worker :**
- Command : `php /home/forge/api.coovia.com/artisan queue:work --sleep=3 --tries=3 --max-time=3600`
- User : `forge`

**Schedule Runner :**
- Command : `php /home/forge/api.coovia.com/artisan schedule:run`
- User : `forge`

### 10. Tests post-déploiement

Exécutez le script de test :

```bash
chmod +x test-forge-deployment.sh
./test-forge-deployment.sh
```

## 🔧 Commandes utiles

### Via SSH (Forge)
```bash
# Se connecter au serveur
forge ssh

# Aller dans le répertoire du site
cd /home/forge/api.coovia.com

# Vérifier les logs
tail -f storage/logs/laravel.log

# Vérifier les migrations
php artisan migrate:status

# Nettoyer les caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Via Forge CLI
```bash
# Installer Forge CLI
composer global require laravel/forge-cli

# Authentification
forge login

# Lister les serveurs
forge server:list

# Basculer vers un serveur
forge server:switch <nom-du-serveur>

# Déployer
forge deploy <nom-du-site>

# Voir les logs
forge site:logs <nom-du-site>
```

## 🚨 Dépannage

### Erreur 500
```bash
# Vérifier les logs
tail -f storage/logs/laravel.log

# Vérifier les permissions
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

### Problème de base de données
```bash
# Vérifier la connexion
php artisan migrate:status

# Vérifier les variables d'environnement
grep DB_ .env
```

### Problème CORS
```bash
# Vérifier la configuration
cat config/cors.php

# Vérifier FRONTEND_URL
grep FRONTEND_URL .env
```

## 📊 Monitoring

### Vérifications régulières
- ✅ Site accessible : `curl -I https://api.coovia.com`
- ✅ API fonctionnelle : `curl -I https://api.coovia.com/api`
- ✅ Base de données : `php artisan migrate:status`
- ✅ Logs d'erreur : `tail -n 50 storage/logs/laravel.log`

### Métriques importantes
- Temps de réponse < 1 seconde
- Utilisation mémoire < 80%
- Espace disque < 80%
- Erreurs dans les logs = 0

## 💰 Coûts estimés

- **Serveur VPS** : $12-24/mois (2-4GB RAM)
- **Forge** : $12/mois
- **Domaine** : $10-15/an
- **Total** : $25-50/mois

## 🎉 Félicitations !

Votre backend Laravel est maintenant déployé sur Forge ! 

**Prochaines étapes :**
1. Tester toutes les fonctionnalités de votre API
2. Configurer les sauvegardes automatiques
3. Mettre en place le monitoring
4. Configurer les alertes en cas de problème

---

**📞 Besoin d'aide ?** Consultez la documentation complète dans `README_FORGE_DEPLOYMENT.md`
