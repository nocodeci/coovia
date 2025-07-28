<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes (Web)
|--------------------------------------------------------------------------
| Ces routes sont pour l'authentification web traditionnelle.
| Pour l'API, utilisez les routes dans api.php
*/

// Redirection vers l'API pour l'authentification
Route::get('/login', function () {
    return response()->json([
        'message' => 'Utilisez l\'API pour l\'authentification',
        'api_login' => url('/api/auth/login'),
        'api_register' => url('/api/auth/register'),
    ]);
})->name('login');

Route::get('/register', function () {
    return response()->json([
        'message' => 'Utilisez l\'API pour l\'inscription',
        'api_register' => url('/api/auth/register'),
    ]);
})->name('register');

Route::post('/logout', function () {
    return response()->json([
        'message' => 'Utilisez l\'API pour la déconnexion',
        'api_logout' => url('/api/auth/logout'),
    ]);
})->name('logout');
