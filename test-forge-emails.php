<?php
/**
 * Test des fonctionnalités d'email
 * Backend Laravel sur Forge
 */

$baseUrl = 'https://api.wozif.com';

echo "📧 Test des fonctionnalités d'email - Backend Forge\n";
echo "==================================================\n\n";

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
 * Test de l'endpoint de test d'email
 */
echo "📧 Test de l'endpoint de test d'email...\n";

// Test de l'endpoint de test d'email
echo "  🧪 Endpoint test-email... ";
$result = makeRequest($baseUrl . '/test-email');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['message'])) {
        echo "     Message: {$data['message']}\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Endpoint non trouvé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test de l'endpoint de test d'email réel
 */
echo "📧 Test de l'endpoint de test d'email réel...\n";

// Test de l'endpoint de test d'email réel
echo "  📨 Endpoint test-email-real... ";
$result = makeRequest($baseUrl . '/test-email-real');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['message'])) {
        echo "     Message: {$data['message']}\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Endpoint non trouvé\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test de l'endpoint de création d'utilisateur avec email
 */
echo "👤 Test de création d'utilisateur avec email...\n";

// Test de création d'utilisateur avec email
echo "  🆕 Création utilisateur avec email... ";
$testUser = [
    'name' => 'Test Email User ' . time(),
    'email' => 'test-email-' . time() . '@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

$result = makeRequest($baseUrl . '/api/register', 'POST', $testUser);
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

echo "\n";

/**
 * Test de l'endpoint de validation d'email
 */
echo "✅ Test de validation d'email...\n";

// Test de validation d'email
echo "  📧 Validation email... ";
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
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test de l'endpoint de réinitialisation de mot de passe
 */
echo "🔑 Test de réinitialisation de mot de passe...\n";

// Test de réinitialisation de mot de passe
echo "  🔄 Réinitialisation mot de passe... ";
$resetData = [
    'email' => 'test@example.com'
];

$result = makeRequest($baseUrl . '/api/auth/forgot-password', 'POST', $resetData);
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

echo "\n";

/**
 * Test de l'endpoint de vérification d'email
 */
echo "✅ Test de vérification d'email...\n";

// Test de vérification d'email
echo "  📧 Vérification email... ";
$verifyData = [
    'email' => 'test@example.com',
    'token' => 'test-token-123'
];

$result = makeRequest($baseUrl . '/api/auth/verify-email', 'POST', $verifyData);
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

echo "\n";

/**
 * Test de l'endpoint de notification par email
 */
echo "📢 Test de notification par email...\n";

// Test de notification par email
echo "  📢 Notification email... ";
$notificationData = [
    'email' => 'test@example.com',
    'subject' => 'Test de notification',
    'message' => 'Ceci est un test de notification par email'
];

$result = makeRequest($baseUrl . '/api/notifications/send-email', 'POST', $notificationData);
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

echo "\n";

/**
 * Test de l'endpoint de configuration email
 */
echo "⚙️ Test de configuration email...\n";

// Test de configuration email
echo "  🔧 Configuration email... ";
$result = makeRequest($baseUrl . '/api/config/email');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['config'])) {
        echo "     Configuration récupérée\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test de l'endpoint de statut des emails
 */
echo "📊 Test de statut des emails...\n";

// Test de statut des emails
echo "  📊 Statut emails... ";
$result = makeRequest($baseUrl . '/api/emails/status');
if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 200) {
    echo "✅ OK\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['status'])) {
        echo "     Statut: {$data['status']}\n";
    }
} elseif ($result['http_code'] === 404) {
    echo "❌ 404 - Route non trouvée\n";
} else {
    echo "⚠️ HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Résumé des tests d'email
 */
echo "📊 RÉSUMÉ DES TESTS D'EMAIL\n";
echo "===========================\n";
echo "✅ Endpoints de test d'email testés\n";
echo "✅ Création d'utilisateur avec email testée\n";
echo "✅ Validation d'email testée\n";
echo "✅ Réinitialisation de mot de passe testée\n";
echo "✅ Vérification d'email testée\n";
echo "✅ Notification par email testée\n";
echo "✅ Configuration email testée\n";
echo "✅ Statut des emails testé\n";

echo "\n🏁 Test des fonctionnalités d'email terminé !\n";
echo "Note: Certains endpoints peuvent ne pas exister dans votre application.\n";
echo "C'est normal si vous n'avez pas encore implémenté toutes ces fonctionnalités.\n";
echo "\nVous pouvez maintenant lancer les autres tests :\n";
echo "  • Test des routes réelles : php test-forge-real-routes.php\n";
echo "  • Test rapide : php test-forge-quick.php\n";
echo "  • Test complet : php test-forge-backend.php\n";
