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

// Routes d'authentification (publiques)
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('verify-mfa', [AuthController::class, 'verifyMfa']);

    // Routes protégées par authentification
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all', [AuthController::class, 'logoutAll']);

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
Route::get('/stores', function () {
    try {
        $stores = DB::table('stores')
            ->join('users', 'stores.owner_id', '=', 'users.id')
            ->select(
                'stores.id',
                'stores.name',
                'stores.description',
                'stores.is_active',
                'stores.created_at',
                'users.name as owner_name',
                'users.email as owner_email'
            )
            ->get();

        return response()->json([
            'success' => true,
            'stores' => $stores,
            'count' => $stores->count(),
            'message' => 'Boutiques récupérées avec succès'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Erreur base de données',
            'message' => $e->getMessage()
        ], 500);
    }
});

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
Route::middleware('auth:sanctum')->group(function () {

    // Gestion des boutiques
    Route::apiResource('stores', StoreController::class);
    Route::get('stores/{store}/products', [ProductController::class, 'index']);
    Route::post('stores/{store}/products', [ProductController::class, 'store']);

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('stores/{store}/stats', [DashboardController::class, 'storeStats']);
        Route::get('stores/{store}/recent-orders', [DashboardController::class, 'recentOrders']);
        Route::get('stores/{store}/sales-chart', [DashboardController::class, 'salesChart']);
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

}); // <-- CORRECTION : Accolade fermante manquante ajoutée ici

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