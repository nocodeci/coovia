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
use App\Http\Controllers\PaymentController as MainPaymentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\CloudflareController;
use App\Http\Controllers\Api\SimpleMediaController;
use App\Http\Controllers\Api\BoutiqueController;
use App\Http\Controllers\MonerooController;
use App\Http\Controllers\TestMonerooController;
use App\Http\Controllers\Api\MonerooConfigController;
use App\Http\Controllers\Api\MonerooTestController;
use App\Http\Controllers\Api\MonerooWebhookController;
use App\Http\Controllers\LunarProductController;
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
    // Nouvelles routes pour l'authentification en 3 étapes
    Route::post('validate-email', [AuthController::class, 'validateEmail']);
    Route::post('validate-password', [AuthController::class, 'validatePassword']);
    
    // Routes existantes
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('verify-mfa', [AuthController::class, 'verifyMfa']);

    // Routes protégées par authentification Sanctum
    Route::middleware('auth:sanctum')->group(function () {
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

// Route publique pour vérifier la disponibilité des sous-domaines
Route::get('stores/subdomain/{slug}/check', [StoreController::class, 'checkSubdomain']); // Vérifier un sous-domaine
Route::get('stores/{slug}', [StoreController::class, 'getBySlug']); // Récupérer une boutique par slug

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {

    // Gestion des boutiques (Just-in-time registration)
    Route::prefix('stores')->group(function () {
        Route::get('my-store', [StoreController::class, 'getMyStore']); // Obtenir sa boutique
        Route::put('my-store', [StoreController::class, 'updateStore']); // Mettre à jour sa boutique
    });
    
    // Routes existantes pour les boutiques
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

    // Routes de paiement centralisées
    Route::prefix('payments')->group(function () {
        Route::post('create', [App\Http\Controllers\Api\PaymentController::class, 'createPayment']);
        Route::post('check-status', [App\Http\Controllers\Api\PaymentController::class, 'checkPaymentStatus']);
        Route::get('stats', [App\Http\Controllers\Api\PaymentController::class, 'getPaymentStats']);
        Route::get('history', [App\Http\Controllers\Api\PaymentController::class, 'getPaymentHistory']);
        Route::get('detect-gateway', [App\Http\Controllers\Api\PaymentController::class, 'detectGateway']);
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
            Route::get('/', [SimpleMediaController::class, 'index']);
        Route::post('/', [SimpleMediaController::class, 'upload']);
        Route::put('/{fileId}', [SimpleMediaController::class, 'update']);
        Route::delete('/{fileId}', [SimpleMediaController::class, 'destroy']);
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

// Routes PayDunya
Route::prefix('paydunya')->group(function () {
    Route::post('create-invoice', [App\Http\Controllers\Api\PayDunyaController::class, 'createInvoice']);
    Route::post('check-status', [App\Http\Controllers\Api\PayDunyaController::class, 'checkStatus']);
    Route::post('orange-money-qr', [App\Http\Controllers\Api\PayDunyaController::class, 'payWithOrangeMoneyQR']);
    Route::post('orange-money-otp', [App\Http\Controllers\Api\PayDunyaController::class, 'payWithOrangeMoneyOTP']);
    Route::post('free-money', [App\Http\Controllers\Api\PayDunyaController::class, 'payWithFreeMoney']);
    Route::post('wave', [App\Http\Controllers\Api\PayDunyaController::class, 'payWithWave']);
    Route::post('card', [App\Http\Controllers\Api\PayDunyaController::class, 'payWithCard']);
    Route::get('validate-keys', [App\Http\Controllers\Api\PayDunyaController::class, 'validateApiKeys']);
    Route::get('supported-methods', [App\Http\Controllers\Api\PayDunyaController::class, 'getSupportedMethods']);
    Route::post('webhook', [App\Http\Controllers\Api\PayDunyaController::class, 'webhook']);
});

// Route SOFTPAY Orange Money CI
Route::post('/process-paydunya-payment', [App\Http\Controllers\PaymentController::class, 'handlePayment']);

// Route SOFTPAY Wave CI
Route::post('/process-wave-ci-payment', [App\Http\Controllers\PaymentController::class, 'handleWaveCIPayment']);

// Route SOFTPAY Moov CI
Route::post('/process-moov-ci-payment', [App\Http\Controllers\PaymentController::class, 'handleMoovCIPayment']);

// Route SOFTPAY Orange Money Burkina Faso
Route::post('/process-orange-money-burkina-payment', [App\Http\Controllers\PaymentController::class, 'handleOrangeMoneyBurkinaPayment']);

// Routes SOFTPAY Orange Money Sénégal
Route::post('/process-orange-money-senegal-qr-payment', [App\Http\Controllers\PaymentController::class, 'handleOrangeMoneySenegalQRPayment']);
Route::post('/process-orange-money-senegal-otp-payment', [App\Http\Controllers\PaymentController::class, 'handleOrangeMoneySenegalOTPPayment']);

// Route SOFTPAY Free Money Sénégal
Route::post('/process-free-money-senegal-payment', [App\Http\Controllers\PaymentController::class, 'handleFreeMoneySenegalPayment']);

// Route SOFTPAY Expresso Sénégal
Route::post('/process-expresso-senegal-payment', [App\Http\Controllers\PaymentController::class, 'handleExpressoSenegalPayment']);

// Route SOFTPAY Wave Sénégal
Route::post('/process-wave-senegal-payment', [App\Http\Controllers\PaymentController::class, 'handleWaveSenegalPayment']);

// Routes SOFTPAY Wizall Sénégal
Route::post('/process-wizall-senegal-payment', [App\Http\Controllers\PaymentController::class, 'handleWizallSenegalPayment']);
Route::post('/process-wizall-senegal-confirm', [App\Http\Controllers\PaymentController::class, 'handleWizallSenegalConfirm']);

// Route SOFTPAY MTN Money CI
Route::post('/process-mtn-ci-payment', [App\Http\Controllers\PaymentController::class, 'handleMTNCIPayment']);

// Route SOFTPAY Moov Burkina Faso
Route::post('/process-moov-burkina-payment', [App\Http\Controllers\PaymentController::class, 'handleMoovBurkinaPayment']);

// Route SOFTPAY Moov Bénin
Route::post('/process-moov-benin-payment', [App\Http\Controllers\PaymentController::class, 'handleMoovBeninPayment']);

// Route SOFTPAY MTN Bénin
Route::post('/process-mtn-benin-payment', [App\Http\Controllers\PaymentController::class, 'handleMTNBeninPayment']);

// Route SOFTPAY T-Money Togo
Route::post('/process-t-money-togo-payment', [App\Http\Controllers\PaymentController::class, 'handleTMoneyTogoPayment']);

// Route SOFTPAY Moov Togo
Route::post('/process-moov-togo-payment', [App\Http\Controllers\PaymentController::class, 'handleMoovTogoPayment']);

// Route SOFTPAY Orange Money Mali
Route::post('/process-orange-money-mali-payment', [App\Http\Controllers\PaymentController::class, 'handleOrangeMoneyMaliPayment']);

// Route SOFTPAY Moov Mali
Route::post('/process-moov-mali-payment', [App\Http\Controllers\PaymentController::class, 'handleMoovMaliPayment']);

// Route SOFTPAY Orange Money CI OTP
Route::post('/process-orange-money-ci-payment', [App\Http\Controllers\PaymentController::class, 'handleOrangeMoneyCIPayment']);

// Routes de paiement principales
Route::prefix('payment')->group(function () {
    Route::post('initialize', [MainPaymentController::class, 'initializePayment']);
    Route::post('webhook', [MainPaymentController::class, 'webhook']);
    Route::get('check-status', [MainPaymentController::class, 'checkStatus']);
});

// Routes Pawapay
Route::prefix('pawapay')->group(function () {
    Route::post('initialize', [App\Http\Controllers\PawapayController::class, 'initializePayment']);
    Route::post('check-status', [App\Http\Controllers\PawapayController::class, 'checkPaymentStatus']);
    Route::post('resend-callback', [App\Http\Controllers\PawapayController::class, 'resendCallback']);
    Route::post('create-payment-page', [App\Http\Controllers\PawapayController::class, 'createPaymentPage']);
    Route::get('active-configuration', [App\Http\Controllers\PawapayController::class, 'getActiveConfiguration']);
    Route::post('process/{country}/{method}', [App\Http\Controllers\PawapayController::class, 'processPayment']);
});

// Routes Smart Payment (Système Intelligent avec Fallback)
Route::prefix('smart-payment')->group(function () {
    Route::post('initialize', [App\Http\Controllers\SmartPaymentController::class, 'initializePayment']);
    Route::post('check-status', [App\Http\Controllers\SmartPaymentController::class, 'checkPaymentStatus']);
    Route::get('available-methods', [App\Http\Controllers\SmartPaymentController::class, 'getAvailableMethods']);
    Route::get('provider-stats', [App\Http\Controllers\SmartPaymentController::class, 'getProviderStats']);
    Route::post('process/{country}/{method}', [App\Http\Controllers\SmartPaymentController::class, 'processPayment']);
});

// Routes pour les informations de boutique (checkout)
Route::prefix('store-info')->group(function () {
    Route::get('/', [App\Http\Controllers\StoreController::class, 'index']);
    Route::get('/{storeId}', [App\Http\Controllers\StoreController::class, 'show']);
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
// Routes pour Cloudflare R2
Route::prefix('files')->group(function () {
    Route::post('/upload', [App\Http\Controllers\FileController::class, 'upload']);
    Route::post('/upload-image', [App\Http\Controllers\FileController::class, 'uploadImage']);
    Route::delete('/delete', [App\Http\Controllers\FileController::class, 'delete']);
    Route::get('/list', [App\Http\Controllers\FileController::class, 'list']);
});

// Routes Lunar E-commerce
Route::prefix('lunar')->group(function () {
    // Routes publiques
    Route::get('products', [LunarProductController::class, 'index']);
    Route::get('products/{id}', [LunarProductController::class, 'show']);
    Route::get('products/search', [LunarProductController::class, 'search']);
    Route::get('products/featured', [LunarProductController::class, 'featured']);
    Route::get('products/category/{categorySlug}', [LunarProductController::class, 'byCategory']);
    Route::get('products/brand/{brandSlug}', [LunarProductController::class, 'byBrand']);
    
    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('products', [LunarProductController::class, 'store']);
        Route::put('products/{id}', [LunarProductController::class, 'update']);
        Route::delete('products/{id}', [LunarProductController::class, 'destroy']);
    });
});

// Routes Cloudflare R2 pour les uploads de médias
Route::prefix('cloudflare')->group(function () {
    // Routes publiques pour les uploads
    Route::post('/upload', [CloudflareController::class, 'upload']);
    Route::post('/upload-multiple', [CloudflareController::class, 'uploadMultiple']);
    Route::post('/upload-frontend', [CloudflareController::class, 'uploadFromFrontend']);
    Route::delete('/delete', [CloudflareController::class, 'delete']);
    Route::get('/info', [CloudflareController::class, 'info']);
    
    // Routes protégées (avec authentification)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/upload-secure', [CloudflareController::class, 'upload']);
        Route::post('/upload-multiple-secure', [CloudflareController::class, 'uploadMultiple']);
        Route::delete('/delete-secure', [CloudflareController::class, 'delete']);
    });
});

// Routes pour le proxy média (servir les fichiers depuis Cloudflare R2)
Route::prefix('media-proxy')->group(function () {
    Route::get('/{storeId}/file', [App\Http\Controllers\Api\MediaProxyController::class, 'serveByPath']);
    Route::get('/{storeId}/{mediaId}/thumbnail/{size?}', [App\Http\Controllers\Api\MediaProxyController::class, 'serveThumbnail']);
    Route::get('/{storeId}/{mediaId}', [App\Http\Controllers\Api\MediaProxyController::class, 'serve']);
});

Route::post('/payment/status', [App\Http\Controllers\PaymentController::class, 'checkPaymentStatus']);
