<?php

use App\Http\Controllers\Lunar\ProductController;
use App\Http\Controllers\Lunar\CollectionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Lunar API Routes
|--------------------------------------------------------------------------
|
| Routes pour l'API e-commerce Lunar
|
*/

Route::prefix('lunar')->name('lunar.')->group(function () {
    
    // Routes publiques pour les produits
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/{id}', [ProductController::class, 'show'])->name('show');
        Route::get('/slug/{slug}', [ProductController::class, 'showBySlug'])->name('show.by.slug');
    });

    // Routes publiques pour les collections
    Route::prefix('collections')->name('collections.')->group(function () {
        Route::get('/', [CollectionController::class, 'index'])->name('index');
        Route::get('/{id}', [CollectionController::class, 'show'])->name('show');
        Route::get('/slug/{slug}', [CollectionController::class, 'showBySlug'])->name('show.by.slug');
        Route::get('/{id}/products', [CollectionController::class, 'products'])->name('products');
    });

    // Routes protégées (nécessitent une authentification)
    Route::middleware(['auth:sanctum'])->group(function () {
        
        // Gestion des produits (CRUD complet)
        Route::prefix('products')->name('products.')->group(function () {
            Route::post('/', [ProductController::class, 'store'])->name('store');
            Route::put('/{id}', [ProductController::class, 'update'])->name('update');
            Route::delete('/{id}', [ProductController::class, 'destroy'])->name('destroy');
            Route::post('/{id}/collections', [ProductController::class, 'addToCollection'])->name('add.to.collection');
            Route::delete('/{id}/collections', [ProductController::class, 'removeFromCollection'])->name('remove.from.collection');
        });

        // Gestion des collections (CRUD complet)
        Route::prefix('collections')->name('collections.')->group(function () {
            Route::post('/', [CollectionController::class, 'store'])->name('store');
            Route::put('/{id}', [CollectionController::class, 'update'])->name('update');
            Route::delete('/{id}', [CollectionController::class, 'destroy'])->name('destroy');
        });
    });
});
