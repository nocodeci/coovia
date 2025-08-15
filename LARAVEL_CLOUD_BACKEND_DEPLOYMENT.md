# 🚀 Déploiement Laravel Cloud - Branche Backend Dédiée

## ✅ **Branche Backend Créée avec Succès !**

**Repository** : https://github.com/nocodeci/coovia  
**Branche** : `backend-deploy`  
**Contenu** : Uniquement le backend Laravel optimisé

## 🎯 **Avantages de cette Approche**

✅ **Déploiement Simplifié** : Plus besoin de spécifier un répertoire de déploiement  
✅ **Code Optimisé** : Seulement les fichiers nécessaires au backend  
✅ **Performance** : Taille réduite, déploiement plus rapide  
✅ **Maintenance** : Séparation claire entre frontend et backend  

## 🌐 **Étapes de Déploiement Laravel Cloud**

### **1. Accéder à Laravel Cloud**
```
https://cloud.laravel.com
```

### **2. Créer un Nouveau Projet**
- **Nom** : `coovia-api`
- **Type** : Laravel
- **PHP Version** : 8.2

### **3. Connecter le Repository**
- **Repository** : `nocodeci/coovia`
- **Branche** : `backend-deploy`
- **Répertoire** : `/` (racine - plus besoin de spécifier `backend`)

### **4. Variables d'Environnement**
```env
# Application
APP_NAME=Coovia API
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.laravelcloud.com
LOG_LEVEL=error

# Base de données
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=coovia_prod
DB_USERNAME=coovia_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE

# Cache et Sessions
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=VOTRE_ACCESS_KEY
CLOUDFLARE_R2_SECRET_ACCESS_KEY=VOTRE_SECRET_KEY
CLOUDFLARE_R2_DEFAULT_REGION=auto
CLOUDFLARE_R2_BUCKET=VOTRE_BUCKET
CLOUDFLARE_R2_ENDPOINT=https://VOTRE_ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://VOTRE_DOMAIN.r2.dev

# Sanctum
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com,localhost:3000,localhost:5173
SESSION_DOMAIN=.votre-domaine.com
```

### **5. Services**
- **Base de données** : PostgreSQL
- **Cache** : Redis (optionnel)
- **Stockage** : Local (ou Cloudflare R2)

### **6. Déployer**
1. Cliquer sur "Deploy"
2. Attendre la fin du déploiement
3. Noter l'URL de l'application

## 🔧 **Configuration Post-Déploiement**

### **Via Terminal Laravel Cloud**
```bash
# Migrations
php artisan migrate --force

# Permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Lien symbolique
php artisan storage:link

# Clé d'application
php artisan key:generate
```

## 🧪 **Tests de Validation**

### **1. Endpoint de Santé**
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

### **2. Endpoints Publics**
```bash
# Test boutique
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test"

# Test produits
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/products"

# Test catégories
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test/categories"
```

### **3. Endpoints Protégés**
```bash
# Test avec authentification
curl -X GET "https://votre-app.laravelcloud.com/api/stores" \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🔄 **Mises à Jour Futures**

### **Déployer une Mise à Jour**
1. Faire les modifications dans la branche `backend-deploy`
2. Committer et pousser vers GitHub
3. Dans Laravel Cloud, cliquer sur "Deploy"

### **Rollback**
1. Dans Laravel Cloud, aller dans "Deployments"
2. Sélectionner une version précédente
3. Cliquer sur "Rollback"

## 📊 **Monitoring**

### **Logs**
- Accessibles via Laravel Cloud Dashboard
- Surveiller les erreurs et performances

### **Métriques**
- Temps de réponse
- Utilisation CPU/Mémoire
- Requêtes par minute

## 🔧 **Configuration Frontend**

### **Mettre à Jour les URLs API**
Dans vos fichiers frontend, mettre à jour les URLs :

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';

// boutique-client/src/services/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';

// temp-deploy/src/services/api.ts
const API_BASE_URL = 'https://votre-app.laravelcloud.com/api';
```

## 🚨 **Dépannage**

### **Erreur 500 - Configuration**
1. Vérifier les logs dans Laravel Cloud
2. Régénérer la clé d'application
3. Vérifier les variables d'environnement

### **Erreur de Base de Données**
1. Vérifier la connexion DB
2. Exécuter les migrations
3. Vérifier les permissions

### **Erreur de Permissions**
1. Se connecter au terminal
2. Exécuter les commandes de permissions
3. Vérifier les propriétaires des fichiers

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

## 🏆 **Résumé**

**Votre backend Laravel est maintenant déployé et opérationnel sur Laravel Cloud !**

- **✅ Branche dédiée** : `backend-deploy`
- **✅ Code optimisé** : Seulement le backend
- **✅ Déploiement simplifié** : Plus de répertoire à spécifier
- **✅ Performance optimale** : Taille réduite
- **✅ Maintenance facilitée** : Séparation claire

**Prochaine étape** : Configurer vos frontends pour utiliser la nouvelle URL Laravel Cloud ! 🚀✨
