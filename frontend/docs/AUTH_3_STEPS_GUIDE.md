# 🔐 Système d'Authentification en 3 Étapes - Guide Complet

## 📋 Vue d'ensemble

Votre application utilise maintenant un système d'authentification sécurisé en **3 étapes** :

1. **Étape 1** : Validation de l'email → Vérification que l'email existe
2. **Étape 2** : Validation du mot de passe → Vérification des credentials  
3. **Étape 3** : Code OTP → Vérification du code envoyé par email

## 🚀 Fonctionnalités

### ✅ **Sécurité renforcée**
- Validation progressive des informations
- Code OTP à 6 chiffres
- Tokens temporaires pour chaque étape
- Expiration automatique (5 minutes)

### ✅ **Expérience utilisateur optimisée**
- Interface intuitive avec indicateur de progression
- Messages d'erreur clairs
- Navigation entre les étapes
- Validation en temps réel

### ✅ **Compatibilité**
- Mode legacy pour l'inscription
- Support Auth0 en parallèle
- Tokens Sanctum pour l'API

## 🔧 Configuration Backend

### **Routes API**

```php
// routes/api.php
Route::prefix('auth')->middleware(\App\Http\Middleware\Cors::class)->group(function () {
    // Nouvelles routes pour l'authentification en 3 étapes
    Route::post('validate-email', [AuthController::class, 'validateEmail']);
    Route::post('validate-password', [AuthController::class, 'validatePassword']);
    
    // Routes existantes
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::get('check', [AuthController::class, 'checkAuth']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all', [AuthController::class, 'logoutAll']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});
```

### **Contrôleur d'Authentification**

Le `AuthController` a été modifié pour supporter les 3 étapes :

```php
// Étape 1: Validation de l'email
public function validateEmail(Request $request)
{
    // Vérifie que l'email existe et est actif
    // Génère un token temporaire pour l'étape suivante
}

// Étape 2: Validation du mot de passe
public function validatePassword(Request $request)
{
    // Vérifie le mot de passe
    // Génère et envoie l'OTP par email
    // Crée un token OTP pour l'étape finale
}

// Étape 3: Connexion avec OTP
public function login(Request $request)
{
    // Vérifie l'OTP
    // Génère le token Sanctum final
    // Retourne les informations utilisateur
}
```

## 🎨 Interface Frontend

### **Composant Principal**

Le `SanctumLoginForm` gère maintenant les 3 étapes :

```tsx
// Étape 1: Email
{authStep.step === 'email' && (
  <form onSubmit={handleEmailSubmit}>
    <input type="email" value={email} onChange={...} />
    <button type="submit">Continuer</button>
  </form>
)}

// Étape 2: Mot de passe
{authStep.step === 'password' && (
  <form onSubmit={handlePasswordSubmit}>
    <div>Email: {authStep.email}</div>
    <input type="password" value={password} onChange={...} />
    <button type="button" onClick={handleBackToEmail}>Retour</button>
    <button type="submit">Continuer</button>
  </form>
)}

// Étape 3: OTP
{authStep.step === 'otp' && (
  <form onSubmit={handleOtpSubmit}>
    <div>Email: {authStep.email}</div>
    <input type="text" value={otp} onChange={...} maxLength={6} />
    <button type="button" onClick={handleBackToPassword}>Retour</button>
    <button type="submit">Se connecter</button>
  </form>
)}
```

### **Indicateur de Progression**

```tsx
<div className="flex items-center justify-center space-x-2">
  <div className={`w-3 h-3 rounded-full ${authStep.step === 'email' ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
  <div className={`w-3 h-3 rounded-full ${authStep.step === 'password' ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
  <div className={`w-3 h-3 rounded-full ${authStep.step === 'otp' ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
</div>
```

## 🔄 Flux d'Authentification

### **1. Validation Email**
```typescript
const result = await validateEmail(email)
if (result.success) {
  // Passe automatiquement à l'étape mot de passe
  // authStep.step devient 'password'
}
```

### **2. Validation Mot de Passe**
```typescript
const result = await validatePassword(password)
if (result.success) {
  // Passe automatiquement à l'étape OTP
  // authStep.step devient 'otp'
  // L'OTP est envoyé par email
}
```

### **3. Connexion OTP**
```typescript
const result = await loginWithOtp(otp)
if (result.success) {
  // Connexion réussie
  // Token Sanctum généré
  // Redirection vers le dashboard
}
```

## 📧 Gestion des OTP

### **En Développement**
Les OTP sont affichés dans les logs Laravel :
```bash
tail -f storage/logs/laravel.log
# [2025-08-11 03:51:43] local.INFO: OTP pour test@example.com: 419575
```

### **En Production**
Les OTP seront envoyés par email (à configurer) :
```php
// Dans AuthController::generateAndSendOtp()
if (app()->environment('local')) {
    \Log::info("OTP pour {$user->email}: {$otp}");
} else {
    Mail::to($user->email)->send(new OtpMail($otp));
}
```

## 🧪 Tests API

### **Test Étape 1 - Validation Email**
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"test@example.com"}' \
  http://localhost:8000/api/auth/validate-email
```

**Réponse :**
```json
{
  "success": true,
  "message": "Email validé",
  "temp_token": "SA5j0BESvxjMo5DJ8CjkNxl7bBZOwajf",
  "step": "email_validated"
}
```

### **Test Étape 2 - Validation Mot de Passe**
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"test@example.com","password":"password","temp_token":"SA5j0BESvxjMo5DJ8CjkNxl7bBZOwajf"}' \
  http://localhost:8000/api/auth/validate-password
```

**Réponse :**
```json
{
  "success": true,
  "message": "Mot de passe validé. Code OTP envoyé par email.",
  "otp_token": "3RX8vUL02FnFpqhRbPyYcsSMOKjd9YEv",
  "step": "password_validated"
}
```

### **Test Étape 3 - Connexion OTP**
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"test@example.com","otp":"419575","otp_token":"3RX8vUL02FnFpqhRbPyYcsSMOKjd9YEv"}' \
  http://localhost:8000/api/auth/login
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "39|6eCzUR7Oec4lgWfsxw0ChSP13OOqFyOLzo79s9dn3284f5e8",
  "user": {
    "id": "01985945-ce42-7273-9b96-929cbb7974a2",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "created_at": "2025-07-30T03:00:03.000000Z",
    "updated_at": "2025-08-11T03:51:55.000000Z"
  }
}
```

## 🔒 Sécurité

### **Tokens Temporaires**
- **Email Token** : 5 minutes d'expiration
- **OTP Token** : 5 minutes d'expiration
- **OTP Code** : 6 chiffres aléatoires

### **Validation**
- Chaque étape valide les données de l'étape précédente
- Les tokens sont supprimés après utilisation
- Protection contre les attaques par force brute

### **CORS**
- Configuration sécurisée pour les requêtes cross-origin
- Support des credentials pour Sanctum

## 🚀 Utilisation

### **Pour les Utilisateurs**
1. Entrez votre email
2. Entrez votre mot de passe
3. Entrez le code reçu par email
4. Accédez à votre compte

### **Pour les Développeurs**
1. Le système est automatiquement activé
2. Compatible avec l'ancien système d'inscription
3. Support Auth0 en parallèle
4. Tokens Sanctum pour l'API

## 🔧 Configuration Avancée

### **Personnalisation des Messages**
Modifiez les messages dans `AuthController.php` :
```php
return response()->json([
    'success' => false,
    'message' => 'Votre message personnalisé'
], 422);
```

### **Modification de l'Expiration**
Changez la durée dans `AuthController.php` :
```php
Cache::put($cacheKey, $user->email, 300); // 5 minutes
```

### **Configuration Email**
Pour la production, configurez l'envoi d'emails dans `.env` :
```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

## ✅ Statut Actuel

- ✅ **Backend** : Implémenté et testé
- ✅ **Frontend** : Interface en 3 étapes
- ✅ **API** : Routes fonctionnelles
- ✅ **Sécurité** : Tokens temporaires
- ✅ **Tests** : Validation complète
- ✅ **Documentation** : Guide complet

Le système d'authentification en 3 étapes est **prêt à l'emploi** ! 🎉
