# 🔐 Configuration Backend Laravel - Authentification MFA

## 📋 Vue d'ensemble

Ce guide vous explique comment configurer le backend Laravel pour supporter le nouveau système d'authentification MFA en deux étapes :

1. **Validation de l'email** → Vérification que l'email existe
2. **Validation du mot de passe** → Vérification des credentials
3. **Validation de l'OTP** → Code à 6 chiffres envoyé par email
4. **Connexion finale** → Génération du token JWT

## 🚀 Routes API à implémenter

### 1. **Validation de l'email** - `POST /api/auth/validate-email`

```php
// routes/api.php
Route::post('/auth/validate-email', [AuthController::class, 'validateEmail']);
```

**Request :**
```json
{
  "email": "user@example.com"
}
```

**Response :**
```json
{
  "success": true,
  "message": "Email validé"
}
```

### 2. **Validation du mot de passe** - `POST /api/auth/validate-password`

```php
// routes/api.php
Route::post('/auth/validate-password', [AuthController::class, 'validatePassword']);
```

**Request :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response :**
```json
{
  "success": true,
  "message": "Mot de passe validé"
}
```

### 3. **Connexion avec OTP** - `POST /api/auth/login`

```php
// routes/api.php
Route::post('/auth/login', [AuthController::class, 'login']);
```

**Request :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "otp": "123456"
}
```

**Response :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. **Déconnexion** - `POST /api/auth/logout`

```php
// routes/api.php
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
```

**Response :**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### 5. **Vérification de l'authentification** - `GET /api/auth/me`

```php
// routes/api.php
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
```

**Response :**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 🏗️ Structure du contrôleur

### **AuthController.php**

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Valider l'email de l'utilisateur
     */
    public function validateEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email invalide'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun compte trouvé avec cet email'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Email validé'
        ]);
    }

    /**
     * Valider le mot de passe de l'utilisateur
     */
    public function validatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Générer et envoyer l'OTP par email
        $otp = $this->generateAndSendOtp($user);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe validé'
        ]);
    }

    /**
     * Connexion avec validation OTP
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'otp' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Valider l'OTP
        if (!$this->validateOtp($user, $request->otp)) {
            return response()->json([
                'success' => false,
                'message' => 'Code OTP invalide ou expiré'
            ], 401);
        }

        // Générer le token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Générer et envoyer l'OTP par email
     */
    private function generateAndSendOtp(User $user)
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Stocker l'OTP en base (avec expiration)
        $user->update([
            'otp_code' => Hash::make($otp),
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        // Envoyer l'OTP par email
        Mail::to($user->email)->send(new OtpMail($otp));

        return $otp;
    }

    /**
     * Valider l'OTP
     */
    private function validateOtp(User $user, string $otp): bool
    {
        if (!$user->otp_code || !$user->otp_expires_at) {
            return false;
        }

        if (now()->isAfter($user->otp_expires_at)) {
            return false;
        }

        if (!Hash::check($otp, $user->otp_code)) {
            return false;
        }

        // Nettoyer l'OTP après utilisation
        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null
        ]);

        return true;
    }
}
```

## 📧 Configuration Email

### **Créer le Mailable pour l'OTP**

```bash
php artisan make:mail OtpMail
```

### **OtpMail.php**

```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function build()
    {
        return $this->markdown('emails.otp')
                    ->subject('Code de vérification Wozif');
    }
}
```

### **Template Email** - `resources/views/emails/otp.blade.php`

```blade
@component('mail::message')
# Code de vérification Wozif

Votre code de vérification est : **{{ $otp }}**

Ce code expire dans 10 minutes.

Si vous n'avez pas demandé ce code, ignorez cet email.

Merci,<br>
{{ config('app.name') }}
@endcomponent
```

## 🗄️ Migration de base de données

### **Ajouter les colonnes OTP à la table users**

```bash
php artisan make:migration add_otp_fields_to_users_table
```

### **Migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp_code')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['otp_code', 'otp_expires_at']);
        });
    }
};
```

## ⚙️ Configuration Sanctum

### **Installer Sanctum**

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### **Configurer le middleware dans `app/Http/Kernel.php`**

```php
protected $middlewareGroups = [
    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

### **Configurer CORS dans `config/cors.php`**

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 🔧 Variables d'environnement

### **`.env`**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@wozif.com"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

## 🧪 Tests

### **Tester l'API**

```bash
# 1. Valider l'email
curl -X POST http://localhost:8001/api/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 2. Valider le mot de passe
curl -X POST http://localhost:8001/api/auth/validate-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 3. Se connecter avec l'OTP
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "otp": "123456"}'
```

## 🚨 Points importants

1. **Sécurité** : L'OTP expire après 10 minutes
2. **Rate Limiting** : Implémentez des limites de tentatives
3. **Validation** : Validez toutes les entrées utilisateur
4. **Logs** : Enregistrez les tentatives de connexion
5. **Tests** : Testez tous les scénarios d'erreur

## 🔄 Prochaines étapes

1. Implémentez le contrôleur AuthController
2. Créez le Mailable OtpMail
3. Exécutez la migration
4. Configurez Sanctum et CORS
5. Testez l'API
6. Intégrez avec le frontend

Avez-vous des questions sur cette configuration ?
