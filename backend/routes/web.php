<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API Backend',
        'version' => '1.0.0',
        'timestamp' => now(),
        'api_url' => url('/api'),
        'available_endpoints' => [
            'GET /api/test',
            'GET /api/health',
            'GET /api/status',
            'GET /api/ping',
            'GET /api/debug/routes',
            'GET /api/stores',
            'GET /api/users',
            'GET /api/products'
        ]
    ]);
});

// Route de test pour vérifier que Laravel fonctionne
Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel Web Route fonctionne',
        'timestamp' => now()
    ]);
});

// Redirection pour les routes d'authentification vers l'API
Route::get('/login', function () {
    return response()->json([
        'error' => 'Cette route est pour les API',
        'message' => 'Utilisez /api/auth/login pour l\'authentification'
    ], 404);
})->name('login');
