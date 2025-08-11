# 🔐 Guide de Configuration Auth0 pour Coovia

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la configuration complète d'Auth0 pour votre projet Coovia, incluant la configuration du dashboard Auth0, l'intégration frontend et backend.

## 🚀 Étapes de Configuration

### **1. Configuration Auth0 Dashboard**

#### Étape 1 : Créer un compte Auth0
1. Allez sur [auth0.com](https://auth0.com)
2. Créez un compte gratuit
3. Créez un nouveau tenant (ex: `coovia-dev`)

#### Étape 2 : Créer une Application
1. Dans le dashboard Auth0, allez dans **Applications**
2. Cliquez sur **Create Application**
3. Nommez-la : `Coovia Frontend`
4. Sélectionnez **Single Page Application**
5. Cliquez sur **Create**

#### Étape 3 : Configurer l'Application
Dans les paramètres de votre application :

**Allowed Callback URLs :**
```
http://localhost:3000,
https://app.wozif.com,
https://your-domain.com
```

**Allowed Logout URLs :**
```
http://localhost:3000,
https://app.wozif.com,
https://your-domain.com
```

**Allowed Web Origins :**
```
http://localhost:3000,
https://app.wozif.com,
https://your-domain.com
```

#### Étape 4 : Créer une API
1. Allez dans **APIs**
2. Cliquez sur **Create API**
3. Nommez-la : `Coovia API`
4. Identifier : `https://api.coovia.com`
5. Sélectionnez **RS256** pour Signing Algorithm
6. Cliquez sur **Create**

#### Étape 5 : Récupérer les Informations
Notez ces informations :
- **Domain** : `your-tenant.auth0.com`
- **Client ID** : `your-client-id`
- **Client Secret** : `your-client-secret`
- **Audience** : `https://api.coovia.com`

### **2. Configuration Frontend**

#### Étape 1 : Variables d'environnement
Créez un fichier `.env` dans le dossier `frontend/` :

```env
# Configuration API
VITE_API_URL=http://localhost:8001/api

# Configuration Auth0
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.coovia.com

# Configuration de l'application
VITE_APP_NAME=Coovia
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

#### Étape 2 : Vérifier l'installation
```bash
cd frontend
npm install @auth0/auth0-react
npm run dev
```

### **3. Configuration Backend**

#### Étape 1 : Variables d'environnement
Ajoutez ces variables dans votre fichier `.env` du backend :

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.coovia.com
AUTH0_REDIRECT_URI=http://localhost:3000
AUTH0_JWT_LEEWAY=10
AUTH0_JWT_ALGORITHM=RS256
AUTH0_CACHE_ENABLED=true
AUTH0_CACHE_TTL=3600
AUTH0_AUTO_SYNC_USER=true
AUTH0_CREATE_USER_IF_NOT_EXISTS=true
```

#### Étape 2 : Exécuter les migrations
```bash
cd backend
php artisan migrate
```

#### Étape 3 : Vérifier l'installation
```bash
php artisan serve --port=8001
```

### **4. Test de l'Intégration**

#### Étape 1 : Tester la connexion
1. Ouvrez votre application frontend
2. Cliquez sur "Se connecter avec Auth0"
3. Vous devriez être redirigé vers Auth0
4. Créez un compte ou connectez-vous
5. Vous devriez être redirigé vers votre application

#### Étape 2 : Tester l'API
```bash
# Test de synchronisation Auth0
curl -X POST http://localhost:8001/api/auth/auth0/sync \
  -H "Content-Type: application/json" \
  -d '{
    "auth0_id": "auth0|123456789",
    "email": "test@example.com",
    "name": "Test User",
    "access_token": "your-auth0-token"
  }'
```

### **5. Configuration de Production**

#### Étape 1 : Variables de production
Pour la production, mettez à jour les URLs :

**Frontend (.env) :**
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.coovia.com
```

**Backend (.env) :**
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.coovia.com
AUTH0_REDIRECT_URI=https://app.wozif.com
```

#### Étape 2 : Mettre à jour Auth0 Dashboard
Dans votre application Auth0, ajoutez les URLs de production :

**Allowed Callback URLs :**
```
https://app.wozif.com,
https://your-domain.com
```

**Allowed Logout URLs :**
```
https://app.wozif.com,
https://your-domain.com
```

**Allowed Web Origins :**
```
https://app.wozif.com,
https://your-domain.com
```

## 🔧 Fonctionnalités Implémentées

### **✅ Authentification**
- Connexion/Inscription via Auth0
- Gestion des tokens JWT
- Synchronisation automatique avec la base de données
- Gestion des rôles et permissions

### **✅ Sécurité**
- Validation des tokens côté serveur
- Protection des routes API
- Gestion des permissions par rôle
- Cache des informations utilisateur

### **✅ Intégration**
- Provider React pour Auth0
- Service Laravel pour Auth0
- Middleware de protection
- Contrôleur pour la synchronisation

## 🚨 Dépannage

### **Problème 1 : Erreur de redirection**
**Symptôme :** "Invalid redirect_uri"
**Solution :** Vérifiez que l'URL de redirection est dans la liste des URLs autorisées dans Auth0.

### **Problème 2 : Token invalide**
**Symptôme :** "Token d'authentification invalide"
**Solution :** Vérifiez que l'Audience et le Domain sont corrects.

### **Problème 3 : Utilisateur non synchronisé**
**Symptôme :** "Utilisateur non trouvé dans la base de données"
**Solution :** Vérifiez que la migration a été exécutée et que la synchronisation fonctionne.

## 📞 Support

- **Documentation Auth0** : [auth0.com/docs](https://auth0.com/docs)
- **SDK Auth0 PHP** : [github.com/auth0/auth0-PHP](https://github.com/auth0/auth0-PHP)
- **SDK Auth0 React** : [github.com/auth0/auth0-react](https://github.com/auth0/auth0-react)

---

**🎉 Félicitations !** Votre application Coovia est maintenant configurée avec Auth0 pour une authentification sécurisée et professionnelle.
