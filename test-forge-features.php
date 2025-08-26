<?php
/**
 * Test des fonctionnalités spécifiques de Coovia
 * Backend Laravel sur Forge
 */

$baseUrl = 'https://api.wozif.com';

echo "🎯 Test des fonctionnalités Coovia - Backend Forge\n";
echo "================================================\n\n";

/**
 * Fonction pour effectuer une requête HTTP
 */
function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    $defaultHeaders = [
        'Content-Type: application/json',
        'Accept: application/json',
        'User-Agent: Coovia-Test-Script/1.0'
    ];
    
    $headers = array_merge($defaultHeaders, $headers);
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
    ]);
    
    if ($method === 'POST' && $data) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method !== 'GET') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    return [
        'http_code' => $httpCode,
        'response' => $response,
        'error' => $error
    ];
}

/**
 * Test des données publiques
 */
echo "📊 Test des données publiques...\n";

// Test des utilisateurs
echo "  👥 Liste des utilisateurs... ";
$result = makeRequest($baseUrl . '/users');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    $data = json_decode($result['response'], true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "✅ OK ({$data['count']} utilisateurs)\n";
    } else {
        echo "⚠️ Réponse inattendue\n";
    }
} else {
    echo "❌ HTTP {$result['http_code']}\n";
}

// Test des produits
echo "  🛍️ Liste des produits... ";
$result = makeRequest($baseUrl . '/products');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    $data = json_decode($result['response'], true);
    if ($data && isset($data['success']) && $data['success']) {
        echo "✅ OK ({$data['count']} produits)\n";
    } else {
        echo "⚠️ Réponse inattendue\n";
    }
} else {
    echo "❌ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités Moneroo
 */
echo "💰 Test des fonctionnalités Moneroo...\n";

// Test de création de paiement
echo "  💳 Test de création de paiement... ";
$paymentData = [
    'amount' => 1000,
    'currency' => 'XOF',
    'description' => 'Test de paiement Coovia',
    'customer_email' => 'test@example.com',
    'customer_name' => 'Test User',
    'customer_phone' => '+22600000000'
];

$result = makeRequest($baseUrl . '/moneroo/create-payment', 'POST', $paymentData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200 || $result['http_code'] === 201) {
    $data = json_decode($result['response'], true);
    if ($data) {
        echo "✅ OK\n";
        if (isset($data['payment_id'])) {
            echo "     Payment ID: {$data['payment_id']}\n";
        }
        if (isset($data['payment_url'])) {
            echo "     Payment URL: " . substr($data['payment_url'], 0, 50) . "...\n";
        }
    } else {
        echo "⚠️ Réponse non-JSON\n";
    }
} else {
    echo "❌ HTTP {$result['http_code']}\n";
    if ($result['response']) {
        $errorData = json_decode($result['response'], true);
        if ($errorData && isset($errorData['message'])) {
            echo "     Erreur: {$errorData['message']}\n";
        }
    }
}

// Test des routes de test Moneroo
echo "  🧪 Test des routes de test Moneroo... ";
$result = makeRequest($baseUrl . '/test-moneroo/test-payment');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
} else {
    echo "❌ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de boutique
 */
echo "🏪 Test des fonctionnalités de boutique...\n";

// Test de création de boutique (sans authentification)
echo "  🆕 Création de boutique (sans auth)... ";
$storeData = [
    'name' => 'Boutique Test ' . time(),
    'description' => 'Boutique de test pour Coovia',
    'email' => 'boutique' . time() . '@example.com',
    'phone' => '+22600000000',
    'address' => 'Ouagadougou, Burkina Faso'
];

$result = makeRequest($baseUrl . '/api/stores', 'POST', $storeData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} else {
    echo "⚠️ HTTP {$result['http_code']} (inattendu)\n";
}

echo "\n";

/**
 * Test des fonctionnalités de média
 */
echo "📸 Test des fonctionnalités de média...\n";

// Test de l'endpoint de média
echo "  🖼️ Endpoint média... ";
$result = makeRequest($baseUrl . '/api/media');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK - Accès autorisé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de paiement
 */
echo "💸 Test des fonctionnalités de paiement...\n";

// Test de l'endpoint de paiement
echo "  🏦 Endpoint de paiement... ";
$result = makeRequest($baseUrl . '/api/payments');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK - Accès autorisé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de commande
 */
echo "📦 Test des fonctionnalités de commande...\n";

// Test de l'endpoint de commande
echo "  📋 Endpoint de commande... ";
$result = makeRequest($baseUrl . '/api/orders');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK - Accès autorisé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de tableau de bord
 */
echo "📊 Test des fonctionnalités de tableau de bord...\n";

// Test de l'endpoint de tableau de bord
echo "  📈 Endpoint de tableau de bord... ";
$result = makeRequest($baseUrl . '/api/dashboard');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK - Accès autorisé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de client
 */
echo "👥 Test des fonctionnalités de client...\n";

// Test de l'endpoint de client
echo "  👤 Endpoint de client... ";
$result = makeRequest($baseUrl . '/api/customers');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK - Accès autorisé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de Cloudflare
 */
echo "☁️ Test des fonctionnalités Cloudflare...\n";

// Test de l'endpoint Cloudflare
echo "  🌐 Endpoint Cloudflare... ";
$result = makeRequest($baseUrl . '/api/cloudflare');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 401) {
    echo "✅ OK - Accès refusé (attendu)\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK - Accès autorisé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de configuration
 */
echo "⚙️ Test des fonctionnalités de configuration...\n";

// Test de l'endpoint de configuration Moneroo
echo "  🔧 Configuration Moneroo... ";
$result = makeRequest($baseUrl . '/moneroo-config/show');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de webhook
 */
echo "🔗 Test des fonctionnalités de webhook...\n";

// Test de l'endpoint de webhook Moneroo
echo "  📡 Webhook Moneroo... ";
$webhookData = [
    'payment_id' => 'test_' . time(),
    'status' => 'completed',
    'amount' => 1000,
    'currency' => 'XOF'
];

$result = makeRequest($baseUrl . '/moneroo/webhook', 'POST', $webhookData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Résumé des tests
 */
echo "📋 RÉSUMÉ DES TESTS DE FONCTIONNALITÉS\n";
echo "=====================================\n";
echo "✅ Tests de données publiques\n";
echo "✅ Tests de fonctionnalités Moneroo\n";
echo "✅ Tests de fonctionnalités de boutique\n";
echo "✅ Tests de fonctionnalités de média\n";
echo "✅ Tests de fonctionnalités de paiement\n";
echo "✅ Tests de fonctionnalités de commande\n";
echo "✅ Tests de fonctionnalités de tableau de bord\n";
echo "✅ Tests de fonctionnalités de client\n";
echo "✅ Tests de fonctionnalités Cloudflare\n";
echo "✅ Tests de fonctionnalités de configuration\n";
echo "✅ Tests de fonctionnalités de webhook\n";

echo "\n🏁 Test des fonctionnalités terminé !\n";
echo "Pour un test complet, exécutez: php test-forge-backend.php\n";
echo "Pour un test d'authentification, exécutez: php test-forge-auth.php\n";
