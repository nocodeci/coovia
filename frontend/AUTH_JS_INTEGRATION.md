# Intégration d'Auth.js dans Wozif

Ce document explique comment Auth.js a été intégré dans votre projet Wozif pour remplacer l'authentification précédente.

## 🚀 Installation

Les packages suivants ont été installés :

```bash
npm install @auth/core @auth/nextjs jose @panva/hkdf
```

## 📁 Structure des fichiers

### Configuration principale
- `src/lib/auth.ts` - Configuration principale d'Auth.js
- `src/config/env.ts` - Variables d'environnement
- `src/types/auth.ts` - Types TypeScript pour l'authentification

### Composants d'authentification
- `src/components/auth/auth-form.tsx` - Formulaire de connexion
- `src/components/auth/protected-route-auth.tsx` - Protection des routes
- `src/components/auth/user-nav.tsx` - Navigation utilisateur
- `src/components/providers/session-provider.tsx` - Provider de session

### Hooks et utilitaires
- `src/hooks/useAuth.ts` - Hook personnalisé pour l'authentification
- `src/pages/sign-in.tsx` - Page de connexion

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` dans le dossier `frontend/` :

```env
# Configuration de l'API
VITE_API_URL=http://localhost:8000

# Configuration Auth.js
VITE_AUTH_SECRET=your-super-secret-key-here-change-in-production
VITE_AUTH_URL=http://localhost:5173

# Configuration de l'application
VITE_APP_NAME=Wozif
VITE_APP_VERSION=1.0.0
```

### Intégration dans l'application

Wrap votre application avec le `SessionProvider` dans votre composant racine :

```tsx
import { SessionProvider } from '@/components/providers/session-provider'

function App() {
  return (
    <SessionProvider>
      {/* Votre application */}
    </SessionProvider>
  )
}
```

## 🎯 Utilisation

### Hook useAuth

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>
  }

  return (
    <div>
      <h1>Bienvenue {user?.name}</h1>
      {isAdmin() && <AdminPanel />}
      <button onClick={logout}>Se déconnecter</button>
    </div>
  )
}
```

### Protection des routes

```tsx
import { ProtectedRouteAuth } from '@/components/auth/protected-route-auth'

function AdminPage() {
  return (
    <ProtectedRouteAuth requiredRole="admin">
      <div>Contenu administrateur</div>
    </ProtectedRouteAuth>
  )
}
```

### HOC avecAuth

```tsx
import { withAuth } from '@/components/auth/protected-route-auth'

const ProtectedComponent = withAuth(MyComponent, 'admin')
```

## 🔐 Fonctionnalités

- **Authentification par credentials** (email/mot de passe)
- **Gestion des rôles** (admin, vendor, customer)
- **Protection des routes** avec vérification des permissions
- **Gestion des sessions** avec JWT
- **Interface utilisateur moderne** et responsive
- **Intégration avec votre API backend** existante

## 🌐 API Backend

L'authentification se connecte à votre API backend Laravel via l'endpoint :

```
POST /api/auth/login
```

Format de la réponse attendue :

```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "jwt-token-here",
  "refresh_token": "refresh-token-here"
}
```

## 🚨 Sécurité

- **Secret JWT** : Changez `VITE_AUTH_SECRET` en production
- **HTTPS** : Utilisez HTTPS en production
- **Validation** : Toutes les entrées sont validées avec Zod
- **Gestion des erreurs** : Gestion sécurisée des erreurs d'authentification

## 🔄 Migration depuis l'ancien système

1. **Remplacez** `useAuth` de l'ancien contexte par le nouveau hook
2. **Mettez à jour** les composants de protection des routes
3. **Adaptez** les composants de navigation utilisateur
4. **Testez** l'authentification sur toutes les pages protégées

## 📚 Ressources

- [Documentation officielle Auth.js](https://authjs.dev/)
- [Guide de migration NextAuth → Auth.js](https://authjs.dev/getting-started/migrate)
- [Configuration des providers](https://authjs.dev/reference/core/providers)

## 🐛 Dépannage

### Erreur de session
- Vérifiez que `VITE_AUTH_SECRET` est défini
- Assurez-vous que l'API backend répond correctement

### Problèmes de redirection
- Vérifiez la configuration des pages dans `authConfig`
- Assurez-vous que les routes existent dans votre application

### Erreurs de types TypeScript
- Vérifiez que `@auth/core/types` est correctement importé
- Assurez-vous que les types sont étendus correctement
