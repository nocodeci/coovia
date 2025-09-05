# Intégration Laravel Sanctum

Ce document explique comment utiliser l'intégration Laravel Sanctum dans votre application frontend React.

## Vue d'ensemble

L'intégration Sanctum fournit une authentification complète avec :
- Connexion/inscription d'utilisateurs
- Gestion des tokens d'authentification
- Protection des routes
- Gestion des rôles et permissions
- Composants d'interface utilisateur prêts à l'emploi

## Structure des fichiers

```
src/
├── services/
│   └── sanctum.ts          # Service principal Sanctum
├── hooks/
│   └── useAuth.ts          # Hook React pour l'authentification
├── components/
│   └── auth/
│       ├── LoginForm.tsx   # Formulaire de connexion
│       ├── RegisterForm.tsx # Formulaire d'inscription
│       ├── AuthGuard.tsx   # Protection des routes
│       └── AuthNavbar.tsx  # Barre de navigation avec auth
├── pages/
│   └── LoginPage.tsx       # Page de connexion complète
└── config/
    └── api.ts              # Configuration de l'API
```

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` dans le dossier `frontend/` :

```bash
VITE_API_URL=http://localhost:8000/api
VITE_SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

### 2. Configuration du backend Laravel

Assurez-vous que votre backend Laravel a Sanctum configuré dans `config/sanctum.php` :

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,127.0.0.1:5173,::1',
    Sanctum::currentApplicationUrlWithPort(),
    env('FRONTEND_URL') ? ','.env('FRONTEND_URL') : ''
))),
```

## Utilisation

### 1. Hook useAuth

Le hook `useAuth` fournit toutes les fonctionnalités d'authentification :

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout 
  } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  
  if (!isAuthenticated) return <div>Veuillez vous connecter</div>;

  return (
    <div>
      <h1>Bonjour {user?.name}!</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### 2. Protection des routes

Utilisez les composants de protection pour sécuriser vos routes :

```tsx
import { RequireAuth, RequireAdmin } from '../components/auth/AuthGuard';

// Route protégée (authentification requise)
<RequireAuth>
  <Dashboard />
</RequireAuth>

// Route protégée avec rôle spécifique
<RequireAdmin>
  <AdminPanel />
</RequireAdmin>

// Route publique (pas d'authentification)
<RequireGuest>
  <LoginPage />
</RequireGuest>
```

### 3. Composants d'authentification

#### LoginForm

```tsx
import { LoginForm } from '../components/auth/LoginForm';

<LoginForm
  onSuccess={() => console.log('Connexion réussie!')}
  onSwitchToRegister={() => setMode('register')}
/>
```

#### RegisterForm

```tsx
import { RegisterForm } from '../components/auth/RegisterForm';

<RegisterForm
  onSuccess={() => console.log('Inscription réussie!')}
  onSwitchToLogin={() => setMode('login')}
/>
```

### 4. Service Sanctum

Pour des opérations avancées, utilisez directement le service :

```tsx
import { sanctumService } from '../services/sanctum';

// Vérifier l'authentification
const isAuth = sanctumService.isAuthenticated();

// Obtenir l'utilisateur actuel
const user = await sanctumService.me();

// Rafraîchir le token
await sanctumService.refresh();
```

## Fonctionnalités

### Authentification
- ✅ Connexion avec email/mot de passe
- ✅ Inscription d'utilisateur
- ✅ Déconnexion
- ✅ Vérification d'authentification
- ✅ Rafraîchissement automatique des tokens

### Gestion des erreurs
- ✅ Validation des formulaires
- ✅ Gestion des erreurs d'API
- ✅ Messages d'erreur localisés
- ✅ Redirection automatique en cas d'échec

### Sécurité
- ✅ Protection CSRF
- ✅ Tokens d'authentification sécurisés
- ✅ Gestion des sessions
- ✅ Protection des routes sensibles

### Interface utilisateur
- ✅ Formulaires responsifs
- ✅ Indicateurs de chargement
- ✅ Gestion des états d'erreur
- ✅ Navigation conditionnelle

## API Endpoints

L'intégration utilise les endpoints suivants de votre API Laravel :

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur
- `GET /api/auth/check` - Vérification d'authentification
- `POST /api/auth/refresh` - Rafraîchissement du token

## Gestion des tokens

Les tokens Sanctum sont automatiquement :
- Stockés dans le localStorage
- Ajoutés aux en-têtes des requêtes API
- rafraîchis automatiquement
- supprimés lors de la déconnexion

## Exemples d'utilisation

### Page de tableau de bord protégée

```tsx
import { RequireAuth } from '../components/auth/AuthGuard';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <RequireAuth>
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue {user?.name}</p>
        <button onClick={logout}>Déconnexion</button>
      </div>
    </RequireAuth>
  );
}
```

### Navigation conditionnelle

```tsx
import { AuthNavbar } from '../components/auth/AuthNavbar';

function App() {
  return (
    <div>
      <AuthNavbar />
      {/* Reste de votre application */}
    </div>
  );
}
```

## Dépannage

### Erreurs CORS

Si vous rencontrez des erreurs CORS, vérifiez :

1. La configuration `stateful` dans `config/sanctum.php`
2. Les variables d'environnement `SANCTUM_STATEFUL_DOMAINS`
3. La configuration de votre serveur web (Apache/Nginx)

### Tokens expirés

Les tokens expirés sont automatiquement gérés :
- Détection automatique des erreurs 401
- Suppression du token expiré
- Redirection vers la page de connexion

### Problèmes de session

Pour les problèmes de session :
- Vérifiez que `withCredentials: true` est configuré
- Assurez-vous que les cookies sont bien envoyés
- Vérifiez la configuration CSRF de Laravel

## Support

Pour toute question ou problème :
1. Vérifiez la configuration de votre backend Laravel
2. Consultez les logs de votre navigateur
3. Vérifiez la configuration CORS
4. Assurez-vous que Sanctum est bien installé et configuré
