# Guide de démarrage rapide - Auth0 Wozif

## 🚀 Démarrage de l'application

1. **Installer les dépendances** :
   ```bash
   cd frontend
   npm install
   # ou
   pnpm install
   ```

2. **Démarrer l'application** :
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

3. **Ouvrir l'application** :
   Naviguez vers `http://localhost:3000`

## 🔐 Test de l'authentification

### Étape 1 : Vérifier la configuration
- Ouvrez la console du navigateur (F12)
- Exécutez le script de test : `test-auth0.js`
- Vérifiez que toutes les configurations sont correctes

### Étape 2 : Tester la connexion
1. Cliquez sur "Se connecter" ou "Commencer maintenant"
2. Vous devriez être redirigé vers Auth0
3. Connectez-vous avec vos identifiants
4. Vous devriez être redirigé vers l'application

### Étape 3 : Vérifier l'état d'authentification
- Vérifiez que vous êtes connecté
- Vérifiez que votre profil utilisateur est chargé
- Testez la déconnexion

## ⚠️ Dépannage courant

### Erreur "Invalid redirect_uri"
- Vérifiez que `http://localhost:3000` est dans les "Allowed Callback URLs" d'Auth0
- Vérifiez que `http://localhost:3000/callback` est aussi autorisé

### Erreur "Invalid audience"
- Vérifiez que l'API audience est configurée à `https://api.coovia.com`
- Vérifiez que les scopes sont correctement configurés

### Erreur "Invalid scope"
- Vérifiez que tous les scopes sont autorisés dans Auth0 :
  - `openid`
  - `profile`
  - `email`
  - `read:stores`
  - `write:stores`
  - `read:products`
  - `write:products`

## 🔧 Configuration Auth0 Dashboard

### Application Settings
- **Application Type** : Single Page Application (SPA)
- **Token Endpoint Authentication Method** : None

### URLs
- **Allowed Callback URLs** : `http://localhost:3000, http://localhost:3000/callback`
- **Allowed Logout URLs** : `http://localhost:3000`
- **Allowed Web Origins** : `http://localhost:3000`

### APIs
- **Identifier** : `https://api.coovia.com`
- **Scopes** : Tous les scopes mentionnés ci-dessus

## 📱 Test sur mobile

Pour tester sur mobile ou d'autres appareils :
1. Remplacez `localhost` par votre IP locale
2. Mettez à jour les URLs dans Auth0
3. Testez la connexion

## 🚀 Déploiement en production

En production, vous devrez :
1. Créer un fichier `.env.production`
2. Configurer les URLs de production dans Auth0
3. Utiliser des variables d'environnement sécurisées
4. Configurer HTTPS

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur
2. Vérifiez les logs Auth0
3. Consultez la documentation Auth0
4. Contactez le support technique
