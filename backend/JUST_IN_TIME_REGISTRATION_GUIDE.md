# 🚀 Guide du Just-in-time Registration - Wozif

## 📋 **Vue d'ensemble**

Le système de **Just-in-time registration** permet de créer automatiquement un compte utilisateur si l'email n'existe pas encore lors de la connexion. Cela simplifie l'expérience utilisateur en éliminant l'étape d'inscription séparée.

## 🔄 **Flux d'authentification**

### **Étape 1 : Validation de l'email**
```http
POST /api/auth/validate-email
Content-Type: application/json

{
    "email": "nouveau@exemple.com"
}
```

**Réponse pour nouvel utilisateur :**
```json
{
    "success": true,
    "message": "Email autorisé pour création de compte",
    "temp_token": "abc123...",
    "step": "email_validated",
    "is_new_user": true
}
```

**Réponse pour utilisateur existant :**
```json
{
    "success": true,
    "message": "Email validé",
    "temp_token": "abc123...",
    "step": "email_validated",
    "is_new_user": false
}
```

### **Étape 2 : Validation du mot de passe**
```http
POST /api/auth/validate-password
Content-Type: application/json

{
    "email": "nouveau@exemple.com",
    "password": "motdepasse123",
    "temp_token": "abc123..."
}
```

**Pour nouvel utilisateur :**
- ✅ Création automatique du compte
- ✅ Envoi de l'OTP par email
- ✅ Retour du token OTP

```json
{
    "success": true,
    "message": "Compte créé avec succès. Code OTP envoyé.",
    "otp_token": "xyz789...",
    "step": "password_validated",
    "is_new_user": true
}
```

**Pour utilisateur existant :**
- ✅ Vérification du mot de passe
- ✅ Envoi de l'OTP par email
- ✅ Retour du token OTP

```json
{
    "success": true,
    "message": "Mot de passe validé. Code OTP envoyé par email.",
    "otp_token": "xyz789...",
    "step": "password_validated",
    "is_new_user": false
}
```

### **Étape 3 : Connexion avec OTP**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "nouveau@exemple.com",
    "otp": "123456",
    "otp_token": "xyz789..."
}
```

**Réponse de connexion :**
```json
{
    "success": true,
    "message": "Connexion réussie",
    "token": "sanctum_token_here",
    "user": {
        "id": 1,
        "name": "Nouveau",
        "email": "nouveau@exemple.com",
        "role": "user",
        "created_at": "2025-08-11T16:00:00.000000Z",
        "updated_at": "2025-08-11T16:00:00.000000Z"
    },
    "is_new_user": true,
    "redirect_to": "create-store"
}
```

## 🏪 **Création de boutique pour nouveaux utilisateurs**

### **Route de création de boutique**
```http
POST /api/stores/create
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Ma Boutique",
    "description": "Description de ma boutique",
    "address": "123 Rue de la Paix, Paris",
    "phone": "+33123456789",
    "website": "https://maboutique.com"
}
```

**Réponse :**
```json
{
    "success": true,
    "message": "Boutique créée avec succès",
    "store": {
        "id": 1,
        "name": "Ma Boutique",
        "description": "Description de ma boutique",
        "address": "123 Rue de la Paix, Paris",
        "phone": "+33123456789",
        "website": "https://maboutique.com",
        "is_active": true,
        "created_at": "2025-08-11T16:00:00.000000Z",
        "updated_at": "2025-08-11T16:00:00.000000Z"
    },
    "user": {
        "id": 1,
        "name": "Nouveau",
        "email": "nouveau@exemple.com",
        "role": "store_owner"
    }
}
```

## 🔧 **Implémentation technique**

### **Méthode `createUserJustInTime`**
```php
/**
 * Créer un utilisateur automatiquement lors du Just-in-time registration
 * 
 * @param string $email Email de l'utilisateur
 * @param string $password Mot de passe en clair
 * @return User|null L'utilisateur créé ou null en cas d'erreur
 */
private function createUserJustInTime($email, $password)
{
    try {
        // Extraire le nom depuis l'email (partie avant @)
        $name = explode('@', $email)[0];
        
        // Créer l'utilisateur avec les informations de base
        $user = User::create([
            'name' => ucfirst($name), // Première lettre en majuscule
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'user', // Rôle par défaut
            'is_active' => true, // Actif par défaut
            'email_verified_at' => now(), // Email vérifié automatiquement
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        \Log::info("Utilisateur créé automatiquement via Just-in-time registration: {$email}");

        return $user;

    } catch (\Exception $e) {
        \Log::error("Erreur lors de la création automatique de l'utilisateur: " . $e->getMessage());
        return null;
    }
}
```

### **Modifications du contrôleur d'authentification**

#### **Étape 1 : `validateEmail`**
- ✅ Vérifie si l'utilisateur existe
- ✅ Si nouveau : autorise la création automatique
- ✅ Si existant : vérifie que le compte est actif
- ✅ Retourne `is_new_user` dans la réponse

#### **Étape 2 : `validatePassword`**
- ✅ Pour nouvel utilisateur : crée le compte automatiquement
- ✅ Pour utilisateur existant : vérifie le mot de passe
- ✅ Envoie l'OTP dans les deux cas
- ✅ Retourne `is_new_user` dans la réponse

#### **Étape 3 : `login`**
- ✅ Vérifie l'OTP
- ✅ Connecte l'utilisateur
- ✅ Retourne `is_new_user` et `redirect_to`

## 🛠️ **Routes API**

### **Authentification**
```php
// Routes publiques
Route::post('auth/validate-email', [AuthController::class, 'validateEmail']);
Route::post('auth/validate-password', [AuthController::class, 'validatePassword']);
Route::post('auth/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
});
```

### **Boutiques**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('stores')->group(function () {
        Route::post('create', [StoreController::class, 'createStore']);
        Route::get('my-store', [StoreController::class, 'getMyStore']);
        Route::put('my-store', [StoreController::class, 'updateStore']);
    });
});
```

## 🎯 **Logique de redirection**

### **Nouvel utilisateur**
1. ✅ Connexion réussie
2. ✅ `is_new_user: true`
3. ✅ `redirect_to: "create-store"`
4. ✅ Redirection vers la page de création de boutique

### **Utilisateur existant**
1. ✅ Connexion réussie
2. ✅ `is_new_user: false`
3. ✅ `redirect_to: "dashboard"`
4. ✅ Redirection vers le dashboard

## 🔒 **Sécurité**

### **Validation des données**
- ✅ Email valide requis
- ✅ Mot de passe minimum 6 caractères
- ✅ OTP exactement 6 chiffres
- ✅ Tokens temporaires avec expiration (5 minutes)

### **Gestion des erreurs**
- ✅ Token expiré ou invalide
- ✅ Mot de passe incorrect pour utilisateur existant
- ✅ OTP incorrect
- ✅ Erreurs de création de compte

### **Logs et monitoring**
- ✅ Logs de création d'utilisateur
- ✅ Logs de création de boutique
- ✅ Logs d'erreurs détaillés

## 🧪 **Tests**

### **Test avec nouvel utilisateur**
```bash
# 1. Valider email
curl -X POST http://localhost:8000/api/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "nouveau@exemple.com"}'

# 2. Valider mot de passe (création automatique)
curl -X POST http://localhost:8000/api/auth/validate-password \
  -H "Content-Type: application/json" \
  -d '{"email": "nouveau@exemple.com", "password": "motdepasse123", "temp_token": "..."}'

# 3. Connexion avec OTP
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "nouveau@exemple.com", "otp": "123456", "otp_token": "..."}'

# 4. Créer boutique
curl -X POST http://localhost:8000/api/stores/create \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Ma Boutique", "description": "Ma première boutique"}'
```

### **Test avec utilisateur existant**
```bash
# 1. Valider email
curl -X POST http://localhost:8000/api/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "existant@exemple.com"}'

# 2. Valider mot de passe
curl -X POST http://localhost:8000/api/auth/validate-password \
  -H "Content-Type: application/json" \
  -d '{"email": "existant@exemple.com", "password": "motdepasse123", "temp_token": "..."}'

# 3. Connexion avec OTP
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "existant@exemple.com", "otp": "123456", "otp_token": "..."}'
```

## 🎉 **Avantages du système**

### **Pour l'utilisateur**
- ✅ Pas d'inscription séparée
- ✅ Expérience fluide
- ✅ Création automatique de compte
- ✅ Redirection intelligente

### **Pour le développeur**
- ✅ Code clair et commenté
- ✅ Gestion d'erreurs robuste
- ✅ Logs détaillés
- ✅ Sécurité renforcée

### **Pour l'entreprise**
- ✅ Réduction des abandons
- ✅ Augmentation des conversions
- ✅ Expérience utilisateur optimisée
- ✅ Onboarding simplifié

## 📚 **Ressources**

- **Documentation Laravel Sanctum** : https://laravel.com/docs/sanctum
- **Guide d'authentification** : https://laravel.com/docs/authentication
- **Validation des données** : https://laravel.com/docs/validation

---

**Le système de Just-in-time registration est maintenant opérationnel dans Wozif !** 🚀
