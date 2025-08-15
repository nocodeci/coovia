# Guide de Déploiement Laravel Cloud - Monorepo

## 🎯 Vue d'ensemble

Ce guide vous explique comment déployer votre application Laravel depuis un monorepo sur Laravel Cloud en utilisant un script de construction personnalisé.

## 📋 Prérequis

1. **Compte Laravel Cloud** : Abonnez-vous sur [cloud.laravel.com](https://cloud.laravel.com)
2. **Repository Git** : Votre monorepo doit être sur GitHub/GitLab
3. **Laravel Cloud CLI** : Installez l'outil de ligne de commande

## 🚀 Configuration du Monorepo

### Étape 1: Fichiers à la racine

Nous avons déjà créé les fichiers nécessaires à la racine du repository :

- ✅ `composer.json` (copié depuis `backend/`)
- ✅ `composer.lock` (copié depuis `backend/`)
- ✅ `laravel-cloud-build.sh` (script de construction)
- ✅ `laravel-cloud-config.json` (configuration)

### Étape 2: Vérification de la structure

```bash
# À la racine du repository
ls -la composer.* laravel-cloud-*
```

## 🔧 Configuration Laravel Cloud

### Étape 1: Créer un nouveau projet

1. Connectez-vous à [cloud.laravel.com](https://cloud.laravel.com)
2. Cliquez sur "New Project"
3. Sélectionnez "Git Repository"
4. Choisissez votre repository `coovia`
5. Sélectionnez la branche (ex: `main` ou `cursor`)

### Étape 2: Configuration de l'environnement

Dans l'interface Laravel Cloud :

1. **Nom du projet** : `coovia-backend`
2. **PHP Version** : `8.3`
3. **Script de construction** : `./laravel-cloud-build.sh`

### Étape 3: Variables d'environnement

Configurez les variables suivantes dans Laravel Cloud :

```env
# Application
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.laravel.cloud
APP_KEY=base64:votre_clé_32_caractères

# Base de données (Supabase PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_supabase

# Cloudflare R2 (Stockage de fichiers)
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY=67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com

# Cache et Sessions
CACHE_DRIVER=redis
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
QUEUE_CONNECTION=sqs

# Email
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@coovia.com
MAIL_FROM_NAME=Coovia

# Frontend URL pour CORS
FRONTEND_URL=https://votre-frontend.com
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com
SESSION_DOMAIN=.laravel.cloud
```

## 🔄 Déploiement

### Étape 1: Générer la clé d'application

```bash
cd backend
php artisan key:generate --show
```

Copiez la clé générée dans la variable `APP_KEY` sur Laravel Cloud.

### Étape 2: Déployer

1. Dans Laravel Cloud, cliquez sur "Deploy"
2. Le script `laravel-cloud-build.sh` s'exécutera automatiquement
3. Surveillez les logs de construction

### Étape 3: Vérification

Après le déploiement, vérifiez :

- ✅ L'application répond sur l'URL fournie
- ✅ Les migrations ont été exécutées
- ✅ Les caches sont optimisés
- ✅ Les fichiers sont accessibles via Cloudflare R2

## 🛠️ Script de Construction Détail

Le script `laravel-cloud-build.sh` effectue les opérations suivantes :

1. **Déplacement des sous-répertoires** : Isole le dossier `backend`
2. **Restructuration** : Place l'application Laravel à la racine
3. **Installation des dépendances** : `composer install --no-dev`
4. **Optimisation Laravel** : Cache des configurations, routes, vues
5. **Migrations** : `php artisan migrate --force`

## 🔍 Dépannage

### Problème : "composer.lock not found"

**Solution** : Vérifiez que le fichier `composer.lock` est bien à la racine du repository.

### Problème : "Laravel Artisan not found"

**Solution** : Le script n'a pas correctement déplacé le dossier `backend`. Vérifiez les logs de construction.

### Problème : Erreurs de migration

**Solution** : Vérifiez les variables d'environnement de base de données.

### Problème : Erreurs de permissions

**Solution** : Le script utilise des chemins temporaires qui devraient être accessibles.

## 📊 Monitoring

Une fois déployé, vous pouvez :

- **Voir les logs** : Dans l'interface Laravel Cloud
- **Surveiller les performances** : Métriques intégrées
- **Gérer les variables d'environnement** : Interface web
- **Redéployer** : Automatique ou manuel

## 🔄 Mises à jour

Pour mettre à jour votre application :

1. Poussez vos changements sur Git
2. Laravel Cloud détectera automatiquement les changements
3. Le script de construction s'exécutera à nouveau
4. L'application sera mise à jour

## ⚠️ Notes importantes

- **Support non officiel** : Cette solution n'est pas officiellement supportée par Laravel Cloud
- **Risques** : L'assistance pourrait ne pas pouvoir vous aider avec cette configuration
- **Test** : Testez toujours en environnement de développement avant la production
- **Backup** : Gardez une copie de votre configuration

## 🎉 Félicitations !

Votre application Laravel est maintenant déployée depuis votre monorepo sur Laravel Cloud !
