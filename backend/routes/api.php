<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes (Sans Sessions)
|--------------------------------------------------------------------------
*/

// Middleware pour désactiver les sessions sur les routes API
Route::middleware('api')->group(function () {

    // Route de test simple
    Route::get('test', function () {
        return response()->json([
            'message' => 'API Laravel fonctionne correctement',
            'timestamp' => now(),
            'version' => '1.0.0',
            'session_driver' => config('session.driver')
        ]);
    });

    // Route de santé
    Route::get('health', function () {
        try {
            DB::connection()->getPdo();

            return response()->json([
                'status' => 'healthy',
                'database' => 'connected',
                'session_driver' => config('session.driver'),
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

    // Route de statut détaillé
    Route::get('status', function () {
        $dbConnected = true;
        $dbError = null;

        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbConnected = false;
            $dbError = $e->getMessage();
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
            'session' => [
                'driver' => config('session.driver'),
                'lifetime' => config('session.lifetime'),
            ],
            'timestamp' => now(),
        ], $dbConnected ? 200 : 500);
    });

    // Routes de données basiques
    Route::get('stores', function () {
        try {
            $stores = DB::table('stores')
                ->join('users', 'stores.owner_id', '=', 'users.id')
                ->select(
                    'stores.*',
                    'users.name as owner_name',
                    'users.email as owner_email'
                )
                ->get();

            return response()->json([
                'stores' => $stores,
                'count' => $stores->count(),
                'message' => 'Boutiques récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    Route::get('users', function () {
        try {
            $users = DB::table('users')
                ->select('id', 'name', 'email', 'role', 'mfa_enabled', 'created_at')
                ->whereNull('deleted_at')
                ->get();

            return response()->json([
                'users' => $users,
                'count' => $users->count(),
                'message' => 'Utilisateurs récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    Route::get('products', function () {
        try {
            $products = DB::table('products')
                ->join('stores', 'products.store_id', '=', 'stores.id')
                ->select(
                    'products.*',
                    'stores.name as store_name'
                )
                ->get();

            return response()->json([
                'products' => $products,
                'count' => $products->count(),
                'message' => 'Produits récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    Route::get('orders', function () {
        try {
            $orders = DB::table('orders')
                ->join('stores', 'orders.store_id', '=', 'stores.id')
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->select(
                    'orders.*',
                    'stores.name as store_name',
                    'customers.first_name',
                    'customers.last_name',
                    'customers.email as customer_email'
                )
                ->orderBy('orders.created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'orders' => $orders,
                'count' => $orders->count(),
                'message' => 'Commandes récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    Route::get('payments/gateways', function () {
        try {
            $gateways = DB::table('payment_gateways')
                ->join('stores', 'payment_gateways.store_id', '=', 'stores.id')
                ->select(
                    'payment_gateways.*',
                    'stores.name as store_name'
                )
                ->where('payment_gateways.is_active', true)
                ->get();

            return response()->json([
                'gateways' => $gateways,
                'count' => $gateways->count(),
                'message' => 'Passerelles de paiement récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    Route::get('payments/methods', function () {
        try {
            $methods = DB::table('payment_methods')
                ->join('payment_gateways', 'payment_methods.gateway_id', '=', 'payment_gateways.id')
                ->join('stores', 'payment_gateways.store_id', '=', 'stores.id')
                ->select(
                    'payment_methods.*',
                    'payment_gateways.name as gateway_name',
                    'payment_gateways.provider',
                    'stores.name as store_name'
                )
                ->where('payment_methods.is_active', true)
                ->where('payment_gateways.is_active', true)
                ->get();

            return response()->json([
                'methods' => $methods,
                'count' => $methods->count(),
                'message' => 'Méthodes de paiement récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    Route::get('payments/transactions', function () {
        try {
            $transactions = DB::table('payment_transactions')
                ->join('stores', 'payment_transactions.store_id', '=', 'stores.id')
                ->leftJoin('orders', 'payment_transactions.order_id', '=', 'orders.id')
                ->leftJoin('payment_gateways', 'payment_transactions.gateway_id', '=', 'payment_gateways.id')
                ->select(
                    'payment_transactions.*',
                    'stores.name as store_name',
                    'orders.order_number',
                    'payment_gateways.name as gateway_name'
                )
                ->orderBy('payment_transactions.created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'transactions' => $transactions,
                'count' => $transactions->count(),
                'message' => 'Transactions récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur base de données',
                'message' => $e->getMessage()
            ], 500);
        }
    });

    // Route pour lister toutes les routes disponibles
    Route::get('routes', function () {
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
            ];
        })->filter(function ($route) {
            return str_starts_with($route['uri'], 'api/');
        })->values();

        return response()->json([
            'available_routes' => $routes,
            'total' => $routes->count(),
        ]);
    });

});
