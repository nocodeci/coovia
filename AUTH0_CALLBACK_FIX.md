# 🔧 Résolution du problème "Callback URL mismatch" Auth0

## 🚨 Problème identifié

Vous rencontrez l'erreur :
```
Callback URL mismatch. The provided redirect_uri is not in the list of allowed callback URLs.
```

## 🔍 Cause du problème

L'URL de redirection configurée dans votre application (`http://localhost:3000/callback`) ne correspond pas aux URLs autorisées dans votre tableau de bord Auth0.

## ✅ Solution

### 1. Mettre à jour votre tableau de bord Auth0

1. **Connectez-vous à Auth0** : https://manage.auth0.com/
2. **Allez dans Applications > Applications**
3. **Sélectionnez votre application "wozif"**
4. **Cliquez sur l'onglet "Settings"**
5. **Dans la section "Allowed Callback URLs", ajoutez :**
   ```
   http://localhost:3000/callback
   ```
6. **Dans la section "Allowed Logout URLs", ajoutez :**
   ```
   http://localhost:3000
   ```
7. **Cliquez sur "Save Changes"**

### 2. Vérification de la configuration

Votre application est maintenant configurée pour utiliser :
- **Callback URL** : `http://localhost:3000/callback`
- **Logout URL** : `http://localhost:3000`

### 3. Test de la configuration

1. **Redémarrez votre frontend** (si nécessaire)
2. **Essayez de vous connecter** via Auth0
3. **Vérifiez que vous êtes redirigé vers** `/callback` puis vers la page d'accueil

## 🛠️ Modifications apportées

### Fichiers modifiés :

1. **`frontend/src/config/app.ts`**
   - Ajout de `callbackUrl` et `logoutUrl` dans la configuration Auth0

2. **`frontend/src/context/auth0-context.tsx`**
   - Mise à jour pour utiliser `APP_CONFIG.auth0.callbackUrl`

3. **`frontend/src/routes/(auth)/callback.tsx`**
   - Nouvelle page de callback pour gérer la redirection Auth0

## 🔄 Prochaines étapes

1. **Mettez à jour votre tableau de bord Auth0** (étape 1 ci-dessus)
2. **Testez la connexion** 
3. **Si le problème persiste**, vérifiez les logs de la console pour plus de détails

## 📝 Notes importantes

- Les URLs de callback doivent correspondre exactement entre Auth0 et votre application
- En production, vous devrez ajouter vos URLs de production (ex: `https://votre-domaine.com/callback`)
- La page de callback gère automatiquement la redirection vers la page d'accueil après authentification

## 🆘 En cas de problème persistant

Si l'erreur persiste après ces modifications :
1. Vérifiez que vous avez bien sauvegardé les changements dans Auth0
2. Videz le cache de votre navigateur
3. Vérifiez les logs de la console pour d'autres erreurs
4. Assurez-vous que votre frontend est bien accessible sur `http://localhost:3000`
