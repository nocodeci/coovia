<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Auth0Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;

class Auth0Controller extends Controller
{
    protected $auth0Service;

    public function __construct(Auth0Service $auth0Service)
    {
        $this->auth0Service = $auth0Service;
    }

    /**
     * Synchroniser un utilisateur Auth0 avec la base de données
     */
    public function syncUser(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'auth0_id' => 'required|string',
                'email' => 'required|email',
                'name' => 'required|string',
                'access_token' => 'required|string',
            ]);

            // Valider le token Auth0
            $tokenValidation = $this->auth0Service->validateToken($request->access_token);
            
            if (!$tokenValidation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token Auth0 invalide',
                    'error' => $tokenValidation['error']
                ], 401);
            }

            // Synchroniser l'utilisateur
            $user = $this->auth0Service->syncUser([
                'auth0_id' => $request->auth0_id,
                'email' => $request->email,
                'name' => $request->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur synchronisé avec succès',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'auth0_id' => $user->auth0_id,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]
            ]);

        } catch (Exception $e) {
            Log::error('Auth0 sync error', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la synchronisation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valider un token Auth0
     */
    public function validateToken(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'token' => 'required|string',
            ]);

            $validation = $this->auth0Service->validateToken($request->token);

            if ($validation['valid']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Token valide',
                    'user_id' => $validation['user_id'],
                    'email' => $validation['email'],
                    'name' => $validation['name'],
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Token invalide',
                    'error' => $validation['error']
                ], 401);
            }

        } catch (Exception $e) {
            Log::error('Auth0 token validation error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation du token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les informations utilisateur
     */
    public function getUserInfo(Request $request): JsonResponse
    {
        try {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token manquant'
                ], 401);
            }

            $validation = $this->auth0Service->validateToken($token);
            
            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token invalide'
                ], 401);
            }

            $userInfo = $this->auth0Service->getUserInfo($token);

            return response()->json([
                'success' => true,
                'message' => 'Informations utilisateur récupérées',
                'user_info' => $userInfo
            ]);

        } catch (Exception $e) {
            Log::error('Auth0 get user info error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des informations utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assigner un rôle à un utilisateur
     */
    public function assignRole(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_id' => 'required|string',
                'role' => 'required|string|in:admin,vendor,customer,user',
            ]);

            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token manquant'
                ], 401);
            }

            $validation = $this->auth0Service->validateToken($token);
            
            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token invalide'
                ], 401);
            }

            // Vérifier que l'utilisateur connecté est admin
            $currentUser = \App\Models\User::where('auth0_id', $validation['user_id'])->first();
            
            if (!$currentUser || $currentUser->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Permission refusée'
                ], 403);
            }

            $targetUser = \App\Models\User::find($request->user_id);
            
            if (!$targetUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé'
                ], 404);
            }

            $this->auth0Service->assignRole($targetUser, $request->role);

            return response()->json([
                'success' => true,
                'message' => 'Rôle assigné avec succès',
                'user' => [
                    'id' => $targetUser->id,
                    'name' => $targetUser->name,
                    'email' => $targetUser->email,
                    'role' => $targetUser->role,
                ]
            ]);

        } catch (Exception $e) {
            Log::error('Auth0 assign role error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'assignation du rôle',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
