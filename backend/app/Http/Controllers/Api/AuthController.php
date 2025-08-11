<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\OtpMail;
use App\Services\MailtrapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Étape 1: Validation de l'email
     */
    public function validateEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email invalide',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun compte trouvé avec cet email'
            ], 404);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé'
            ], 403);
        }

        // Générer un token temporaire pour l'étape suivante
        $tempToken = Str::random(32);
        $cacheKey = "email_validation_{$tempToken}";
        Cache::put($cacheKey, $user->email, 300); // 5 minutes

        return response()->json([
            'success' => true,
            'message' => 'Email validé',
            'temp_token' => $tempToken,
            'step' => 'email_validated'
        ]);
    }

    /**
     * Étape 2: Validation du mot de passe
     */
    public function validatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'temp_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier le token temporaire
        $cacheKey = "email_validation_{$request->temp_token}";
        $cachedEmail = Cache::get($cacheKey);

        if (!$cachedEmail || $cachedEmail !== $request->email) {
            return response()->json([
                'success' => false,
                'message' => 'Token de validation expiré ou invalide'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        // Générer et envoyer l'OTP
        $otp = $this->generateAndSendOtp($user);

        // Créer un nouveau token temporaire pour l'étape OTP
        $otpToken = Str::random(32);
        $otpCacheKey = "otp_validation_{$otpToken}";
        Cache::put($otpCacheKey, [
            'user_id' => $user->id,
            'email' => $user->email,
            'otp' => $otp
        ], 300); // 5 minutes

        // Supprimer l'ancien token
        Cache::forget($cacheKey);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe validé. Code OTP envoyé par email.',
            'otp_token' => $otpToken,
            'step' => 'password_validated'
        ]);
    }

    /**
     * Étape 3: Connexion avec OTP
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'otp_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier le token OTP
        $otpCacheKey = "otp_validation_{$request->otp_token}";
        $otpData = Cache::get($otpCacheKey);

        if (!$otpData || $otpData['email'] !== $request->email) {
            return response()->json([
                'success' => false,
                'message' => 'Token OTP expiré ou invalide'
            ], 401);
        }

        // Vérifier l'OTP
        if ($otpData['otp'] !== $request->otp) {
            return response()->json([
                'success' => false,
                'message' => 'Code OTP incorrect'
            ], 401);
        }

        $user = User::find($otpData['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Créer un token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;
        
        // Mettre à jour la dernière connexion
        $user->last_login_at = now();
        $user->save();

        // Supprimer le token OTP
        Cache::forget($otpCacheKey);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Générer et envoyer l'OTP par email
     */
    private function generateAndSendOtp(User $user)
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        try {
            // Envoyer l'OTP par email via SMTP Mailtrap
            Mail::to($user->email)->send(new OtpMail($otp, $user->email));
            
            \Log::info("OTP envoyé avec succès à {$user->email} via Mailtrap SMTP");
            
            // En développement, on affiche aussi l'OTP dans les logs pour faciliter les tests
            if (app()->environment('local')) {
                \Log::info("OTP pour {$user->email}: {$otp}");
            }
        } catch (\Exception $e) {
            \Log::error("Erreur lors de l'envoi de l'OTP: " . $e->getMessage());
            
            // En cas d'erreur, on affiche l'OTP dans les logs pour ne pas bloquer le processus
            \Log::info("OTP pour {$user->email}: {$otp}");
        }

        return $otp;
    }

    /**
     * Check authentication status
     */
    public function checkAuth(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Logout user (Revoke the Sanctum token)
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        if ($user) {
            // Révoquer le token Sanctum actuel
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'is_active' => true,
        ]);

        // Créer un token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ], 201);
    }

    /**
     * Refresh user token with Sanctum
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Révoquer l'ancien token
        $request->user()->currentAccessToken()->delete();

        // Créer un nouveau token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token rafraîchi',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request)
    {
        $user = $request->user();
        
        if ($user) {
            // Révoquer tous les tokens de l'utilisateur
            $user->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion de tous les appareils réussie'
        ]);
    }

    /**
     * Get current user info
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }
}
