# ⚡ Déploiement Rapide sur Render

## 🎯 Étapes Express (5 minutes)

### 1. Préparer le Repository
```bash
cd backend
git add .
git commit -m "Configuration Render"
git push origin main
```

### 2. Configurer Supabase
1. Aller sur [Supabase.com](https://supabase.com)
2. Sélectionner votre projet existant
3. **Settings** → **Database**
4. Copier les informations de connexion :
   - Host: `db.xxxxxxxxxxxxx.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: `[votre_mot_de_passe]`

### 3. Créer le Service Web
1. **New** → **Web Service**
2. Connecter votre repo GitHub
3. **Root Directory**: `backend`
4. **Name**: `coovia-backend`
5. **Environment**: `PHP`
6. **Plan**: Free

### 4. Variables d'Environnement
Dans **Environment Variables**, ajouter :

#### Variables Requises
```
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-backend.onrender.com
LOG_CHANNEL=stack
LOG_LEVEL=error
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=[votre_mot_de_passe_supabase]
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
FRONTEND_URL=https://votre-frontend.com
```

### 5. Déployer
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

### Logs
- **Build Logs**: Erreurs de compilation
- **Runtime Logs**: Erreurs d'exécution
- **Health Checks**: Statut du service

## 🚨 Problèmes Courants

### Erreur APP_KEY
- Le script deploy.sh la génère automatiquement

### Erreur de Base de Données
- Vérifier les variables DB_*
- Tester la connexion PostgreSQL

### Erreur de Permissions
- Le script deploy.sh configure les permissions

## 📞 Support
- **Logs**: Interface Render
- **Documentation**: `RENDER_DEPLOYMENT.md`
- **Test**: `./test-deployment.sh`
