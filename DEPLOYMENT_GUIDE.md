# Guide de Déploiement Laravel sur Render

## 📋 Prérequis

1. Compte Render.com
2. Base de données PostgreSQL (gratuite sur Render)
3. Variables d'environnement configurées

## 🚀 Étapes de Déploiement

### 1. Créer une Base de Données PostgreSQL

1. Allez sur [Render.com](https://render.com)
2. Cliquez sur "New" → "PostgreSQL"
3. Configurez :
   - **Name**: `coovia-database`
   - **Database**: `coovia_db`
   - **User**: `coovia_user`
   - **Plan**: Free

### 2. Créer le Service Web

1. Cliquez sur "New" → "Web Service"
2. Connectez votre repository GitHub
3. Sélectionnez le dossier `backend`
4. Configurez :
   - **Name**: `coovia-backend`
   - **Environment**: `PHP`
   - **Build Command**: 
     ```bash
     composer install --no-dev --optimize-autoloader
     php artisan config:cache
     php artisan route:cache
     php artisan view:cache
     ```
   - **Start Command**: 
     ```bash
     php artisan migrate --force
     vendor/bin/heroku-php-apache2 public/
     ```

### 3. Configurer les Variables d'Environnement

Dans les paramètres du service web, ajoutez ces variables :

#### Variables Requises
```
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_KEY=[généré automatiquement]
APP_URL=https://votre-app.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=[host de votre DB PostgreSQL]
DB_PORT=5432
DB_DATABASE=coovia_db
DB_USERNAME=coovia_user
DB_PASSWORD=[mot de passe de votre DB]

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

FRONTEND_URL=https://votre-frontend.com
```

#### Variables de Paiement (optionnelles)
```
PAYDUNYA_MASTER_KEY=votre_clé_master
PAYDUNYA_PUBLIC_KEY=votre_clé_publique
PAYDUNYA_PRIVATE_KEY=votre_clé_privée
PAYDUNYA_TOKEN=votre_token

MONEROO_PUBLIC_KEY=votre_clé_publique
MONEROO_SECRET_KEY=votre_clé_secrète
MONEROO_ENVIRONMENT=production
```

### 4. Déployer

1. Cliquez sur "Create Web Service"
2. Render va automatiquement :
   - Cloner votre repository
   - Installer les dépendances
   - Exécuter les migrations
   - Démarrer le service

## 🔧 Configuration Post-Déploiement

### Générer la Clé d'Application
```bash
php artisan key:generate
```

### Exécuter les Migrations
```bash
php artisan migrate --force
```

### Optimiser l'Application
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📊 Monitoring

- **Logs**: Disponibles dans l'interface Render
- **Métriques**: CPU, mémoire, requêtes
- **Health Checks**: Automatiques

## 🔒 Sécurité

- HTTPS automatique
- Variables d'environnement sécurisées
- Pas d'accès SSH (service managé)

## 🚨 Dépannage

### Erreurs Courantes

1. **APP_KEY manquante**
   - Générer avec `php artisan key:generate`

2. **Erreurs de base de données**
   - Vérifier les variables DB_*
   - Tester la connexion

3. **Erreurs de permissions**
   - Vérifier les dossiers storage/ et bootstrap/cache/

### Logs
```bash
# Voir les logs en temps réel
tail -f storage/logs/laravel.log
```

## 📞 Support

- Documentation Render : https://render.com/docs
- Support Laravel : https://laravel.com/docs
