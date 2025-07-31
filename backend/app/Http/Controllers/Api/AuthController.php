<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants invalides'
            ], 401);
        }

        // Vérifier si l'utilisateur est actif
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé'
            ], 403);
        }

        // Générer un nouveau token
        $token = Str::random(60);
        $user->remember_token = $token;
        $user->last_login_at = now();
        $user->save();

        // Mettre en cache l'utilisateur avec TTL plus long
        $cacheKey = "user_token_{$token}";
        Cache::put($cacheKey, $user, 60 * 60); // 1 heure au lieu de 30 minutes

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
     * Check authentication status - OPTIMISÉ
     */
    public function checkAuth(Request $request)
    {
        // Vérifier d'abord le cache pour éviter les requêtes DB
        $token = $request->bearerToken();
        if ($token) {
            $cacheKey = "user_token_{$token}";
            $cachedUser = Cache::get($cacheKey);
            
            if ($cachedUser) {
                return response()->json([
                    'success' => true,
                    'message' => 'Authentifié (cache)',
                    'user' => [
                        'id' => $cachedUser->id,
                        'name' => $cachedUser->name,
                        'email' => $cachedUser->email,
                        'role' => $cachedUser->role,
                        'created_at' => $cachedUser->created_at,
                        'updated_at' => $cachedUser->updated_at,
                    ]
                ]);
            }
        }

        // Fallback vers la DB si pas en cache
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Remettre en cache si trouvé en DB
        if ($token) {
            $cacheKey = "user_token_{$token}";
            Cache::put($cacheKey, $user, 60 * 60);
        }

        return response()->json([
            'success' => true,
            'message' => 'Authentifié',
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
     * Get current user info - OPTIMISÉ
     */
    public function me(Request $request)
    {
        // Même logique que checkAuth mais avec cache
        $token = $request->bearerToken();
        if ($token) {
            $cacheKey = "user_token_{$token}";
            $cachedUser = Cache::get($cacheKey);
            
            if ($cachedUser) {
                return response()->json([
                    'success' => true,
                    'user' => [
                        'id' => $cachedUser->id,
                        'name' => $cachedUser->name,
                        'email' => $cachedUser->email,
                        'role' => $cachedUser->role,
                        'created_at' => $cachedUser->created_at,
                        'updated_at' => $cachedUser->updated_at,
                    ]
                ]);
            }
        }

        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Remettre en cache
        if ($token) {
            $cacheKey = "user_token_{$token}";
            Cache::put($cacheKey, $user, 60 * 60);
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
     * Logout user (Revoke the token)
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        if ($user) {
            // Supprimer le token
            $user->remember_token = null;
            $user->save();

            // Supprimer du cache
            $token = $request->bearerToken();
            if ($token) {
                Cache::forget("user_token_{$token}");
            }
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

        // Générer un token
        $token = Str::random(60);
        $user->remember_token = $token;
        $user->save();

        // Mettre en cache l'utilisateur
        $cacheKey = "user_token_{$token}";
        Cache::put($cacheKey, $user, 60 * 60);

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
     * Refresh user token
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

        // Supprimer l'ancien token du cache
        $oldToken = $request->bearerToken();
        if ($oldToken) {
            Cache::forget("user_token_{$oldToken}");
        }

        // Générer un nouveau token
        $newToken = Str::random(60);
        $user->remember_token = $newToken;
        $user->save();

        // Mettre en cache avec le nouveau token
        $cacheKey = "user_token_{$newToken}";
        Cache::put($cacheKey, $user, 60 * 60);

        return response()->json([
            'success' => true,
            'message' => 'Token rafraîchi',
            'token' => $newToken,
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

    // Méthodes MFA pour compatibilité
    public function verifyMfa(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'MFA non implémenté'
        ], 501);
    }

    public function setupMfa(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'MFA non implémenté'
        ], 501);
    }

    public function enableMfa(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'MFA non implémenté'
        ], 501);
    }

    public function disableMfa(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'MFA non implémenté'
        ], 501);
    }

    public function regenerateBackupCodes(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'MFA non implémenté'
        ], 501);
    }

    public function logoutAll(Request $request)
    {
        $user = $request->user();
        
        if ($user) {
            // Supprimer tous les tokens de l'utilisateur
            $user->remember_token = null;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion de tous les appareils réussie'
        ]);
    }
}
