# 🚀 Déploiement Laravel sur Render

## 📋 Fichiers de Configuration Créés

- ✅ `render.yaml` - Configuration du service
- ✅ `Procfile` - Commande de démarrage
- ✅ `deploy.sh` - Script de déploiement
- ✅ `apache.conf` - Configuration Apache
- ✅ `extensions.txt` - Extensions PHP requises
- ✅ `env.example` - Variables d'environnement

## 🎯 Étapes de Déploiement

### 1. Préparer le Repository

```bash
# Vérifier que tous les fichiers sont commités
git add .
git commit -m "Configuration Render"
git push origin main
```

### 2. Créer la Base de Données PostgreSQL

1. Aller sur [Render.com](https://render.com)
2. **New** → **PostgreSQL**
3. Configuration :
   - **Name**: `coovia-database`
   - **Database**: `coovia_db`
   - **User**: `coovia_user`
   - **Plan**: Free

### 3. Créer le Service Web

1. **New** → **Web Service**
2. Connecter le repository GitHub
3. Sélectionner le dossier `backend`
4. Configuration :
   - **Name**: `coovia-backend`
   - **Environment**: `PHP`
   - **Build Command**: (automatique via render.yaml)
   - **Start Command**: (automatique via render.yaml)

### 4. Variables d'Environnement

#### Variables Requises
```
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-backend.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=[host de votre DB PostgreSQL]
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

#### Variables de Paiement (optionnelles)
```
PAYDUNYA_MASTER_KEY=votre_clé_master
PAYDUNYA_PUBLIC_KEY=votre_clé_publique
PAYDUNYA_PRIVATE_KEY=votre_clé_privée
PAYDUNYA_TOKEN=votre_token

MONEROO_PUBLIC_KEY=votre_clé_publique
MONEROO_SECRET_KEY=votre_clé_secrète
MONEROO_ENVIRONMENT=production
```

### 5. Déployer

1. Cliquer sur **Create Web Service**
2. Render va automatiquement :
   - Cloner le repository
   - Installer les dépendances
   - Exécuter le script deploy.sh
   - Démarrer le service

## 🔧 Configuration Post-Déploiement

### Vérifier les Logs
```bash
# Dans l'interface Render
# Aller dans Logs pour voir les erreurs
```

### Tester l'API
```bash
# Tester l'endpoint de santé
curl https://coovia-backend.onrender.com/api/health

# Tester l'authentification
curl -X POST https://coovia-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🚨 Dépannage

### Erreurs Courantes

1. **APP_KEY manquante**
   - Le script deploy.sh la génère automatiquement

2. **Erreurs de base de données**
   - Vérifier les variables DB_*
   - Tester la connexion PostgreSQL

3. **Erreurs de permissions**
   - Le script deploy.sh configure les permissions

4. **Extensions PHP manquantes**
   - Vérifier le fichier extensions.txt

### Logs de Déploiement
```bash
# Dans l'interface Render
# Build Logs → Voir les erreurs de build
# Runtime Logs → Voir les erreurs d'exécution
```

## 📊 Monitoring

- **Health Checks**: Automatiques
- **Logs**: Temps réel dans l'interface
- **Métriques**: CPU, mémoire, requêtes
- **Uptime**: Monitoring automatique

## 🔒 Sécurité

- ✅ HTTPS automatique
- ✅ Variables d'environnement sécurisées
- ✅ Headers de sécurité configurés
- ✅ Compression activée
- ✅ Cache optimisé

## 🎉 URLs

- **API**: `https://coovia-backend.onrender.com`
- **Health Check**: `https://coovia-backend.onrender.com/api/health`
- **Documentation**: `https://coovia-backend.onrender.com/api/documentation`

## 📞 Support

- **Documentation Render**: https://render.com/docs
- **Support Laravel**: https://laravel.com/docs
- **Logs Render**: Interface web de Render
