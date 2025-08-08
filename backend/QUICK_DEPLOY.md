# ⚡ Déploiement Rapide sur Render

## 🎯 Étapes Express (5 minutes)

### 1. Préparer le Repository
```bash
cd backend
git add .
git commit -m "Configuration Render"
git push origin main
```

### 2. Créer la Base de Données
1. Aller sur [Render.com](https://render.com)
2. **New** → **PostgreSQL**
3. **Name**: `coovia-database`
4. **Plan**: Free
5. **Create Database**

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
DB_HOST=[host de votre DB]
DB_PORT=5432
DB_DATABASE=coovia_db
DB_USERNAME=coovia_user
DB_PASSWORD=[mot de passe de votre DB]
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
