# 🔧 Résolution du problème HTTPS Auth0 pour le développement local

## 🚨 Problème identifié

Vous rencontrez l'erreur :
```
Error! Payload validation error: 'Object didn't pass validation for format absolute-https-uri-or-empty: http://localhost:3000' on property initiate_login_uri (Initiate login uri, must be https).
```

## 🔍 Cause du problème

Auth0 exige que l'URL d'initiation de connexion soit en HTTPS, mais vous êtes en développement local avec `http://localhost:3000`.

## ✅ Solution

### 1. **Configuration Auth0 pour le développement local**

Dans votre tableau de bord Auth0, vous devez configurer les URLs comme suit :

#### **Allowed Callback URLs :**
```
http://localhost:3000/callback
```

#### **Allowed Logout URLs :**
```
http://localhost:3000
```

#### **Allowed Web Origins :**
```
http://localhost:3000
```

#### **Initiate Login URI :**
```
http://localhost:3000/sign-in
```

**⚠️ IMPORTANT :** Pour le développement local, Auth0 accepte `localhost` même en HTTP. C'est une exception spéciale pour le développement.

### 2. **Étapes de configuration dans Auth0**

1. **Connectez-vous à Auth0** : https://manage.auth0.com/
2. **Allez dans Applications > Applications**
3. **Sélectionnez votre application "wozif"**
4. **Cliquez sur l'onglet "Settings"**
5. **Configurez les URLs comme indiqué ci-dessus**
6. **Cliquez sur "Save Changes"**

### 3. **Vérification de la configuration**

Votre application est maintenant configurée pour utiliser :
- **Callback URL** : `http://localhost:3000/callback`
- **Logout URL** : `http://localhost:3000`
- **Initiate Login URI** : `http://localhost:3000/sign-in`

## 🛠️ Modifications apportées

### Fichiers modifiés :

1. **`frontend/src/config/app.ts`**
   - Configuration mise à jour pour le développement local
   - Commentaires explicatifs sur l'acceptation de localhost en HTTP

2. **`frontend/src/config/auth0-keys.ts`**
   - Fichier supprimé (plus nécessaire)

## 🔄 Prochaines étapes

1. **Mettez à jour votre tableau de bord Auth0** avec les URLs ci-dessus
2. **Redémarrez votre frontend** si nécessaire
3. **Testez la connexion** via Auth0
4. **Vérifiez que vous êtes redirigé vers** `/callback` puis vers la page d'accueil

## 📝 Notes importantes

- **Développement local** : Auth0 accepte `localhost` en HTTP
- **Production** : Vous devrez utiliser HTTPS (ex: `https://votre-domaine.com/callback`)
- **Initiate Login URI** : Doit pointer vers votre page de connexion
- **Web Origins** : Nécessaire pour les requêtes CORS depuis votre frontend

## 🆘 En cas de problème persistant

Si l'erreur persiste après ces modifications :
1. Vérifiez que vous avez bien sauvegardé les changements dans Auth0
2. Assurez-vous que toutes les URLs commencent par `http://localhost:3000`
3. Videz le cache de votre navigateur
4. Vérifiez les logs de la console pour d'autres erreurs

## 🌐 Configuration pour la production

Quand vous déployez en production, remplacez toutes les URLs par vos domaines HTTPS :
- `https://votre-domaine.com/callback`
- `https://votre-domaine.com`
- `https://votre-domaine.com/sign-in`
