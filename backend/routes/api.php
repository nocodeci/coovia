<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Stores
    Route::apiResource('stores', StoreController::class);

    // Store-specific routes
    Route::prefix('stores/{store}')->group(function () {
        Route::apiResource('products', ProductController::class);
        Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'update']);
        Route::apiResource('customers', CustomerController::class);
    });

    // Payment routes
    Route::prefix('payments')->group(function () {
        Route::get('gateways', [PaymentController::class, 'gateways']);
        Route::get('transactions', [PaymentController::class, 'transactions']);
        Route::post('process', [PaymentController::class, 'processPayment']);
    });
});

// Public routes
Route::get('payment-gateways', [PaymentController::class, 'gateways']);
