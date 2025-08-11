<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\Auth0Service;
use App\Models\User;
use Exception;

class Auth0Middleware
{
    protected $auth0Service;

    public function __construct(Auth0Service $auth0Service)
    {
        $this->auth0Service = $auth0Service;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role = null): mixed
    {
        try {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token d\'authentification manquant'
                ], 401);
            }

            // Valider le token Auth0
            $validation = $this->auth0Service->validateToken($token);
            
            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token d\'authentification invalide',
                    'error' => $validation['error']
                ], 401);
            }

            // Récupérer l'utilisateur depuis la base de données
            $user = User::where('auth0_id', $validation['user_id'])->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé dans la base de données'
                ], 404);
            }

            // Vérifier le rôle si spécifié
            if ($role && !$this->auth0Service->hasRole($user, $role)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Permission refusée. Rôle requis: ' . $role
                ], 403);
            }

            // Ajouter l'utilisateur à la requête
            $request->merge(['user' => $user]);
            $request->setUserResolver(function () use ($user) {
                return $user;
            });

            return $next($request);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur d\'authentification',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
