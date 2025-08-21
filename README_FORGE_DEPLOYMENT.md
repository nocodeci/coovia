# 🚀 Déploiement Laravel Forge - Guide Complet

## 📋 Vue d'ensemble

Ce dossier contient tous les scripts et guides nécessaires pour déployer votre backend Laravel sur Laravel Forge, avec deux approches :

1. **Interface Web** : Configuration manuelle via forge.laravel.com
2. **CLI** : Déploiement automatisé via Forge CLI

## 📁 Fichiers disponibles

### 🎯 Scripts principaux

| Fichier | Description | Usage |
|---------|-------------|-------|
| `setup-forge-cli.sh` | Configuration initiale Forge CLI | `./setup-forge-cli.sh` |
| `forge-cli-deploy.sh` | Déploiement via CLI Forge | `./forge-cli-deploy.sh` |
| `deploy-to-forge.sh` | Déploiement complet sur serveur | `./deploy-to-forge.sh` |

### 🔧 Scripts de configuration

| Fichier | Description | Usage |
|---------|-------------|-------|
| `forge-deploy.sh` | Script de déploiement personnalisé | Copier dans Forge |
| `nginx-forge.conf` | Configuration Nginx optimisée | Copier dans Forge |
| `forge-daemons.json` | Configuration des daemons | Référence pour Forge |

### 🏥 Scripts de maintenance

| Fichier | Description | Usage |
|---------|-------------|-------|
| `forge-health-check.sh` | Vérification de santé | `./forge-health-check.sh` |
| `forge-backup-config.sh` | Configuration des sauvegardes | `./forge-backup-config.sh` |

### 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `FORGE_DEPLOYMENT_GUIDE.md` | Guide complet (interface web) |
| `FORGE_CLI_QUICK_START.md` | Guide rapide CLI |
| `README_FORGE_DEPLOYMENT.md` | Ce fichier |

## 🚀 Démarrage rapide

### Option 1 : Interface Web (Recommandé pour débutants)

```bash
# 1. Lire le guide complet
cat FORGE_DEPLOYMENT_GUIDE.md

# 2. Suivre les étapes dans l'interface web
# 3. Utiliser les scripts de maintenance
./forge-health-check.sh
./forge-backup-config.sh
```

### Option 2 : CLI (Recommandé pour développeurs)

```bash
# 1. Configuration initiale
./setup-forge-cli.sh

# 2. Déploiement automatisé
./forge-cli-deploy.sh
```

## 📋 Workflow de déploiement

### Phase 1 : Préparation

1. **Créer un compte Forge** sur [forge.laravel.com](https://forge.laravel.com)
2. **Acheter un serveur VPS** (DigitalOcean, Linode, etc.)
3. **Avoir un domaine** configuré

### Phase 2 : Configuration

#### Via Interface Web
1. Créer le serveur dans Forge
2. Créer le site avec votre domaine
3. Configurer le repository Git
4. Configurer les variables d'environnement

#### Via CLI
```bash
./setup-forge-cli.sh
```

### Phase 3 : Déploiement

#### Via Interface Web
1. Cliquer sur "Deploy Now" dans Forge
2. Utiliser les scripts de maintenance

#### Via CLI
```bash
./forge-cli-deploy.sh
```

### Phase 4 : Post-déploiement

1. **Configurer SSL** avec Let's Encrypt
2. **Configurer les daemons** (queues)
3. **Configurer les sauvegardes**
4. **Tester l'application**

## 🔧 Configuration requise

### Variables d'environnement critiques

```env
# Application
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
DB_PASSWORD=[MOT_DE_PASSE_SUPABASE]

# Cloudflare R2
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=your_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=your_r2_url
CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint

# Frontend URL
FRONTEND_URL=https://coovia.com

# Payment Gateways
PAYDUNYA_MASTER_KEY=your_key
MONEROO_PUBLIC_KEY=your_key
```

### Prérequis serveur

- **PHP** : 8.2 ou supérieur
- **RAM** : 1GB minimum, 2GB recommandé
- **Stockage** : 20GB minimum
- **Provider** : DigitalOcean, Linode, Vultr, AWS

## 🛠️ Commandes utiles

### Forge CLI

```bash
# Authentification
forge login

# Lister les serveurs
forge server:list

# Basculer vers un serveur
forge server:switch <nom-du-serveur>

# Lister les sites
forge site:list

# Déployer un site
forge deploy <nom-du-site>

# Voir les logs
forge site:logs <nom-du-site>
forge deploy:logs <nom-du-site>

# Ouvrir dans Forge
forge open <nom-du-site>

# Se connecter en SSH
forge ssh

# Télécharger/Uploader .env
forge env:pull <nom-du-site>
forge env:push <nom-du-site>
```

### Maintenance

```bash
# Vérification de santé
./forge-health-check.sh

# Configuration des sauvegardes
./forge-backup-config.sh

# Test des sauvegardes
cd /home/forge/backups && ./test-backup.sh
```

## 🚨 Dépannage

### Problèmes courants

#### 1. Erreur 500
```bash
# Vérifier les logs
forge site:logs <nom-du-site>
forge php:logs

# Vérifier les permissions
chmod -R 755 storage bootstrap/cache
```

#### 2. Problème de base de données
```bash
# Vérifier la connexion
php artisan migrate:status

# Vérifier les variables d'environnement
forge env:pull <nom-du-site>
```

#### 3. Problème CORS
```bash
# Vérifier la configuration
cat config/cors.php

# Vérifier les variables d'environnement
grep FRONTEND_URL .env
```

#### 4. Problème d'upload
```bash
# Vérifier Cloudflare R2
php artisan tinker
Storage::disk('r2')->put('test.txt', 'test');
```

### Logs importants

- **Application** : `/home/forge/api.coovia.com/storage/logs/laravel.log`
- **Nginx** : `/var/log/nginx/`
- **PHP-FPM** : `/var/log/php8.2-fpm.log`
- **Déploiement** : Via `forge deploy:logs <nom-du-site>`

## 📊 Monitoring

### Vérification automatique

```bash
# Script de santé complet
./forge-health-check.sh

# Vérification manuelle
curl -I https://api.coovia.com/health
curl -I https://api.coovia.com/api
```

### Métriques à surveiller

- **Temps de réponse** : < 1 seconde
- **Utilisation mémoire** : < 80%
- **Espace disque** : < 80%
- **Erreurs** : 0 dans les logs récents

## 🔒 Sécurité

### Configuration recommandée

1. **SSL** : Let's Encrypt automatique
2. **Firewall** : UFW activé
3. **Permissions** : 755 pour storage/cache
4. **Variables sensibles** : Dans .env uniquement
5. **Debug** : Désactivé en production

### Vérifications de sécurité

```bash
# Vérifier SSL
curl -I https://api.coovia.com

# Vérifier les permissions
ls -la storage bootstrap/cache

# Vérifier les variables sensibles
grep -E "(APP_DEBUG|APP_ENV)" .env
```

## 💰 Coûts estimés

### Serveur VPS
- **DigitalOcean** : $12-24/mois (2-4GB RAM)
- **Linode** : $10-20/mois (2-4GB RAM)
- **Vultr** : $10-20/mois (2-4GB RAM)

### Forge
- **Forge** : $12/mois (1 serveur)
- **Domaine** : $10-15/an

### Total estimé : $25-50/mois

## 📞 Support

### Ressources officielles
- **Documentation Forge** : [forge.laravel.com/docs](https://forge.laravel.com/docs)
- **CLI Forge** : [github.com/laravel/forge-cli](https://github.com/laravel/forge-cli)
- **Support Laravel** : [laravel.com/docs](https://laravel.com/docs)

### Communauté
- **Laracasts** : [laracasts.com](https://laracasts.com)
- **Stack Overflow** : Tag `laravel-forge`
- **Discord Laravel** : [discord.gg/laravel](https://discord.gg/laravel)

## 🎯 Prochaines étapes

1. **Choisir votre approche** (Interface Web ou CLI)
2. **Suivre le guide correspondant**
3. **Configurer votre serveur et site**
4. **Déployer votre application**
5. **Configurer SSL et daemons**
6. **Mettre en place le monitoring**
7. **Configurer les sauvegardes**

---

**🚀 Prêt à déployer ? Commencez par `./setup-forge-cli.sh` ou lisez `FORGE_DEPLOYMENT_GUIDE.md` !**
