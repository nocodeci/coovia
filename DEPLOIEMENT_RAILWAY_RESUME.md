# 🚀 Résumé Déploiement Railway - Coovia Backend

## ✅ Configuration Prête

Votre backend Laravel est maintenant configuré pour Railway avec :

- ✅ `railway.json` - Configuration Railway optimisée
- ✅ `Procfile` - Configuration du serveur web
- ✅ `build.sh` - Script de build automatisé
- ✅ Route `/api/health` - Endpoint de santé pour Railway
- ✅ Variables d'environnement prêtes dans `railway.env`

## 🎯 Étapes de Déploiement

### 1. Préparer le Code (Optionnel)
```bash
cd backend/
./deploy-railway.sh
```

### 2. Créer le Projet Railway

1. **Allez sur [Railway.app](https://railway.app)**
2. **Connectez-vous avec GitHub**
3. **Cliquez sur "New Project"**
4. **Sélectionnez "Deploy from GitHub repo"**
5. **Choisissez votre repository `coovia`**
6. **Sélectionnez le dossier `backend` comme source**

### 3. Configurer les Variables d'Environnement

Dans l'interface Railway, allez dans l'onglet "Variables" et ajoutez :

#### Variables Essentielles
```env
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.railway.app
APP_KEY=base64:sPB1nQapxfH0/qWiadQtPo0ovgCq9OHDbGhFJMmNNS0=
```

#### Base de Données Supabase
```env
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_supabase
```

#### Cloudflare R2 (Stockage)
```env
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY=67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
```

#### CORS et Frontend
```env
FRONTEND_URL=https://votre-frontend.com
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com
SESSION_DOMAIN=.railway.app
```

### 4. Déployer

1. **Railway détectera automatiquement le projet Laravel**
2. **Le build se lancera automatiquement**
3. **Surveillez les logs dans l'interface Railway**

### 5. Tester le Déploiement

```bash
# Test de santé
curl https://votre-app.railway.app/api/health

# Test de statut complet
curl https://votre-app.railway.app/api/status

# Test de base
curl https://votre-app.railway.app/api/test
```

## 🔧 Configuration Avancée

### Domaine Personnalisé (Optionnel)
1. Interface Railway → Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Monitoring
- **Logs** : Interface Railway → Deployments → Logs
- **Métriques** : Interface Railway → Metrics
- **Variables** : Interface Railway → Variables

## 🚨 Dépannage

### Erreurs Communes

1. **Erreur de clé d'application**
   - Vérifiez que `APP_KEY` est défini
   - Utilisez la clé fournie ci-dessus

2. **Erreur de base de données**
   - Vérifiez les variables `DB_*`
   - Testez la connexion Supabase

3. **Erreur de build**
   - Vérifiez les logs Railway
   - Assurez-vous que tous les fichiers sont présents

### Commandes Utiles
```bash
# Voir les logs Railway (si CLI installé)
railway logs

# Redémarrer l'application
railway service restart
```

## 📚 Documentation

- **Guide Complet** : `RAILWAY_DEPLOYMENT_GUIDE.md`
- **Variables d'Environnement** : `railway.env`
- **Script de Déploiement** : `deploy-railway.sh`

## 🎉 Succès !

Une fois déployé, votre API sera accessible sur :
`https://votre-app.railway.app`

**Endpoints disponibles :**
- `/api/health` - Santé de l'application
- `/api/status` - Statut complet avec base de données
- `/api/test` - Test de base
- `/api/*` - Toutes vos routes API

---

**Status** : 🚀 Prêt pour le déploiement !
