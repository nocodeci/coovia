# Guide Rapide - Déploiement Forge CLI

## 🚀 Déploiement rapide via CLI Forge

### Prérequis

1. **Compte Laravel Forge** avec un serveur créé
2. **Forge CLI** installé et configuré
3. **Repository Git** avec votre code

### Installation de Forge CLI

```bash
# Installer Forge CLI
composer global require laravel/forge-cli

# Ajouter au PATH (macOS/Linux)
echo 'export PATH="$HOME/.composer/vendor/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Vérifier l'installation
forge --version
```

### Authentification

```bash
# Se connecter à Forge
forge login

# Entrez votre token API Forge
# Obtenez-le sur: https://forge.laravel.com/user/profile#/tokens
```

### Étapes de déploiement

#### 1. Créer le serveur (via interface web)

1. Allez sur [forge.laravel.com](https://forge.laravel.com)
2. Cliquez sur "Create Server"
3. Choisissez votre provider (DigitalOcean, Linode, etc.)
4. Configurez le serveur avec PHP 8.2+
5. Notez le nom du serveur

#### 2. Créer le site (via interface web)

1. Dans votre serveur, cliquez sur "New Site"
2. Entrez le nom du site (ex: `api.coovia.com`)
3. Configurez le repository Git
4. Configurez les variables d'environnement

#### 3. Déployer via CLI

```bash
# Aller dans le répertoire backend
cd backend

# Exécuter le script de déploiement
./forge-cli-deploy.sh
```

### Commandes CLI utiles

```bash
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

### Configuration automatique

Le script `forge-cli-deploy.sh` automatise :

- ✅ Vérification de l'authentification
- ✅ Sélection du serveur
- ✅ Configuration de l'environnement
- ✅ Déploiement du site
- ✅ Vérification des logs
- ✅ Tests de l'application
- ✅ Configuration des daemons

### Variables d'environnement

Assurez-vous que votre fichier `.env` contient :

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

### Dépannage

#### Problème d'authentification
```bash
forge login
# Entrez un nouveau token API
```

#### Serveur non trouvé
```bash
forge server:list
# Vérifiez que le serveur existe
```

#### Site non trouvé
```bash
forge site:list
# Créez le site via l'interface web d'abord
```

#### Erreur de déploiement
```bash
forge deploy:logs <nom-du-site>
# Vérifiez les logs de déploiement
```

### Workflow complet

1. **Préparation**
   ```bash
   cd backend
   ./forge-cli-deploy.sh
   ```

2. **Configuration**
   - Sélectionnez votre serveur
   - Configurez l'environnement
   - Vérifiez les variables

3. **Déploiement**
   - Déployez le site
   - Vérifiez les logs
   - Testez l'application

4. **Post-déploiement**
   - Configurez SSL
   - Configurez les daemons
   - Configurez les sauvegardes

### Scripts disponibles

- `forge-cli-deploy.sh` - Déploiement via CLI
- `forge-deploy.sh` - Script de déploiement personnalisé
- `forge-health-check.sh` - Vérification de santé
- `forge-backup-config.sh` - Configuration des sauvegardes

### Support

- Documentation Forge : [forge.laravel.com/docs](https://forge.laravel.com/docs)
- CLI Forge : [github.com/laravel/forge-cli](https://github.com/laravel/forge-cli)
- Support Laravel : [laravel.com/docs](https://laravel.com/docs)
