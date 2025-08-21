<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ApiAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Vérifier le token Bearer
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token d\'authentification manquant',
                'error' => 'UNAUTHORIZED'
            ], 401);
        }

        // Vérifier le cache pour éviter les requêtes DB répétées
        $cacheKey = "user_token_{$token}";
        $cachedUser = Cache::get($cacheKey);
        
        if ($cachedUser) {
            Auth::login($cachedUser);
            return $next($request);
        }

        // Vérifier le token dans la base de données
        $user = User::where('remember_token', $token)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide ou expiré',
                'error' => 'INVALID_TOKEN'
            ], 401);
        }

        // Vérifier si l'utilisateur est actif
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Compte désactivé',
                'error' => 'ACCOUNT_DISABLED'
            ], 403);
        }

        // Mettre en cache l'utilisateur pour 30 minutes
        Cache::put($cacheKey, $user, 30 * 60);
        
        // Connecter l'utilisateur
        Auth::login($user);
        
        // Ajouter l'utilisateur à la requête pour un accès facile
        $request->merge(['user' => $user]);

        return $next($request);
    }
}
