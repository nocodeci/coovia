# Guide d'utilisation Sanctum - Pages Sign-up et Sign-in

Ce guide explique comment utiliser l'intégration Laravel Sanctum dans vos pages d'authentification.

## 🚀 Vue d'ensemble

L'intégration Sanctum a été complètement intégrée dans vos pages sign-up et sign-in avec les fonctionnalités suivantes :

- ✅ **Page Sign-up** (`/sign-up`) - Inscription d'utilisateurs
- ✅ **Page Sign-in** (`/sign-in`) - Connexion d'utilisateurs  
- ✅ **Page Login** (`/login`) - Page de connexion alternative
- ✅ **Protection des routes** - Sécurisation des pages privées
- ✅ **Navigation intelligente** - Redirection automatique
- ✅ **Gestion des erreurs** - Messages d'erreur clairs
- ✅ **Validation en temps réel** - Feedback utilisateur

## 📁 Structure des fichiers

```
src/
├── pages/
│   ├── sign-up.tsx              # Page d'inscription Sanctum
│   ├── sign-in.tsx              # Page de connexion Sanctum
│   └── login.tsx                # Page de connexion alternative
├── components/auth/
│   ├── SanctumLoginForm.tsx     # Formulaire de connexion/inscription
│   ├── SanctumRegisterForm.tsx  # Formulaire d'inscription dédié
│   ├── SanctumAuthNavbar.tsx    # Navigation avec authentification
│   ├── SanctumRouteGuard.tsx    # Protection des routes
│   └── AuthSelector.tsx         # Sélecteur de méthode d'auth
├── hooks/
│   └── useSanctumAuth.ts        # Hook d'authentification Sanctum
├── services/
│   └── sanctumAuth.ts           # Service API Sanctum
└── stores/
    └── authStore.ts             # Store d'état d'authentification
```

## 🔧 Configuration

### 1. Variables d'environnement

Assurez-vous que votre fichier `.env.local` contient :

```bash
# Configuration API
VITE_API_URL=http://localhost:8000/api

# Configuration Sanctum
VITE_SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173,localhost:8000
```

### 2. Configuration backend Laravel

Vérifiez que votre backend Laravel a Sanctum configuré dans `config/sanctum.php` :

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,127.0.0.1:5173,::1',
    Sanctum::currentApplicationUrlWithPort(),
    env('FRONTEND_URL') ? ','.env('FRONTEND_URL') : ''
))),
```

## 🎯 Utilisation

### 1. Pages d'authentification

#### Page Sign-up (`/sign-up`)
```tsx
// Accès direct à l'URL /sign-up
// Utilise SanctumRegisterForm pour l'inscription
// Redirection automatique vers /dashboard après inscription réussie
```

#### Page Sign-in (`/sign-in`)
```tsx
// Accès direct à l'URL /sign-in  
// Utilise SanctumLoginForm pour la connexion
// Redirection automatique vers /dashboard après connexion réussie
```

#### Page Login (`/login`)
```tsx
// Accès direct à l'URL /login
// Page de connexion alternative avec SanctumLoginForm
// Redirection automatique vers /dashboard après connexion réussie
```

### 2. Protection des routes

Utilisez les composants de protection pour sécuriser vos pages :

```tsx
import { RequireAuth, RequireGuest, RequireAdmin } from '@/components/auth/SanctumRouteGuard'

// Page privée (authentification requise)
<RequireAuth>
  <Dashboard />
</RequireAuth>

// Page publique (pas d'authentification)
<RequireGuest>
  <SignInPage />
</RequireGuest>

// Page admin (rôle admin requis)
<RequireAdmin>
  <AdminPanel />
</RequireAdmin>

// Page avec rôle spécifique
<RequireRole role="manager">
  <ManagerPanel />
</RequireRole>
```

### 3. Navigation avec authentification

Utilisez le composant de navigation qui s'adapte à l'état d'authentification :

```tsx
import { SanctumAuthNavbar } from '@/components/auth/SanctumAuthNavbar'

function Header() {
  return (
    <header>
      <SanctumAuthNavbar />
    </header>
  )
}
```

### 4. Hook d'authentification

Utilisez le hook `useSanctumAuth` dans vos composants :

```tsx
import { useSanctumAuth } from '@/hooks/useSanctumAuth'

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout 
  } = useSanctumAuth()

  if (isLoading) return <div>Chargement...</div>
  
  if (!isAuthenticated) return <div>Veuillez vous connecter</div>

  return (
    <div>
      <h1>Bonjour {user?.name}!</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  )
}
```

## 🔄 Flux d'authentification

### Inscription (Sign-up)
1. Utilisateur accède à `/sign-up`
2. Remplit le formulaire d'inscription
3. Validation côté client en temps réel
4. Envoi des données à l'API Sanctum
5. Création du compte et connexion automatique
6. Redirection vers `/dashboard`

### Connexion (Sign-in)
1. Utilisateur accède à `/sign-in`
2. Remplit le formulaire de connexion
3. Envoi des identifiants à l'API Sanctum
4. Vérification et génération du token
5. Stockage du token et des données utilisateur
6. Redirection vers `/dashboard`

### Déconnexion
1. Appel de la fonction `logout()`
2. Suppression du token côté serveur
3. Nettoyage du localStorage
4. Redirection vers la page d'accueil

## 🛡️ Sécurité

### Protection CSRF
- Tokens CSRF automatiquement gérés
- Protection contre les attaques CSRF

### Gestion des tokens
- Stockage sécurisé dans localStorage
- Rafraîchissement automatique des tokens
- Suppression automatique des tokens expirés

### Validation
- Validation côté client en temps réel
- Validation côté serveur
- Messages d'erreur clairs et localisés

## 🎨 Interface utilisateur

### Design responsive
- Interface adaptée mobile et desktop
- Composants UI cohérents
- Animations et transitions fluides

### États de chargement
- Indicateurs de chargement
- Désactivation des boutons pendant les requêtes
- Feedback visuel pour les actions

### Gestion des erreurs
- Messages d'erreur contextuels
- Validation en temps réel
- Suggestions de correction

## 🔧 Personnalisation

### Thèmes et couleurs
Les composants utilisent les classes Tailwind CSS et peuvent être personnalisés :

```tsx
// Personnalisation des couleurs
<SanctumLoginForm 
  className="custom-login-form"
  buttonClassName="bg-custom-primary hover:bg-custom-primary-dark"
/>
```

### Messages et textes
Tous les textes peuvent être personnalisés via les props :

```tsx
<SanctumRegisterForm 
  title="Créer votre compte"
  description="Rejoignez notre communauté"
  submitText="S'inscrire"
/>
```

## 🐛 Dépannage

### Erreurs CORS
```bash
# Vérifiez la configuration backend
php artisan config:cache
php artisan route:cache

# Vérifiez les variables d'environnement
VITE_API_URL=http://localhost:8000/api
VITE_SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

### Tokens expirés
- Les tokens expirés sont automatiquement détectés
- Redirection automatique vers la page de connexion
- Nettoyage automatique du localStorage

### Problèmes de session
- Vérifiez que `withCredentials: true` est configuré
- Assurez-vous que les cookies sont bien envoyés
- Vérifiez la configuration CSRF de Laravel

## 📚 Exemples d'utilisation

### Page de tableau de bord protégée
```tsx
import { RequireAuth } from '@/components/auth/SanctumRouteGuard'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'

function Dashboard() {
  const { user, logout } = useSanctumAuth()

  return (
    <RequireAuth>
      <div>
        <h1>Tableau de bord</h1>
        <p>Bienvenue {user?.name}</p>
        <button onClick={logout}>Déconnexion</button>
      </div>
    </RequireAuth>
  )
}
```

### Navigation conditionnelle
```tsx
import { SanctumAuthNavbar } from '@/components/auth/SanctumAuthNavbar'

function App() {
  return (
    <div>
      <header>
        <SanctumAuthNavbar />
      </header>
      <main>
        {/* Contenu de votre application */}
      </main>
    </div>
  )
}
```

## 🚀 Prochaines étapes

1. **Testez l'intégration** - Vérifiez que tout fonctionne correctement
2. **Personnalisez l'interface** - Adaptez les couleurs et le design à votre marque
3. **Ajoutez des fonctionnalités** - Intégrez MFA, récupération de mot de passe, etc.
4. **Optimisez les performances** - Mettez en cache les données utilisateur
5. **Sécurisez davantage** - Ajoutez des logs de sécurité, rate limiting, etc.

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la configuration de votre backend Laravel
2. Consultez les logs de votre navigateur
3. Vérifiez la configuration CORS
4. Assurez-vous que Sanctum est bien installé et configuré

L'intégration Sanctum est maintenant complètement fonctionnelle dans vos pages sign-up et sign-in ! 🎉
