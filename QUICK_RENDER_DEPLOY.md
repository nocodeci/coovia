# ⚡ Guide Rapide - Déploiement Render

## ✅ Préparation Terminée

Votre backend Laravel est prêt pour le déploiement ! Tous les fichiers nécessaires ont été configurés et poussés vers GitHub.

## 🚀 Déploiement en 5 Étapes

### 1. Créer le Service Render

1. **Allez sur [render.com](https://render.com)**
2. **Connectez-vous avec GitHub**
3. **Cliquez sur "New +" → "Web Service"**
4. **Sélectionnez votre repository : `coovia`**
5. **Sélectionnez la branche : `cursor`**

### 2. Configuration du Service

**Paramètres de base :**
- **Name** : `coovia-backend`
- **Environment** : `PHP`
- **Region** : `Frankfurt (EU Central)`
- **Root Directory** : `backend`

**Build Command :**
```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Start Command :**
```bash
chmod +x deploy.sh
./deploy.sh
vendor/bin/heroku-php-apache2 public/
```

### 3. Variables d'Environnement

Dans la section "Environment Variables", ajoutez :

**Variables de Base :**
```env
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-backend.onrender.com
LOG_CHANNEL=stack
LOG_LEVEL=error
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
```

**Variables Supabase (OBLIGATOIRES) :**
```env
DB_CONNECTION=pgsql
DB_HOST=votre-supabase-host.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre-supabase-password
```

**Variables Payment (OPTIONNELLES) :**
```env
PAYDUNYA_MASTER_KEY=votre-clé
PAYDUNYA_PUBLIC_KEY=votre-clé
PAYDUNYA_PRIVATE_KEY=votre-clé
PAYDUNYA_TOKEN=votre-clé
MONEROO_PUBLIC_KEY=votre-clé
MONEROO_SECRET_KEY=votre-clé
MONEROO_ENVIRONMENT=production
```

### 4. Déployer

1. **Cliquez sur "Create Web Service"**
2. **Attendez 5-10 minutes** pour le déploiement
3. **Vérifiez les logs** dans le dashboard

### 5. Tester

```bash
# Test de santé
curl https://coovia-backend.onrender.com/api/health

# Test de statut
curl https://coovia-backend.onrender.com/api/status

# Test des stores
curl https://coovia-backend.onrender.com/api/stores
```

## 🔍 Vérification

### Logs de Déploiement

Vérifiez dans Render Dashboard que vous voyez :
- ✅ `composer install` réussi
- ✅ `php artisan config:cache` réussi
- ✅ `./deploy.sh` exécuté
- ✅ Connexion Supabase réussie
- ✅ Migrations exécutées

### Endpoints de Test

Tous ces endpoints doivent fonctionner :
- ✅ `/api/health` - Statut de santé
- ✅ `/api/status` - Statut détaillé
- ✅ `/api/test` - Test de base
- ✅ `/api/ping` - Test de connectivité

## 🛠️ Dépannage Rapide

### Erreur de Build
- Vérifiez que `composer.json` est valide
- Assurez-vous que PHP 8.2+ est utilisé

### Erreur de Connexion Supabase
- Vérifiez les variables DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- Assurez-vous que l'IP de Render est autorisée dans Supabase

### Erreur de Permissions
- Le script `deploy.sh` gère automatiquement les permissions
- Vérifiez les logs pour plus de détails

## 🎯 URLs Finales

Après déploiement réussi :
- **Backend API** : `https://coovia-backend.onrender.com`
- **Health Check** : `https://coovia-backend.onrender.com/api/health`
- **API Status** : `https://coovia-backend.onrender.com/api/status`

## 📞 Support

- **Documentation complète** : `RENDER_DEPLOYMENT_GUIDE.md`
- **Script automatisé** : `deploy-render.sh`
- **Dashboard Render** : https://dashboard.render.com

---

**Status** : ✅ Prêt pour le déploiement
**Prochaine action** : Suivre les 5 étapes ci-dessus
