# 🔐 Intégration Laravel Sanctum - Guide d'utilisation

Ce dossier contient l'intégration complète de Laravel Sanctum pour l'authentification dans votre application React.

## 📁 Structure des fichiers

```
features/auth/
├── components/          # Composants d'interface utilisateur
│   ├── LoginForm.tsx   # Formulaire de connexion
│   ├── RegisterForm.tsx # Formulaire d'inscription
│   ├── AuthGuard.tsx   # Protection des routes
│   └── AuthNavbar.tsx  # Barre de navigation avec état d'auth
├── hooks/              # Hooks React personnalisés
│   └── useAuth.ts      # Hook principal d'authentification
├── pages/              # Pages d'authentification
│   └── LoginPage.tsx   # Page de connexion/inscription
├── services/           # Services d'API
│   └── sanctum.ts      # Service principal Sanctum
├── config/             # Configuration
│   └── api.ts          # Configuration de l'API
└── index.ts            # Export centralisé
```

## 🚀 Utilisation rapide

### 1. Importer les composants

```tsx
import { 
  useAuth, 
  LoginForm, 
  RegisterForm, 
  AuthGuard,
  RequireAuth,
  RequireGuest 
} from '@/features/auth';
```

### 2. Utiliser le hook useAuth

```tsx
function MonComposant() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bonjour {user?.name} !</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </div>
  );
}
```

### 3. Protéger les routes

```tsx
// Route protégée (connexion requise)
<RequireAuth>
  <DashboardPage />
</RequireAuth>

// Route pour invités uniquement
<RequireGuest>
  <LoginPage />
</RequireGuest>

// Route avec rôle spécifique
<RequireRole roles={['admin']}>
  <AdminPanel />
</RequireRole>
```

### 4. Utiliser la barre de navigation

```tsx
import { AuthNavbar } from '@/features/auth';

function Layout() {
  return (
    <div>
      <AuthNavbar />
      <main>{children}</main>
    </div>
  );
}
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` dans le dossier `frontend/` :

```bash
VITE_API_URL=http://localhost:8000/api
VITE_SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
```

### Configuration du backend Laravel

Assurez-vous que votre backend Laravel a :

1. **Sanctum installé et configuré**
2. **Les routes d'API configurées** dans `routes/api.php`
3. **La configuration CORS appropriée** pour permettre les requêtes depuis votre frontend
4. **Les domaines stateful configurés** dans `config/sanctum.php`

## 🔧 Personnalisation

### Styling

Tous les composants utilisent Tailwind CSS. Vous pouvez personnaliser les classes CSS selon vos besoins.

### Messages d'erreur

Modifiez les messages dans `config/api.ts` ou personnalisez la gestion d'erreurs dans les composants.

### Redirection

Par défaut, après connexion/inscription réussie, l'utilisateur est redirigé vers `/dashboard`. Modifiez ce comportement dans `LoginPage.tsx`.

## 🐛 Dépannage

### Erreurs CORS

- Vérifiez que `VITE_API_URL` pointe vers la bonne URL de votre API
- Assurez-vous que votre backend Laravel autorise les requêtes depuis votre frontend
- Vérifiez la configuration des domaines stateful dans Sanctum

### Tokens expirés

- Les tokens sont automatiquement gérés par le service Sanctum
- En cas d'erreur 401, l'utilisateur est automatiquement redirigé vers la page de connexion

### Problèmes de session

- Vérifiez que `withCredentials: true` est configuré (déjà fait dans le service)
- Assurez-vous que votre backend gère correctement les cookies de session

## 📱 Composants disponibles

- **`LoginForm`** : Formulaire de connexion avec validation
- **`RegisterForm`** : Formulaire d'inscription avec validation
- **`AuthGuard`** : Protection des routes flexible
- **`RequireAuth`** : Exige l'authentification
- **`RequireGuest`** : Exige d'être non connecté
- **`RequireRole`** : Exige un rôle spécifique
- **`AuthNavbar`** : Barre de navigation dynamique
- **`LoginPage`** : Page complète de connexion/inscription

## 🔒 Sécurité

- Tokens stockés dans `localStorage` (vous pouvez changer pour `sessionStorage` si nécessaire)
- Validation côté client et côté serveur
- Gestion automatique des erreurs d'authentification
- Protection CSRF via les cookies Sanctum

## 📚 Ressources supplémentaires

- [Documentation Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Guide CORS Laravel](https://laravel.com/docs/cors)
- [Documentation Axios](https://axios-http.com/)
