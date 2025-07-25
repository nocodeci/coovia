<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class ApiAuthenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Pour les API, on ne redirige pas, on retourne null
        // Cela va déclencher une exception 401 au lieu d'une redirection
        return $request->expectsJson() ? null : route('login');
    }

    /**
     * Handle unauthenticated user for API requests
     */
    protected function unauthenticated($request, array $guards)
    {
        // Pour les requêtes API, retourner une réponse JSON 401
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json([
                'message' => 'Non authentifié. Token requis.',
                'error' => 'Unauthenticated'
            ], 401));
        }

        parent::unauthenticated($request, $guards);
    }
}
