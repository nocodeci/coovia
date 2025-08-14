# 🚀 Guide de Déploiement Manuel Laravel Cloud

## ✅ **Code Préparé et Prêt**

Votre code a été préparé et poussé vers GitHub :
- **Repository** : https://github.com/nocodeci/coovia
- **Branche** : `cursor`
- **Répertoire** : `backend`

## 🌐 **Étapes de Déploiement sur Laravel Cloud**

### **1. Accéder à Laravel Cloud**
1. Allez sur https://cloud.laravel.com
2. Connectez-vous à votre compte Laravel Cloud

### **2. Créer ou Utiliser un Projet**
1. **Créer un nouveau projet** :
   - Cliquez sur "New Project"
   - Nom : `coovia-api`
   - Type : Laravel
   - PHP Version : 8.2

2. **Ou utiliser un projet existant** :
   - Sélectionnez votre projet existant

### **3. Connecter le Repository GitHub**
1. Dans votre projet Laravel Cloud, allez dans "Git"
2. Cliquez sur "Connect Repository"
3. Sélectionnez : `nocodeci/coovia`
4. Branche : `cursor`
5. **Répertoire de déploiement** : `backend`

### **4. Configurer les Variables d'Environnement**
Dans la section "Environment Variables", configurez :

#### **Variables de Base**
```env
APP_NAME=Coovia API
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.laravelcloud.com
LOG_LEVEL=error
```

#### **Base de Données**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coovia_prod
DB_USERNAME=coovia_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE
```

#### **Cache et Sessions**
```env
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
```

#### **Cloudflare R2 (Stockage)**
```env
CLOUDFLARE_R2_ACCESS_KEY_ID=VOTRE_ACCESS_KEY
CLOUDFLARE_R2_SECRET_ACCESS_KEY=VOTRE_SECRET_KEY
CLOUDFLARE_R2_DEFAULT_REGION=auto
CLOUDFLARE_R2_BUCKET=VOTRE_BUCKET
CLOUDFLARE_R2_ENDPOINT=https://VOTRE_ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://VOTRE_DOMAIN.r2.dev
```

#### **Sanctum (Authentification)**
```env
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com,localhost:3000,localhost:5173
SESSION_DOMAIN=.votre-domaine.com
```

### **5. Configurer les Services**
1. **Base de données** : MySQL
2. **Cache** : Redis (optionnel)
3. **Stockage** : Local (ou Cloudflare R2)

### **6. Déployer l'Application**
1. Cliquez sur "Deploy"
2. Attendez que le déploiement se termine
3. Notez l'URL de votre application

### **7. Configuration Post-Déploiement**

#### **Exécuter les Migrations**
1. Allez dans "Terminal" de votre projet
2. Exécutez :
```bash
php artisan migrate --force
```

#### **Configurer les Permissions**
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### **Créer le Lien Symbolique**
```bash
php artisan storage:link
```

#### **Générer la Clé d'Application**
```bash
php artisan key:generate
```

## 🧪 **Tests de Validation**

### **1. Test de l'Endpoint de Santé**
```bash
curl -X GET "https://votre-app.laravelcloud.com/api/health"
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "message": "Coovia API is running",
  "timestamp": "2025-01-15T10:30:00.000000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### **2. Test des Endpoints Publics**
```bash
# Test boutique
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test"

# Test produits
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/products"

# Test catégories
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/categories"
```

### **3. Test des Endpoints Protégés**
```bash
# Test avec authentification
curl -X GET "https://votre-app.laravelcloud.com/api/stores" \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🔧 **Configuration Frontend**

### **Mettre à Jour les URLs API**
Dans vos fichiers frontend, mettez à jour les URLs :

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';

// boutique-client/src/services/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';

// temp-deploy/src/services/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';
```

## 📊 **Monitoring et Logs**

### **Voir les Logs**
1. Dans Laravel Cloud, allez dans "Logs"
2. Surveillez les logs d'erreur
3. Vérifiez les performances

### **Métriques**
1. Allez dans "Metrics"
2. Surveillez :
   - Temps de réponse
   - Utilisation CPU/Mémoire
   - Requêtes par minute

## 🚨 **Dépannage**

### **Erreur 500 - Configuration**
1. Vérifiez les logs dans Laravel Cloud
2. Régénérez la clé d'application
3. Vérifiez les variables d'environnement

### **Erreur de Base de Données**
1. Vérifiez la connexion DB
2. Exécutez les migrations
3. Vérifiez les permissions

### **Erreur de Permissions**
1. Connectez-vous au terminal
2. Exécutez les commandes de permissions
3. Vérifiez les propriétaires des fichiers

## 🔄 **Mises à Jour Futures**

### **Déployer une Mise à Jour**
1. Faites vos modifications
2. Committez et poussez vers GitHub
3. Dans Laravel Cloud, cliquez sur "Deploy"

### **Rollback**
1. Dans Laravel Cloud, allez dans "Deployments"
2. Sélectionnez une version précédente
3. Cliquez sur "Rollback"

## 📞 **Support**

### **Ressources Utiles**
- **Documentation Laravel Cloud** : https://cloud.laravel.com/docs
- **Support** : https://cloud.laravel.com/support
- **Status** : https://status.laravel.com

### **Commandes Utiles**
```bash
# Voir les logs
laravel cloud logs

# Se connecter au serveur
laravel cloud ssh

# Voir les métriques
laravel cloud metrics

# Redémarrer l'application
laravel cloud restart
```

## 🎉 **Validation Finale**

### **Checklist de Validation**
- ✅ **Endpoint de santé** : Accessible et fonctionnel
- ✅ **Endpoints publics** : Produits et boutiques accessibles
- ✅ **Endpoints protégés** : Authentification fonctionnelle
- ✅ **Base de données** : Migrations exécutées
- ✅ **Permissions** : Fichiers accessibles en écriture
- ✅ **Stockage** : Upload de fichiers fonctionnel
- ✅ **Logs** : Aucune erreur critique
- ✅ **Performance** : Temps de réponse < 200ms

### **Tests Frontend**
- ✅ **Frontend public** : Chargement des produits
- ✅ **Frontend authentifié** : Connexion utilisateur
- ✅ **Upload de fichiers** : Images vers Cloudflare R2
- ✅ **Paiements** : Intégrations de paiement

**Votre backend Laravel est maintenant déployé et opérationnel sur Laravel Cloud !** 🚀✨
