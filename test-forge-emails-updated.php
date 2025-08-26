<?php
/**
 * Test des fonctionnalités d'email - Version mise à jour
 * Backend Laravel sur Forge - Routes réelles de Coovia
 */

$baseUrl = 'https://api.wozif.com';

echo "📧 Test des fonctionnalités d'email - Backend Forge (MIS À JOUR)\n";
echo "==============================================================\n\n";

echo "URL: {$baseUrl}\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";

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
 * Test des routes d'authentification avec email
 */
echo "🔐 Test des routes d'authentification avec email...\n";

// Test de validation d'email
echo "  📧 Validation email (/api/auth/validate-email)... ";
$emailData = [
    'email' => 'test@example.com'
];

$result = makeRequest($baseUrl . '/api/auth/validate-email', 'POST', $emailData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['message'])) {
        echo "     Message: {$data['message']}\n";
    }
} elseif ($result['http_code'] === 422) {
    echo "⚠️ Erreur de validation\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['errors'])) {
        foreach ($data['errors'] as $field => $errors) {
            echo "     {$field}: " . implode(', ', $errors) . "\n";
        }
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

// Test de validation de mot de passe
echo "  🔑 Validation mot de passe (/api/auth/validate-password)... ";
$passwordData = [
    'password' => 'password123'
];

$result = makeRequest($baseUrl . '/api/auth/validate-password', 'POST', $passwordData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['message'])) {
        echo "     Message: {$data['message']}\n";
    }
} elseif ($result['http_code'] === 422) {
    echo "⚠️ Erreur de validation\n";
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

// Test d'inscription
echo "  🆕 Inscription (/api/auth/register)... ";
$registerData = [
    'name' => 'Test Email User ' . time(),
    'email' => 'test-email-' . time() . '@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

$result = makeRequest($baseUrl . '/api/auth/register', 'POST', $registerData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 201 || $result['http_code'] === 200) {
    echo "✅ OK - Utilisateur créé\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['user']['email'])) {
        echo "     Email: {$data['user']['email']}\n";
    }
} elseif ($result['http_code'] === 422) {
    echo "⚠️ Erreur de validation\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['errors'])) {
        foreach ($data['errors'] as $field => $errors) {
            echo "     {$field}: " . implode(', ', $errors) . "\n";
        }
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

// Test de connexion
echo "  🔑 Connexion (/api/auth/login)... ";
$loginData = [
    'email' => 'test@example.com',
    'password' => 'password123'
];

$result = makeRequest($baseUrl . '/api/auth/login', 'POST', $loginData);
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['token'])) {
        echo "     Token reçu: " . substr($data['token'], 0, 20) . "...\n";
    }
} elseif ($result['http_code'] === 422) {
    echo "⚠️ Erreur de validation\n";
} elseif ($result['http_code'] === 401) {
    echo "⚠️ 401 - Identifiants invalides\n";
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des routes de données publiques
 */
echo "📊 Test des routes de données publiques...\n";

// Test de récupération des utilisateurs
echo "  👥 Utilisateurs (/users)... ";
$result = makeRequest($baseUrl . '/users');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['count'])) {
        echo "     Nombre d'utilisateurs: {$data['count']}\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

// Test de récupération des produits
echo "  🛍️ Produits (/products)... ";
$result = makeRequest($baseUrl . '/products');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['count'])) {
        echo "     Nombre de produits: {$data['count']}\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des routes de boutique
 */
echo "🏪 Test des routes de boutique...\n";

// Test de vérification de sous-domaine
echo "  🔍 Vérification sous-domaine (/api/stores/subdomain/test/check)... ";
$result = makeRequest($baseUrl . '/api/stores/subdomain/test/check');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['available'])) {
        echo "     Disponible: " . ($data['available'] ? 'Oui' : 'Non') . "\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test de performance des routes d'email
 */
echo "⚡ Test de performance des routes d'email...\n";

$start = microtime(true);
$result = makeRequest($baseUrl . '/api/auth/validate-email', 'POST', ['email' => 'test@example.com']);
$end = microtime(true);

if ($result['http_code'] === 200 || $result['http_code'] === 422 || $result['http_code'] === 404) {
    $time = ($end - $start) * 1000;
    if ($time < 500) {
        echo "✅ Performance excellente ({$time}ms)\n";
    } elseif ($time < 1000) {
        echo "👍 Performance bonne ({$time}ms)\n";
    } elseif ($time < 2000) {
        echo "⚠️ Performance acceptable ({$time}ms)\n";
    } else {
        echo "❌ Performance lente ({$time}ms)\n";
    }
} else {
    echo "❌ Impossible de tester la performance\n";
}

echo "\n";

/**
 * Résumé des tests d'email mis à jour
 */
echo "📊 RÉSUMÉ DES TESTS D'EMAIL MIS À JOUR\n";
echo "=====================================\n";
echo "✅ Routes d'authentification testées\n";
echo "✅ Routes de données publiques testées\n";
echo "✅ Routes de boutique testées\n";
echo "✅ Performance testée\n";

echo "\n🏁 Test des fonctionnalités d'email mis à jour terminé !\n";
echo "\nNote: Ce test utilise les routes réelles de votre application Coovia.\n";
echo "Les routes qui retournent 404 ne sont pas encore implémentées.\n";
echo "\nVous pouvez maintenant lancer les autres tests :\n";
echo "  • Test des routes réelles : php test-forge-real-routes.php\n";
echo "  • Test rapide : php test-forge-quick.php\n";
echo "  • Test complet : php test-forge-backend.php\n";
