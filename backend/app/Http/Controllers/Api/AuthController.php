<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\MfaVerifyRequest;
use App\Http\Requests\MfaSetupRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\LoginAttempt;
use App\Services\MfaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $mfaService;

    public function __construct(MfaService $mfaService)
    {
        $this->mfaService = $mfaService;
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(RegisterRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'email_verified_at' => now(), // Marquer comme vérifié automatiquement
                'role' => 'user',
                'is_active' => true,
            ]);

            // Créer un token d'authentification avec Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Connexion utilisateur avec gestion MFA
     */
    public function login(LoginRequest $request)
    {
        $email = $request->email;
        $password = $request->password;
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        // Vérifier le rate limiting
        $key = 'login_attempts:' . $ip;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Trop de tentatives. Réessayez dans {$seconds} secondes."
            ], 429);
        }

        $user = User::where('email', $email)->first();

        // Enregistrer la tentative de connexion
        $this->logLoginAttempt($user, $email, $ip, $userAgent, false, 'Tentative de connexion');

        if (!$user || $user->isLocked()) {
            RateLimiter::hit($key, 300); // 5 minutes
            return response()->json([
                'success' => false,
                'message' => 'Compte verrouillé ou identifiants incorrects'
            ], 401);
        }

        if (!Hash::check($password, $user->password)) {
            $user->incrementLoginAttempts();
            RateLimiter::hit($key, 300);

            $this->logLoginAttempt($user, $email, $ip, $userAgent, false, 'Mot de passe incorrect');

            return response()->json([
                'success' => false,
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé'
            ], 403);
        }

        // Si MFA est activé
        if ($user->mfa_enabled) {
            $mfaToken = $this->mfaService->generateMfaToken($user, 'login');

            $this->logLoginAttempt($user, $email, $ip, $userAgent, false, 'MFA requis', true);

            return response()->json([
                'success' => true,
                'message' => 'Code MFA requis',
                'mfa_required' => true,
                'mfa_token' => $mfaToken,
                'backup_codes_available' => count($user->backup_codes ?? []) > 0,
            ]);
        }

        // Connexion réussie sans MFA
        $user->resetLoginAttempts();
        RateLimiter::clear($key);

        $token = $user->createToken('auth_token')->plainTextToken;

        $this->logLoginAttempt($user, $email, $ip, $userAgent, true);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Vérification du code MFA
     */
    public function verifyMfa(MfaVerifyRequest $request)
    {
        $mfaToken = $request->mfa_token;
        $code = $request->code;
        $isBackupCode = $request->is_backup_code ?? false;

        $user = $this->mfaService->verifyMfaToken($mfaToken, 'login');

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Token MFA invalide ou expiré'
            ], 401);
        }

        $verified = false;

        if ($isBackupCode) {
            $verified = $this->mfaService->verifyBackupCode($user, $code);
        } else {
            $verified = $this->mfaService->verifyCode($user, $code);
        }

        if (!$verified) {
            $this->logLoginAttempt($user, $user->email, request()->ip(), request()->userAgent(), false, 'Code MFA incorrect', true, false);

            return response()->json([
                'success' => false,
                'message' => 'Code de vérification invalide'
            ], 401);
        }

        // MFA vérifié avec succès
        $user->resetLoginAttempts();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->logLoginAttempt($user, $user->email, request()->ip(), request()->userAgent(), true, null, true, true);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Configuration initiale MFA
     */
    public function setupMfa(Request $request)
    {
        $user = $request->user();

        if ($user->mfa_enabled) {
            return response()->json([
                'success' => false,
                'message' => 'MFA déjà activé'
            ], 400);
        }

        $secret = $this->mfaService->generateSecret($user);
        $qrCodeUrl = $this->mfaService->generateQrCode($user, $secret);

        return response()->json([
            'success' => true,
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
            'message' => 'Scannez le QR code avec votre application d\'authentification'
        ]);
    }

    /**
     * Activer MFA
     */
    public function enableMfa(MfaSetupRequest $request)
    {
        $user = $request->user();
        $code = $request->code;

        try {
            $backupCodes = $this->mfaService->enableMfa($user, $code);

            return response()->json([
                'success' => true,
                'message' => 'MFA activé avec succès',
                'backup_codes' => $backupCodes,
                'warning' => 'Sauvegardez ces codes de récupération dans un endroit sûr'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Désactiver MFA
     */
    public function disableMfa(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        try {
            $this->mfaService->disableMfa($user, $request->password);

            return response()->json([
                'success' => true,
                'message' => 'MFA désactivé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Générer de nouveaux codes de récupération
     */
    public function regenerateBackupCodes(Request $request)
    {
        $user = $request->user();

        if (!$user->mfa_enabled) {
            return response()->json([
                'success' => false,
                'message' => 'MFA n\'est pas activé'
            ], 400);
        }

        $backupCodes = $user->generateBackupCodes();

        return response()->json([
            'success' => true,
            'backup_codes' => $backupCodes,
            'message' => 'Nouveaux codes de récupération générés'
        ]);
    }

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => new UserResource($request->user())
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
     * Déconnexion de tous les appareils
     */
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion de tous les appareils réussie'
        ]);
    }

    /**
     * Enregistrer une tentative de connexion
     */
    private function logLoginAttempt($user, $email, $ip, $userAgent, $successful, $failureReason = null, $mfaRequired = false, $mfaSuccessful = null)
    {
        try {
            LoginAttempt::create([
                'user_id' => $user ? $user->id : null,
                'email' => $email,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'successful' => $successful,
                'failure_reason' => $failureReason,
                'mfa_required' => $mfaRequired,
                'mfa_successful' => $mfaSuccessful,
            ]);
        } catch (\Exception $e) {
            // Log silencieusement l'erreur sans interrompre le processus
            \Log::error('Erreur lors de l\'enregistrement de la tentative de connexion: ' . $e->getMessage());
        }
    }
}
