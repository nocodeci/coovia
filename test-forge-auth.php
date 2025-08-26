<?php
/**
 * Test de l'authentification et des fonctionnalités principales
 * Backend Laravel sur Forge
 */

$baseUrl = 'https://api.wozif.com';

echo "🔐 Test de l'authentification - Backend Forge\n";
echo "============================================\n\n";

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
        CURLOPT_TIMEOUT => 15,
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
 * Test de l'endpoint de test public
 */
echo "📡 Test de l'endpoint public /test...\n";
$result = makeRequest($baseUrl . '/test');

if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n\n";
} elseif ($result['http_code'] === 200) {
    $data = json_decode($result['response'], true);
    if ($data) {
        echo "✅ Succès - HTTP {$result['http_code']}\n";
        echo "   Message: {$data['message']}\n";
        echo "   Version: {$data['version']}\n";
        echo "   Environment: {$data['environment']}\n\n";
    } else {
        echo "⚠️ Réponse non-JSON valide\n\n";
    }
} else {
    echo "❌ Échec - HTTP {$result['http_code']}\n\n";
}

/**
 * Test de l'endpoint de statut avec base de données
 */
echo "🗄️ Test de l'endpoint /status (base de données)...\n";
$result = makeRequest($baseUrl . '/status');

if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n\n";
} elseif ($result['http_code'] === 200) {
    $data = json_decode($result['response'], true);
    if ($data) {
        echo "✅ Succès - HTTP {$result['http_code']}\n";
        echo "   API Status: {$data['api']['status']}\n";
        echo "   Database Connected: " . ($data['database']['connected'] ? 'Oui' : 'Non') . "\n";
        if (!$data['database']['connected']) {
            echo "   Erreur DB: {$data['database']['error']}\n";
        }
        echo "   Laravel Version: {$data['laravel']['version']}\n\n";
    } else {
        echo "⚠️ Réponse non-JSON valide\n\n";
    }
} else {
    echo "❌ Échec - HTTP {$result['http_code']}\n\n";
}

/**
 * Test des routes d'API protégées (sans token)
 */
echo "🔒 Test des routes protégées (sans authentification)...\n";

$protectedRoutes = [
    '/api/stores' => 'Liste des boutiques',
    '/api/products' => 'Liste des produits',
    '/api/orders' => 'Liste des commandes'
];

foreach ($protectedRoutes as $route => $description) {
    echo "  {$description}... ";
    
    $result = makeRequest($baseUrl . $route);
    
    if ($result['error']) {
        echo "❌ Erreur de connexion\n";
    } elseif ($result['http_code'] === 401) {
        echo "✅ OK - Accès refusé (attendu)\n";
    } elseif ($result['http_code'] === 200) {
        echo "⚠️ Accès autorisé (inattendu)\n";
    } else {
        echo "❌ HTTP {$result['http_code']}\n";
    }
}

echo "\n";

/**
 * Test de création d'un utilisateur de test
 */
echo "👤 Test de création d'utilisateur...\n";

$testUser = [
    'name' => 'Test User ' . time(),
    'email' => 'test' . time() . '@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123'
];

$result = makeRequest($baseUrl . '/api/register', 'POST', $testUser);

if ($result['error']) {
    echo "❌ Erreur: {$result['error']}\n";
} elseif ($result['http_code'] === 201 || $result['http_code'] === 200) {
    $data = json_decode($result['response'], true);
    if ($data && isset($data['user'])) {
        echo "✅ Utilisateur créé avec succès\n";
        echo "   ID: {$data['user']['id']}\n";
        echo "   Email: {$data['user']['email']}\n";
        
        // Test de connexion avec le nouvel utilisateur
        echo "\n🔑 Test de connexion...\n";
        
        $loginData = [
            'email' => $testUser['email'],
            'password' => $testUser['password']
        ];
        
        $loginResult = makeRequest($baseUrl . '/api/login', 'POST', $loginData);
        
        if ($loginResult['error']) {
            echo "❌ Erreur de connexion: {$loginResult['error']}\n";
        } elseif ($loginResult['http_code'] === 200) {
            $loginResponse = json_decode($loginResult['response'], true);
            if ($loginResponse && isset($loginResponse['token'])) {
                echo "✅ Connexion réussie\n";
                echo "   Token reçu: " . substr($loginResponse['token'], 0, 20) . "...\n";
                
                // Test d'accès aux routes protégées avec le token
                echo "\n🔓 Test d'accès aux routes protégées...\n";
                
                $token = $loginResponse['token'];
                $headers = ['Authorization: Bearer ' . $token];
                
                $storesResult = makeRequest($baseUrl . '/api/stores', 'GET', null, $headers);
                
                if ($storesResult['http_code'] === 200) {
                    echo "✅ Accès aux boutiques autorisé\n";
                } else {
                    echo "❌ Accès aux boutiques refusé - HTTP {$storesResult['http_code']}\n";
                }
                
            } else {
                echo "❌ Pas de token dans la réponse\n";
            }
        } else {
            echo "❌ Échec de connexion - HTTP {$loginResult['http_code']}\n";
        }
        
    } else {
        echo "⚠️ Réponse inattendue\n";
    }
} elseif ($result['http_code'] === 422) {
    echo "⚠️ Erreur de validation (peut être normal)\n";
    $data = json_decode($result['response'], true);
    if ($data && isset($data['errors'])) {
        foreach ($data['errors'] as $field => $errors) {
            echo "   {$field}: " . implode(', ', $errors) . "\n";
        }
    }
} else {
    echo "❌ Échec - HTTP {$result['http_code']}\n";
}

echo "\n";

/**
 * Test des fonctionnalités de base
 */
echo "🔧 Test des fonctionnalités de base...\n";

// Test de l'endpoint ping
$pingResult = makeRequest($baseUrl . '/ping');
if ($pingResult['http_code'] === 200) {
    echo "✅ Ping fonctionne\n";
} else {
    echo "❌ Ping échoue - HTTP {$pingResult['http_code']}\n";
}

// Test de l'endpoint health
$healthResult = makeRequest($baseUrl . '/health');
if ($healthResult['http_code'] === 200) {
    echo "✅ Health check fonctionne\n";
} else {
    echo "❌ Health check échoue - HTTP {$healthResult['http_code']}\n";
}

echo "\n🏁 Test d'authentification terminé !\n";
echo "Pour un test complet, exécutez: php test-forge-backend.php\n";
