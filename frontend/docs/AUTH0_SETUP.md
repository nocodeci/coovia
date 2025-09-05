# Configuration Auth0 pour Wozif

## Clés de configuration

Vos clés Auth0 ont été configurées dans le projet :

- **Domaine** : `dev-elezzy7xq17fr6kp.us.auth0.com`
- **Client ID** : `HqZNyzT3rz6Q6IuPxG44EusLo7tou4SQ`
- **Client Secret** : `GJuJcYYEHIw9xwLCn_RUV1B6QTvG2mgUgf9aECPJs4zhcBWsJ0UpK1ZPLFeK6wu8`
- **Nom de l'application** : `Wozif`

## Fichiers de configuration

### 1. `src/config/auth0-keys.ts`
Contient toutes les clés Auth0 et la configuration de base.

### 2. `src/config/auth0.config.ts`
Configuration étendue avec les permissions et rôles.

### 3. `src/context/auth0-context.tsx`
Contexte React pour gérer l'authentification Auth0.

## Configuration Auth0 Dashboard

Dans votre dashboard Auth0, assurez-vous de configurer :

### URLs autorisées
- **Allowed Callback URLs** : `http://localhost:3000, http://localhost:3000/callback`
- **Allowed Logout URLs** : `http://localhost:3000`
- **Allowed Web Origins** : `http://localhost:3000`

### Application Type
- **Application Type** : Single Page Application (SPA)

### APIs
- **API Audience** : `https://api.coovia.com`
- **Scopes** : `openid profile email read:stores write:stores read:products write:products`

## Test de l'authentification

1. Démarrez votre application frontend
2. Naviguez vers la page de connexion
3. Cliquez sur "Se connecter avec Auth0"
4. Vous devriez être redirigé vers Auth0 pour l'authentification

## Sécurité

⚠️ **Important** : En production, ces clés doivent être stockées dans des variables d'environnement sécurisées, pas dans le code source.

## Dépannage

Si vous rencontrez des problèmes :

1. Vérifiez que les URLs sont correctement configurées dans Auth0
2. Assurez-vous que l'API audience correspond à votre backend
3. Vérifiez les scopes autorisés
4. Consultez la console du navigateur pour les erreurs
