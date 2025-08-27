<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Appliquer le middleware CORS de manière globale et forcée
        $middleware->prepend(\App\Http\Middleware\Cors::class);
        $middleware->append(\App\Http\Middleware\Cors::class);
        
        // Appliquer le middleware CORS spécifiquement aux routes API
        $middleware->api(prepend: [
            \App\Http\Middleware\Cors::class,
        ]);
        
        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'auth.api' => \App\Http\Middleware\ApiAuthenticate::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Configuration pour éviter la redirection vers 'login'
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*')) {
                return null; // Pas de redirection pour les API
            }
            return route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Gestion des erreurs d'authentification pour les API
        $exceptions->render(function (Illuminate\Auth\AuthenticationException $e, Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié. Token manquant ou invalide.',
                    'error' => 'unauthenticated'
                ], 401);
            }
        });

        // Gestion des erreurs de validation
        $exceptions->render(function (Illuminate\Validation\ValidationException $e, Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreurs de validation',
                    'errors' => $e->errors(),
                    'data' => null
                ], 422);
            }
        });

        // Gestion des erreurs 404
        $exceptions->render(function (Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Route non trouvée.',
                    'error' => 'not_found'
                ], 404);
            }
        });

        // Gestion des erreurs de méthode non autorisée
        $exceptions->render(function (Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException $e, Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Méthode HTTP non autorisée pour cette route.',
                    'error' => 'method_not_allowed'
                ], 405);
            }
        });

        // Gestion des erreurs générales
        $exceptions->render(function (Throwable $e, Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                return response()->json([
                    'success' => false,
                    'message' => app()->environment('local') ? $e->getMessage() : 'Erreur interne du serveur',
                    'error' => 'server_error',
                    'trace' => app()->environment('local') ? $e->getTraceAsString() : null
                ], $statusCode >= 100 && $statusCode < 600 ? $statusCode : 500);
            }
        });
    })->create();
