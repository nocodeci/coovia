<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\BoutiqueController;
use App\Http\Controllers\MonerooController;
use App\Http\Controllers\TestMonerooController;
use App\Http\Controllers\Api\MonerooConfigController;
use App\Http\Controllers\Api\MonerooTestController;
use App\Http\Controllers\Api\MonerooWebhookController;
//use App\Http\Controllers\Api\StatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques (sans authentification)
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel fonctionne correctement',
        'timestamp' => now(),
        'version' => '1.0.0',
        'environment' => app()->environment(),
        'session_driver' => config('session.driver'),
        'cache_driver' => config('cache.default')
    ]);
});

Route::get('/health', function () {
    try {
        DB::connection()->getPdo();

        return response()->json([
            'status' => 'healthy',
            'database' => 'connected',
            'timestamp' => now(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'database' => 'disconnected',
            'error' => $e->getMessage(),
            'timestamp' => now(),
        ], 500);
    }
});

Route::get('/status', function () {
    $dbConnected = true;
    $dbError = null;

    try {
        DB::connection()->getPdo();
        $userCount = DB::table('users')->count();
        $storeCount = DB::table('stores')->count();
    } catch (\Exception $e) {
        $dbConnected = false;
        $dbError = $e->getMessage();
        $userCount = 0;
        $storeCount = 0;
    }

    return response()->json([
        'api' => [
            'status' => 'running',
            'version' => '1.0.0',
            'environment' => app()->environment(),
        ],
        'database' => [
            'connected' => $dbConnected,
            'driver' => config('database.default'),
            'error' => $dbError,
        ],

        'laravel' => [
            'version' => app()->version(),
            'timezone' => config('app.timezone'),
        ],
        'timestamp' => now(),
    ], $dbConnected ? 200 : 500);
});

Route::get('/ping', function () {
    return response()->json([
        'message' => 'pong',
        'timestamp' => now()
    ]);
});

// Routes Moneroo (publiques)
Route::prefix('moneroo')->group(function () {
    Route::post('create-payment', [MonerooController::class, 'createPayment']);
    Route::get('payment-status/{paymentId}', [MonerooController::class, 'checkPaymentStatus']);
    Route::post('webhook', [MonerooWebhookController::class, 'handleWebhook']);
    Route::get('payment-success', [MonerooController::class, 'paymentSuccess'])->name('payment.success');
    Route::get('payment-failed', [MonerooController::class, 'paymentFailed'])->name('payment.failed');
});

// Routes de test Moneroo
Route::prefix('test-moneroo')->group(function () {
    Route::get('test-payment', [TestMonerooController::class, 'testPayment']);
    Route::post('custom-payment', [TestMonerooController::class, 'customPayment']);
    Route::get('direct-payment', [TestMonerooController::class, 'directPayment']);
});

// Routes de test API officielle Moneroo (publiques pour les tests)
Route::prefix('moneroo-api-test')->group(function () {
    Route::get('test-payment', [MonerooTestController::class, 'testPayment']);
    Route::post('custom-payment', [MonerooTestController::class, 'customPayment']);
    Route::get('check-status/{paymentId}', [MonerooTestController::class, 'checkPaymentStatus']);
    Route::get('curl-example', [MonerooTestController::class, 'curlExample']);
});

// Routes de configuration Moneroo (publiques pour les tests)
Route::prefix('moneroo-config')->group(function () {
    Route::post('store', [MonerooConfigController::class, 'store']);
    Route::get('show', [MonerooConfigController::class, 'show']);
    Route::post('test', [MonerooConfigController::class, 'test']);
    Route::delete('destroy', [MonerooConfigController::class, 'destroy']);
});

// Routes d'authentification (publiques)
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('verify-mfa', [AuthController::class, 'verifyMfa']);

    // Routes protégées par authentification
    Route::middleware('auth.api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::get('check', [AuthController::class, 'checkAuth']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all', [AuthController::class, 'logoutAll']);
        Route::post('refresh', [AuthController::class, 'refresh']);

        // Configuration MFA
        Route::prefix('mfa')->group(function () {
            Route::post('setup', [AuthController::class, 'setupMfa']);
            Route::post('enable', [AuthController::class, 'enableMfa']);
            Route::post('disable', [AuthController::class, 'disableMfa']);
            Route::post('backup-codes', [AuthController::class, 'regenerateBackupCodes']);
        });
    });
});

// Routes de données publiques (pour tester)
Route::get('/users', function () {
    try {
        $users = DB::table('users')
            ->select('id', 'name', 'email', 'role', 'mfa_enabled', 'created_at')
            ->whereNull('deleted_at')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users,
            'count' => $users->count(),
            'message' => 'Utilisateurs récupérés avec succès'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Erreur base de données',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/products', function () {
    try {
        $products = DB::table('products')
            ->join('stores', 'products.store_id', '=', 'stores.id')
            ->select(
                'products.id',
                'products.name',
                'products.description',
                'products.price',
                'products.status',
                'products.created_at',
                'stores.name as store_name'
            )
            ->get();

        return response()->json([
            'success' => true,
            'products' => $products,
            'count' => $products->count(),
            'message' => 'Produits récupérés avec succès'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Erreur base de données',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Routes protégées par authentification
Route::middleware('auth.api')->group(function () {

    // Gestion des boutiques
    Route::apiResource('stores', StoreController::class);
    Route::get('stores/{store}/products', [ProductController::class, 'index']);
    Route::post('stores/{store}/products', [ProductController::class, 'store']);

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('stores/{storeId}/stats', [DashboardController::class, 'getStoreStats']);
        Route::get('stores/{storeId}/revenue-chart', [DashboardController::class, 'getRevenueChart']);
    });

    // Gestion des produits
    Route::apiResource('products', ProductController::class)->except(['index', 'store']);

    // Gestion des commandes
    Route::apiResource('orders', OrderController::class);

    // Gestion des clients
    Route::apiResource('customers', CustomerController::class);

    // Paiements
    Route::prefix('payments')->group(function () {
        Route::get('gateways', [PaymentController::class, 'getGateways']);
        Route::get('methods', [PaymentController::class, 'getMethods']);
        Route::get('transactions', [PaymentController::class, 'getTransactions']);
        Route::post('process', [PaymentController::class, 'processPayment']);
        Route::post('verify', [PaymentController::class, 'verifyPayment']);
    });

    // Gestion des médias
    Route::prefix('stores/{storeId}/media')->group(function () {
        Route::get('/', [MediaController::class, 'index']);
        Route::post('/', [MediaController::class, 'store']);
        Route::put('/{mediaId}', [MediaController::class, 'update']);
        Route::delete('/{mediaId}', [MediaController::class, 'destroy']);
    });

    // Route de test pour les médias (sans authentification pour le développement)
    Route::prefix('test/stores/{storeId}/media')->group(function () {
        Route::get('/', [MediaController::class, 'index']);
        Route::post('/', [MediaController::class, 'store']);
        Route::put('/{mediaId}', [MediaController::class, 'update']);
        Route::delete('/{mediaId}', [MediaController::class, 'destroy']);
    });
}); // Fin du middleware auth.api

// Routes publiques pour les médias (développement seulement)
Route::prefix('public/stores/{storeId}/media')->group(function () {
    Route::get('/', [MediaController::class, 'index']);
    Route::post('/', [MediaController::class, 'store']);
    Route::put('/{mediaId}', [MediaController::class, 'update']);
    Route::delete('/{mediaId}', [MediaController::class, 'destroy']);
});

// Routes publiques pour les produits (développement seulement)
Route::prefix('public')->group(function () {
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::put('/products/{product}', [ProductController::class, 'updatePublic']);
    Route::delete('/products/{product}', [ProductController::class, 'destroyPublic']);
});

// Routes publiques pour les boutiques clientes
Route::prefix('boutique')->group(function () {
    // Récupérer le slug d'une boutique par son ID
    Route::get('/slug/{storeId}', [BoutiqueController::class, 'getStoreSlug']);
    
    // Récupérer une boutique par son slug
    Route::get('/{slug}', [BoutiqueController::class, 'getStoreBySlug']);
    
    // Récupérer les produits d'une boutique
    Route::get('/{storeId}/products', [BoutiqueController::class, 'getStoreProducts']);
    
    // Récupérer un produit spécifique
    Route::get('/{storeId}/products/{productId}', [BoutiqueController::class, 'getProduct']);
    
    // Récupérer les catégories d'une boutique
    Route::get('/{storeId}/categories', [BoutiqueController::class, 'getStoreCategories']);
});

// Route de debug (développement seulement)
if (app()->environment('local')) {
    Route::get('/debug/routes', function () {
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
                'action' => $route->getActionName(),
            ];
        })->values();

        return response()->json([
            'total_routes' => $routes->count(),
            'api_routes' => $routes->filter(function ($route) {
                return str_contains($route['uri'], 'api/');
            })->values(),
        ]);
    });
}