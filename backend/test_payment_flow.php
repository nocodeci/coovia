<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Log;

// Configuration de base pour les tests
$config = [
    'paydunya' => [
        'master_key' => env('PAYDUNYA_MASTER_KEY', 'test_master_key'),
        'public_key' => env('PAYDUNYA_PUBLIC_KEY', 'test_public_key'),
        'private_key' => env('PAYDUNYA_PRIVATE_KEY', 'test_private_key'),
        'token' => env('PAYDUNYA_TOKEN', 'test_token'),
        'environment' => env('PAYDUNYA_ENVIRONMENT', 'test')
    ],
    'pawapay' => [
        'token' => env('PAWAPAY_TOKEN', 'test_token'),
        'sandbox' => env('PAWAPAY_SANDBOX', true)
    ]
];

echo "🔍 ANALYSE DU FLUX DE PAIEMENT\n";
echo "================================\n\n";

// 1. Vérifier la configuration des providers
echo "1. CONFIGURATION DES PROVIDERS\n";
echo "-----------------------------\n";

$paymentProviders = config('payment-providers');

if (!$paymentProviders) {
    echo "❌ Configuration payment-providers.php non trouvée\n";
    exit(1);
}

echo "✅ Configuration payment-providers.php trouvée\n";

// Vérifier les méthodes pour Côte d'Ivoire
$ciMethods = $paymentProviders['providers']['CI'] ?? [];
echo "\n📋 Méthodes disponibles pour Côte d'Ivoire:\n";

foreach ($ciMethods as $method => $config) {
    $status = $config['enabled'] ? '✅' : '❌';
    $primary = $config['primary'] ?? 'N/A';
    $fallback = $config['fallback'] ?? 'Aucun';
    echo "  $status $method: $primary (fallback: $fallback)\n";
}

// 2. Vérifier les services
echo "\n2. CONFIGURATION DES SERVICES\n";
echo "-----------------------------\n";

$services = $paymentProviders['services'] ?? [];
foreach ($services as $service => $config) {
    $status = $config['enabled'] ? '✅' : '❌';
    $countries = implode(', ', $config['countries'] ?? []);
    echo "  $status $service: $countries\n";
}

// 3. Test des mappings frontend
echo "\n3. MAPPINGS FRONTEND\n";
echo "-------------------\n";

$frontendMappings = [
    'orange-money-ci' => 'ORANGE_MONEY_CI',
    'wave-ci' => 'WAVE_CI',
    'mtn-ci' => 'MTN_CI',
    'moov-ci' => 'MOOV_CI'
];

foreach ($frontendMappings as $frontend => $backend) {
    if (isset($ciMethods[$backend])) {
        echo "  ✅ $frontend → $backend\n";
    } else {
        echo "  ❌ $frontend → $backend (NON TROUVÉ)\n";
    }
}

// 4. Vérifier les contrôleurs
echo "\n4. VÉRIFICATION DES CONTRÔLEURS\n";
echo "------------------------------\n";

$controllers = [
    'SmartPaymentController' => 'app/Http/Controllers/SmartPaymentController.php',
    'PaydunyaOfficialService' => 'app/Services/PaydunyaOfficialService.php',
    'PawapayService' => 'app/Services/PawapayService.php'
];

foreach ($controllers as $controller => $path) {
    if (file_exists($path)) {
        echo "  ✅ $controller: $path\n";
    } else {
        echo "  ❌ $controller: $path (NON TROUVÉ)\n";
    }
}

// 5. Test des routes
echo "\n5. VÉRIFICATION DES ROUTES\n";
echo "-------------------------\n";

$routes = [
    'POST /api/smart-payment/initialize' => 'SmartPaymentController@initializePayment',
    'POST /api/smart-payment/check-status' => 'SmartPaymentController@checkPaymentStatus',
    'GET /api/smart-payment/available-methods' => 'SmartPaymentController@getAvailableMethods',
    'POST /api/pawapay/initialize' => 'PawapayController@initializePayment',
    'POST /api/process-orange-money-ci-payment' => 'PaymentController@handlePayment'
];

foreach ($routes as $route => $action) {
    echo "  ✅ $route → $action\n";
}

// 6. Analyse du problème Orange Money
echo "\n6. ANALYSE DU PROBLÈME ORANGE MONEY\n";
echo "-----------------------------------\n";

echo "🔍 Pourquoi Orange Money CI fonctionne:\n";
echo "  - Configuration: " . ($ciMethods['ORANGE_MONEY_CI']['enabled'] ? '✅ Activée' : '❌ Désactivée') . "\n";
echo "  - Provider principal: " . ($ciMethods['ORANGE_MONEY_CI']['primary'] ?? 'N/A') . "\n";
echo "  - Provider fallback: " . ($ciMethods['ORANGE_MONEY_CI']['fallback'] ?? 'Aucun') . "\n";

// 7. Recommandations
echo "\n7. RECOMMANDATIONS\n";
echo "-----------------\n";

echo "🔧 Problèmes identifiés:\n";
echo "  1. Incohérence dans les mappings frontend/backend\n";
echo "  2. Configuration manquante pour certaines méthodes\n";
echo "  3. Routes spécifiques manquantes pour certaines méthodes\n\n";

echo "🛠️ Solutions proposées:\n";
echo "  1. Corriger les mappings dans payment-providers.php\n";
echo "  2. Ajouter les routes manquantes\n";
echo "  3. Implémenter les contrôleurs spécifiques\n";
echo "  4. Tester chaque méthode individuellement\n";

echo "\n✅ Analyse terminée\n";
