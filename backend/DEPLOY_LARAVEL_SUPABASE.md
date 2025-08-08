# 🚀 Déploiement Laravel + Supabase sur Render

## ⚡ Déploiement Express (3 minutes)

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
3. Connecter votre repo GitHub
4. **Root Directory**: `backend`
5. **Name**: `coovia-backend`
6. **Environment**: `PHP`
7. **Plan**: Free

### 3. Variables d'Environnement Supabase

Dans **Environment Variables**, ajouter :

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
```

### 4. Déployer

1. **Create Web Service**
2. Attendre le déploiement (2-3 minutes)
3. Tester : `https://coovia-backend.onrender.com/api/health`

## ✅ Vérification

### Test de l'API
```bash
# Test de santé
curl https://coovia-backend.onrender.com/api/health

# Test de ping
curl https://coovia-backend.onrender.com/api/ping

# Test de statut
curl https://coovia-backend.onrender.com/api/status
```

### Test de Connexion Supabase
```bash
# Dans les logs Render
php artisan tinker --execute="DB::connection()->getPdo();"
```

## 🚨 Dépannage

### Erreur de Connexion Supabase
1. Vérifier les variables DB_* dans Render
2. Vérifier le mot de passe Supabase
3. Vérifier l'URL du host Supabase

### Erreur SSL
1. Ajouter `'sslmode' => 'require'` dans `config/database.php`
2. Vérifier les certificats SSL

### Erreur de Migrations
1. Vérifier la connexion Supabase
2. Exécuter `php artisan migrate --force`

## 📊 Monitoring

- **Logs Render**: Interface web de Render
- **Logs Supabase**: Dashboard Supabase
- **Health Checks**: Automatiques

## 🎉 URLs

- **API**: `https://coovia-backend.onrender.com`
- **Health Check**: `https://coovia-backend.onrender.com/api/health`
- **Supabase**: `https://supabase.com/dashboard`

## 📞 Support

- **Render**: Interface web de Render
- **Supabase**: Dashboard Supabase
- **Documentation**: `SUPABASE_DEPLOYMENT.md`
