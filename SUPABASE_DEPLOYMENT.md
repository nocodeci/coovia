# 🚀 Déploiement Laravel + Supabase sur Render

## 📋 Configuration Supabase

### 1. Récupérer les Informations Supabase

1. Aller sur [Supabase.com](https://supabase.com)
2. Sélectionner votre projet
3. **Settings** → **Database**
4. Copier les informations de connexion :

```
Host: db.xxxxxxxxxxxxx.supabase.co
Database: postgres
User: postgres
Password: [votre_mot_de_passe]
Port: 5432
```

### 2. Variables d'Environnement Supabase

Dans l'interface Render, ajouter ces variables :

```
# Supabase Database
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_supabase

# Application
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-backend.onrender.com

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error

# Cache et Sessions
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Frontend URL pour CORS
FRONTEND_URL=https://votre-frontend.com

# Payment Gateways (optionnel)
PAYDUNYA_MASTER_KEY=votre_clé_master
PAYDUNYA_PUBLIC_KEY=votre_clé_publique
PAYDUNYA_PRIVATE_KEY=votre_clé_privée
PAYDUNYA_TOKEN=votre_token

MONEROO_PUBLIC_KEY=votre_clé_publique
MONEROO_SECRET_KEY=votre_clé_secrète
MONEROO_ENVIRONMENT=production
```

## 🎯 Étapes de Déploiement

### 1. Préparer le Repository
```bash
cd backend
git add .
git commit -m "Configuration Render + Supabase"
git push origin main
```

### 2. Créer le Service Web sur Render

1. Aller sur [Render.com](https://render.com)
2. **New** → **Web Service**
3. Connecter votre repository GitHub
4. **Root Directory**: `backend`
5. **Name**: `coovia-backend`
6. **Environment**: `PHP`
7. **Plan**: Free

### 3. Configurer les Variables d'Environnement

Dans **Environment Variables**, ajouter toutes les variables listées ci-dessus avec vos vraies valeurs Supabase.

### 4. Déployer

1. **Create Web Service**
2. Render va automatiquement :
   - Cloner le repository
   - Installer les dépendances
   - Exécuter le script deploy.sh
   - Démarrer le service

## 🔧 Configuration Post-Déploiement

### Vérifier la Connexion Supabase
```bash
# Tester l'endpoint de santé
curl https://coovia-backend.onrender.com/api/health

# Tester l'endpoint de statut
curl https://coovia-backend.onrender.com/api/status
```

### Exécuter les Migrations
```bash
# Les migrations s'exécutent automatiquement via deploy.sh
# Si besoin de les relancer manuellement :
php artisan migrate --force
```

## 🚨 Dépannage

### Erreurs de Connexion Supabase

1. **Vérifier les variables DB_*** :
   - `DB_HOST` doit être l'URL Supabase
   - `DB_PASSWORD` doit être le bon mot de passe
   - `DB_DATABASE` doit être `postgres`

2. **Tester la connexion** :
   ```bash
   # Dans les logs Render
   php artisan tinker --execute="DB::connection()->getPdo();"
   ```

### Erreurs de SSL Supabase

Si vous avez des erreurs SSL, ajoutez dans `config/database.php` :
```php
'pgsql' => [
    // ... autres configs
    'sslmode' => 'require',
],
```

## 📊 Monitoring

- **Logs Render**: Interface web de Render
- **Logs Supabase**: Dashboard Supabase → Logs
- **Health Checks**: Automatiques sur Render

## 🔒 Sécurité

- ✅ HTTPS automatique sur Render
- ✅ SSL requis pour Supabase
- ✅ Variables d'environnement sécurisées
- ✅ Pas d'accès SSH (service managé)

## 🎉 URLs

- **API**: `https://coovia-backend.onrender.com`
- **Health Check**: `https://coovia-backend.onrender.com/api/health`
- **Supabase Dashboard**: `https://supabase.com/dashboard`

## 📞 Support

- **Render**: Interface web de Render
- **Supabase**: Dashboard Supabase
- **Documentation**: `RENDER_DEPLOYMENT.md`
