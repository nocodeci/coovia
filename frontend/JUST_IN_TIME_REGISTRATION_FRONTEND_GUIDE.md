# 🚀 Guide Frontend - Just-in-time Registration - Wozif

## 📋 **Vue d'ensemble**

Ce guide décrit l'intégration frontend du système de **Just-in-time registration** dans l'application React. Le système permet une expérience utilisateur fluide avec création automatique de compte et redirection intelligente.

## 🔄 **Flux d'authentification Frontend**

### **Étape 1 : Validation de l'email**
```typescript
// Dans SanctumLoginForm.tsx
const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  clearError()
  setIsNewUser(false)
  setNewUserMessage('')

  if (!email.trim()) {
    return
  }

  const result = await validateEmail(email)
  if (result.success) {
    // Vérifier si c'est un nouvel utilisateur
    if (result.isNewUser) {
      setIsNewUser(true)
      setNewUserMessage('Ce compte sera créé automatiquement')
    }
  }
}
```

**Interface utilisateur :**
- ✅ Champ email visible
- ✅ Message vert pour nouveaux utilisateurs
- ✅ Bouton "Créer un compte" au lieu de "Continuer"

### **Étape 2 : Validation du mot de passe**
```typescript
const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  clearError()

  if (!password.trim()) {
    return
  }

  const result = await validatePassword(password)
  if (result.success) {
    // Mettre à jour le message pour les nouveaux utilisateurs
    if (result.isNewUser) {
      setIsNewUser(true)
      setNewUserMessage(result.message || 'Compte créé avec succès')
    }
  }
}
```

**Interface utilisateur :**
- ✅ Champ mot de passe visible
- ✅ Message de confirmation pour nouveaux utilisateurs
- ✅ Bouton "Créer le compte" au lieu de "Continuer"

### **Étape 3 : Connexion avec OTP**
```typescript
const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  clearError()

  if (!otp.trim() || otp.length !== 6) {
    return
  }

  const result = await loginWithOtp(otp)
  if (result.success) {
    // Redirection intelligente basée sur le type d'utilisateur
    if (result.isNewUser && result.redirectTo === 'create-store') {
      // Nouvel utilisateur - rediriger vers la création de boutique
      navigate({ to: '/create-store' })
    } else {
      // Utilisateur existant - rediriger vers le dashboard
      navigate({ to: '/dashboard' })
    }
    onSuccess?.()
  }
}
```

## 🏪 **Page de création de boutique**

### **Route : `/create-store`**
```typescript
// frontend/src/features/auth/create-store/index.tsx
export default function CreateStore() {
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { user } = useSanctumAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!storeName.trim()) {
      setError('Le nom de la boutique est requis')
      setIsLoading(false)
      return
    }

    try {
      const response = await storeService.createStore({
        name: storeName,
        description,
        address,
        phone,
        website
      })

      if (response.success) {
        // Rediriger vers le dashboard après création de la boutique
        navigate({ to: '/dashboard' })
      } else {
        setError(response.message || 'Erreur lors de la création de la boutique')
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }
}
```

### **Champs du formulaire :**
- ✅ **Nom de la boutique** (requis)
- ✅ **Description** (optionnel)
- ✅ **Adresse** (optionnel)
- ✅ **Téléphone** (optionnel)
- ✅ **Site web** (optionnel)

## 🔧 **Services et Hooks**

### **Hook `useSanctumAuth`**
```typescript
// frontend/src/hooks/useSanctumAuth.ts
export interface AuthStep {
  step: 'email' | 'password' | 'otp' | 'complete';
  email?: string;
  tempToken?: string;
  otpToken?: string;
  isNewUser?: boolean; // Nouveau champ
}

// Étape 1: Validation de l'email avec Just-in-time registration
const validateEmail = async (email: string) => {
  // ... logique existante
  if (response.success) {
    setAuthStep({
      step: 'password',
      email,
      tempToken: response.temp_token,
      isNewUser: response.is_new_user || false // Nouveau champ
    });
    return { 
      success: true, 
      isNewUser: response.is_new_user || false 
    };
  }
}

// Étape 2: Validation du mot de passe avec Just-in-time registration
const validatePassword = async (password: string) => {
  // ... logique existante
  if (response.success) {
    setAuthStep({
      step: 'otp',
      email: authStep.email,
      otpToken: response.otp_token,
      isNewUser: response.is_new_user || authStep.isNewUser
    });
    return { 
      success: true, 
      isNewUser: response.is_new_user || authStep.isNewUser,
      message: response.message
    };
  }
}

// Étape 3: Connexion avec OTP et gestion des nouveaux utilisateurs
const loginWithOtp = async (otp: string) => {
  // ... logique existante
  if (response.success) {
    setAuthStep({ step: 'complete' });
    return { 
      success: true, 
      isNewUser: response.is_new_user || authStep.isNewUser,
      redirectTo: response.redirect_to || 'dashboard'
    };
  }
}
```

### **Service `storeService`**
```typescript
// frontend/src/services/storeService.ts
export interface CreateStoreData {
  name: string
  description?: string
  address?: string
  phone?: string
  website?: string
}

export interface Store {
  id: number
  name: string
  description?: string
  address?: string
  phone?: string
  website?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

class StoreService {
  private baseUrl = '/api/stores'

  // Créer une nouvelle boutique pour un utilisateur
  async createStore(data: CreateStoreData): Promise<StoreResponse> {
    try {
      const response = await apiService.post(`${this.baseUrl}/create`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la boutique')
    }
  }

  // Obtenir les informations de la boutique de l'utilisateur connecté
  async getMyStore(): Promise<StoreResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-store`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de la boutique')
    }
  }

  // Vérifier si l'utilisateur a une boutique
  async hasStore(): Promise<{ hasStore: boolean; store?: Store }> {
    try {
      const response = await apiService.get(`${this.baseUrl}/my-store`)
      return {
        hasStore: true,
        store: response.data.store
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { hasStore: false }
      }
      throw new Error('Erreur lors de la vérification de la boutique')
    }
  }
}
```

## 🎯 **Logique de redirection**

### **Nouvel utilisateur**
1. ✅ Connexion réussie
2. ✅ `isNewUser: true`
3. ✅ `redirectTo: "create-store"`
4. ✅ Redirection vers `/create-store`
5. ✅ Création de boutique
6. ✅ Redirection vers `/dashboard`

### **Utilisateur existant**
1. ✅ Connexion réussie
2. ✅ `isNewUser: false`
3. ✅ `redirectTo: "dashboard"`
4. ✅ Redirection directe vers `/dashboard`

## 🎨 **Interface utilisateur**

### **Messages pour nouveaux utilisateurs**
```tsx
{/* Messages pour nouveaux utilisateurs */}
{isNewUser && newUserMessage && (
  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
    <div className="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
        <path d="M9 12l2 2 4-4"></path>
        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
        <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
        <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
      </svg>
      <span>{newUserMessage}</span>
    </div>
  </div>
)}
```

### **Boutons adaptatifs**
```tsx
<button
  type="submit"
  disabled={isLoading}
  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs px-4 py-2 w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
>
  {isLoading ? 'Vérification...' : 
   authStep.step === 'email' ? (isNewUser ? 'Créer un compte' : 'Continuer') :
   authStep.step === 'password' ? (isNewUser ? 'Créer le compte' : 'Continuer') :
   'Se connecter'}
</button>
```

## 🛠️ **Fichiers modifiés/créés**

### **Fichiers modifiés :**
- ✅ `frontend/src/hooks/useSanctumAuth.ts` - Ajout de `isNewUser` et redirection
- ✅ `frontend/src/components/auth/SanctumLoginForm.tsx` - Interface adaptative
- ✅ `frontend/src/features/auth/sign-in/index.tsx` - Intégration du hook

### **Fichiers créés :**
- ✅ `frontend/src/features/auth/create-store/index.tsx` - Page de création de boutique
- ✅ `frontend/src/services/storeService.ts` - Service pour les boutiques
- ✅ `frontend/JUST_IN_TIME_REGISTRATION_FRONTEND_GUIDE.md` - Documentation

## 🧪 **Tests**

### **Test avec nouvel utilisateur**
1. ✅ Aller sur `/sign-in`
2. ✅ Saisir un email inexistant
3. ✅ Voir le message "Ce compte sera créé automatiquement"
4. ✅ Voir le bouton "Créer un compte"
5. ✅ Saisir un mot de passe
6. ✅ Voir le message "Compte créé avec succès"
7. ✅ Saisir l'OTP
8. ✅ Être redirigé vers `/create-store`
9. ✅ Créer une boutique
10. ✅ Être redirigé vers `/dashboard`

### **Test avec utilisateur existant**
1. ✅ Aller sur `/sign-in`
2. ✅ Saisir un email existant
3. ✅ Voir le bouton "Continuer"
4. ✅ Saisir le mot de passe
5. ✅ Saisir l'OTP
6. ✅ Être redirigé directement vers `/dashboard`

## 🎉 **Avantages de l'intégration**

### **Pour l'utilisateur**
- ✅ Expérience fluide sans interruption
- ✅ Messages clairs sur ce qui se passe
- ✅ Redirection intelligente
- ✅ Interface adaptative

### **Pour le développeur**
- ✅ Code modulaire et réutilisable
- ✅ Gestion d'état centralisée
- ✅ Services séparés par domaine
- ✅ Types TypeScript complets

### **Pour l'entreprise**
- ✅ Réduction des abandons
- ✅ Onboarding optimisé
- ✅ Conversion améliorée
- ✅ Expérience utilisateur premium

## 📚 **Ressources**

- **TanStack Router** : https://tanstack.com/router
- **React Hooks** : https://react.dev/reference/react/hooks
- **TypeScript** : https://www.typescriptlang.org/docs/

---

**L'intégration frontend du Just-in-time registration est maintenant opérationnelle !** 🚀
