# 🚀 Guide de Déploiement Laravel Cloud - Coovia API

## 📋 Prérequis

### 1. Compte Laravel Cloud
- Créez un compte sur [Laravel Cloud](https://cloud.laravel.com)
- Vérifiez votre abonnement (gratuit ou payant)

### 2. Configuration du Projet
Le projet est déjà configuré avec :
- ✅ Configuration Laravel Cloud (`.laravel-cloud/project.yaml`)
- ✅ Structure Laravel complète
- ✅ Migrations de base de données
- ✅ Optimisations de production

## 🔧 Installation de Laravel Cloud CLI

### Option 1: Installation via Docker (Recommandée)
```bash
# Démarrer Docker Desktop
# Puis exécuter :
curl -s "https://laravel.build/cloud-cli" | bash
```

### Option 2: Installation manuelle
```bash
# Créer le répertoire bin
mkdir -p ~/.local/bin

# Télécharger Laravel Cloud CLI
curl -L https://github.com/laravel/cloud-cli/releases/latest/download/laravel-cloud-cli-darwin-amd64 -o ~/.local/bin/laravel-cloud

# Rendre exécutable
chmod +x ~/.local/bin/laravel-cloud

# Ajouter au PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Option 3: Via le site officiel
- Visitez [Laravel Cloud CLI](https://cloud.laravel.com/docs/cli)
- Suivez les instructions d'installation

## 🔐 Authentification

```bash
# Se connecter à Laravel Cloud
laravel-cloud login

# Vérifier la connexion
laravel-cloud whoami
```

## 📦 Préparation du Déploiement

### 1. Vérifier les variables d'environnement
```bash
# Vérifier que .env contient les variables critiques
cat .env | grep -E "^(APP_KEY|APP_NAME|APP_ENV|DB_|REDIS_)"
```

### 2. Générer la clé d'application
```bash
php artisan key:generate
```

### 3. Optimiser pour la production
```bash
# Nettoyer le cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimiser
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Vérifier les permissions
chmod -R 755 storage bootstrap/cache
```

## 🚀 Déploiement

### Option 1: Déploiement via CLI
```bash
# Déployer vers l'environnement par défaut
laravel-cloud deploy

# Déployer vers un environnement spécifique
laravel-cloud deploy production

# Déployer avec des variables d'environnement
laravel-cloud deploy --env production
```

### Option 2: Déploiement via Git (Recommandé)
```bash
# Utiliser le script automatisé
chmod +x deploy-laravel-cloud-git.sh
./deploy-laravel-cloud-git.sh
```

### Option 3: Déploiement manuel
```bash
# Commiter les changements
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Pousser vers le dépôt distant
git push origin main

# Le déploiement se déclenche automatiquement sur Laravel Cloud
```

## 📊 Surveillance et Logs

### Vérifier le statut
```bash
# Statut de l'application
laravel-cloud status

# Liste des déploiements
laravel-cloud deployments

# Logs en temps réel
laravel-cloud logs

# Logs d'un déploiement spécifique
laravel-cloud logs --deployment=latest
```

### Surveillance via Dashboard
- Connectez-vous à [Laravel Cloud Dashboard](https://cloud.laravel.com)
- Sélectionnez votre projet `coovia-api`
- Surveillez les métriques en temps réel

## 🔧 Configuration de l'Environnement

### Variables d'environnement critiques
```env
APP_NAME=Coovia API
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-app-key-here

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Services configurés
- ✅ **MySQL**: Base de données principale
- ✅ **Redis**: Cache et sessions
- ✅ **Storage**: Stockage de fichiers

## 🎯 Configuration Actuelle

```yaml
# .laravel-cloud/project.yaml
name: coovia-api
type: laravel
framework: laravel
php: 8.2

environments:
  production:
    variables:
      APP_ENV: production
      APP_DEBUG: false
      LOG_LEVEL: error
      CACHE_DRIVER: file
      SESSION_DRIVER: file
      QUEUE_CONNECTION: sync
      FILESYSTEM_DISK: local
    databases:
      - mysql
    services:
      - redis
    resources:
      memory: 512
      cpu: 0.5
      storage: 10
```

## 🔍 Dépannage

### Problèmes courants

#### 1. Erreur de permissions
```bash
# Vérifier les permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 2. Erreur de base de données
```bash
# Vérifier la connexion
php artisan migrate:status

# Exécuter les migrations
php artisan migrate --force
```

#### 3. Erreur de cache
```bash
# Nettoyer tous les caches
php artisan optimize:clear
```

#### 4. Erreur de stockage
```bash
# Recréer le lien de stockage
php artisan storage:link
```

### Logs utiles
```bash
# Logs d'application
laravel-cloud logs --type=application

# Logs de déploiement
laravel-cloud logs --type=deployment

# Logs d'erreurs
laravel-cloud logs --type=error
```

## 📞 Support

### Ressources utiles
- 📚 [Documentation Laravel Cloud](https://cloud.laravel.com/docs)
- 🆘 [Support Laravel Cloud](https://cloud.laravel.com/support)
- 💬 [Communauté Laravel](https://laravel.com/community)

### Contact
- Email: support@laravel.com
- Discord: [Laravel Discord](https://discord.gg/laravel)

## ✅ Checklist de Déploiement

- [ ] Compte Laravel Cloud créé
- [ ] Laravel Cloud CLI installé
- [ ] Authentification réussie
- [ ] Variables d'environnement configurées
- [ ] APP_KEY générée
- [ ] Optimisations de production appliquées
- [ ] Permissions correctes
- [ ] Migrations à jour
- [ ] Tests passés
- [ ] Déploiement initié
- [ ] Application accessible
- [ ] Logs surveillés

## 🎉 Déploiement Réussi !

Une fois le déploiement terminé, votre application sera accessible via l'URL fournie par Laravel Cloud.

**URL de production**: `https://coovia-api.laravel.cloud`

**Dashboard**: [Laravel Cloud Dashboard](https://cloud.laravel.com)
