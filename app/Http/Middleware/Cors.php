<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Origines autorisées
        $allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173', 
            'http://localhost:5177',
            'http://localhost:5178',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5177',
            'http://127.0.0.1:5178',
            'https://app.wozif.store',  // Votre domaine de production
            'https://www.app.wozif.store'
        ];

        $origin = $request->header('Origin');
        
        // Vérifier si l'origine est autorisée
        if ($origin && in_array($origin, $allowedOrigins)) {
            $allowedOrigin = $origin;
        } else {
            // En production, ne pas autoriser les origines non listées
            $allowedOrigin = app()->environment('local') ? '*' : null;
        }

        // Gérer les requêtes OPTIONS (preflight)
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
            
            if ($allowedOrigin) {
                $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
                $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
                $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-TOKEN, X-API-Key');
                $response->headers->set('Access-Control-Max-Age', '86400');
                $response->headers->set('Access-Control-Allow-Credentials', 'true');
            }
            
            return $response;
        }

        $response = $next($request);

        // Appliquer les en-têtes CORS à toutes les réponses
        if ($allowedOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-TOKEN, X-API-Key');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            
            // S'assurer que les en-têtes sont bien envoyés
            $response->headers->set('Vary', 'Origin');
        }
        
        return $response;
    }
} 