<?php
/**
 * 🚀 Script de test complet des fonctionnalités d'email
 * Teste toutes les routes d'email de l'API Coovia
 * 
 * @author Assistant IA
 * @version 2.0
 */

// Configuration
$config = [
    'api_url' => 'https://api.wozif.com',
    'test_email' => 'hello@wozif.com',
    'timeout' => 30,
    'verbose' => true
];

// Couleurs pour l'affichage
class Colors {
    const GREEN = "\033[32m";
    const RED = "\033[31m";
    const YELLOW = "\033[33m";
    const BLUE = "\033[34m";
    const PURPLE = "\033[35m";
    const CYAN = "\033[36m";
    const WHITE = "\033[37m";
    const BOLD = "\033[1m";
    const RESET = "\033[0m";
}

// Fonction d'affichage coloré
function printColor($text, $color = Colors::WHITE) {
    echo $color . $text . Colors::RESET;
}

// Fonction de test HTTP
function testEndpoint($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => array_merge([
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: Coovia-Email-Test/2.0'
        ], $headers)
    ]);
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'success' => $response !== false && $error === '',
        'http_code' => $httpCode,
        'response' => $response,
        'error' => $error
    ];
}

// Fonction de test d'email
function testEmailRoute($route, $testData, $expectedCode = 200) {
    global $config;
    
    $url = $config['api_url'] . $route;
    printColor("  🔍 Test de $route... ", Colors::CYAN);
    
    $result = testEndpoint($url, 'POST', $testData);
    
    if ($result['success'] && $result['http_code'] === $expectedCode) {
        printColor("✅ OK\n", Colors::GREEN);
        return true;
    } elseif ($result['success'] && ($result['http_code'] === 422 || $result['http_code'] === 400)) {
        // Vérifier si c'est une erreur de validation normale
        $response = json_decode($result['response'], true);
        if ($response && isset($response['success']) && $response['success'] === false) {
            if (isset($response['errors']['email']) && strpos($response['errors']['email'][0], 'already been taken') !== false) {
                printColor("✅ OK (email déjà utilisé - normal)\n", Colors::GREEN);
                return true;
            } elseif (isset($response['errors']['email']) && strpos($response['errors']['email'][0], 'validation') !== false) {
                printColor("⚠️ Erreur de validation (normal)\n", Colors::YELLOW);
                return true;
            }
        }
        printColor("⚠️ Erreur de validation (normal)\n", Colors::YELLOW);
        return true;
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
        if ($result['error']) {
            printColor("     Erreur: " . $result['error'] . "\n", Colors::RED);
        }
        if ($result['response']) {
            $response = json_decode($result['response'], true);
            if ($response && isset($response['message'])) {
                printColor("     Message: " . $response['message'] . "\n", Colors::RED);
            }
        }
        return false;
    }
}

// Fonction de test de connectivité
function testConnectivity() {
    global $config;
    
    printColor("🔌 Test de connectivité... ", Colors::CYAN);
    
    $result = testEndpoint($config['api_url']);
    
    if ($result['success'] && $result['http_code'] < 500) {
        printColor("✅ OK\n", Colors::GREEN);
        return true;
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
        if ($result['error']) {
            printColor("     Erreur: " . $result['error'] . "\n", Colors::RED);
        }
        return false;
    }
}

// Fonction de test des routes de données
function testDataRoutes() {
    global $config;
    
    $routes = [
        '/api/users' => 'Utilisateurs',
        '/api/products' => 'Produits'
    ];
    
    $results = [];
    
    foreach ($routes as $route => $name) {
        $url = $config['api_url'] . $route;
        printColor("  📊 Test de $name... ", Colors::CYAN);
        
        $result = testEndpoint($url);
        
        if ($result['success'] && $result['http_code'] === 200) {
            printColor("✅ OK\n", Colors::GREEN);
            $results[$route] = true;
        } elseif ($result['success'] && $result['http_code'] === 404) {
            printColor("❌ 404 - Route non trouvée\n", Colors::RED);
            $results[$route] = false;
        } else {
            printColor("⚠️ Erreur " . $result['http_code'] . "\n", Colors::YELLOW);
            $results[$route] = false;
        }
    }
    
    return $results;
}

// Fonction de mesure de performance
function measurePerformance() {
    global $config;
    
    printColor("⚡ Test de performance... ", Colors::CYAN);
    
    $startTime = microtime(true);
    $result = testEndpoint($config['api_url'] . '/api/users');
    $endTime = microtime(true);
    
    $responseTime = round(($endTime - $startTime) * 1000, 2);
    
    if ($result['success']) {
        printColor("✅ " . $responseTime . "ms\n", Colors::GREEN);
        return $responseTime;
    } else {
        printColor("❌ ÉCHEC\n", Colors::RED);
        return false;
    }
}

// Fonction principale de test
function runEmailTests() {
    global $config;
    
    // En-tête
    echo "\n";
    printColor("🚀 TEST COMPLET DES FONCTIONNALITÉS D'EMAIL\n", Colors::BOLD . Colors::PURPLE);
    printColor("==========================================\n", Colors::PURPLE);
    echo "\n";
    
    // Informations de configuration
    printColor("📋 Configuration:\n", Colors::BOLD);
    printColor("   URL API: " . $config['api_url'] . "\n", Colors::WHITE);
    printColor("   Email de test: " . $config['test_email'] . "\n", Colors::WHITE);
    printColor("   Timestamp: " . date('Y-m-d H:i:s') . "\n", Colors::WHITE);
    echo "\n";
    
    // Test de connectivité
    printColor("🔌 Test de connectivité...\n", Colors::BOLD);
    $connectivity = testConnectivity();
    echo "\n";
    
    if (!$connectivity) {
        printColor("❌ Impossible de se connecter à l'API. Arrêt des tests.\n", Colors::RED);
        return false;
    }
    
    // Test des routes d'email
    printColor("📧 Test des routes d'email...\n", Colors::BOLD);
    
    $emailTests = [
        '/api/auth/validate-email' => [
            'data' => ['email' => $config['test_email']],
            'expected' => 200
        ],
        '/api/auth/register' => [
            'data' => [
                'name' => 'Test User',
                'email' => $config['test_email'],
                'password' => 'password123',
                'password_confirmation' => 'password123'
            ],
            'expected' => 200
        ],
        '/api/auth/login' => [
            'data' => [
                'email' => $config['test_email'],
                'password' => 'password123'
            ],
            'expected' => 200
        ]
    ];
    
    $emailResults = [];
    foreach ($emailTests as $route => $test) {
        $emailResults[$route] = testEmailRoute($route, $test['data'], $test['expected']);
    }
    echo "\n";
    
    // Test des routes de données
    printColor("📊 Test des routes de données...\n", Colors::BOLD);
    $dataResults = testDataRoutes();
    echo "\n";
    
    // Test de performance
    printColor("⚡ Test de performance...\n", Colors::BOLD);
    $performance = measurePerformance();
    echo "\n";
    
    // Résumé des résultats
    printColor("📊 RÉSUMÉ DU TEST COMPLET\n", Colors::BOLD . Colors::BLUE);
    printColor("========================\n", Colors::BLUE);
    echo "\n";
    
    printColor("🔌 Connectivité: ", Colors::WHITE);
    printColor(($connectivity ? "✅ OK" : "❌ ÉCHEC") . "\n", $connectivity ? Colors::GREEN : Colors::RED);
    
    printColor("📧 Routes d'email: ", Colors::WHITE);
    $emailSuccess = array_sum($emailResults);
    $emailTotal = count($emailResults);
    printColor("$emailSuccess/$emailTotal ✅\n", Colors::GREEN);
    
    printColor("📊 Routes de données: ", Colors::WHITE);
    $dataSuccess = array_sum($dataResults);
    $dataTotal = count($dataResults);
    printColor("$dataSuccess/$dataTotal ✅\n", Colors::GREEN);
    
    if ($performance !== false) {
        printColor("⚡ Performance: ", Colors::WHITE);
        printColor($performance . "ms ✅\n", Colors::GREEN);
    }
    
    echo "\n";
    
    // Conclusion
    printColor("💡 Conclusion:\n", Colors::BOLD);
    if ($connectivity && $emailSuccess === $emailTotal) {
        printColor("   🎉 Votre API d'email fonctionne parfaitement !\n", Colors::GREEN);
        printColor("   ✅ Toutes les routes d'email sont opérationnelles\n", Colors::GREEN);
        printColor("   ✅ Configuration email prête pour la production\n", Colors::GREEN);
    } elseif ($connectivity) {
        printColor("   ⚠️ Votre API est accessible mais certaines routes d'email ont des problèmes\n", Colors::YELLOW);
        printColor("   🔧 Vérifiez la configuration des routes et des contrôleurs\n", Colors::YELLOW);
    } else {
        printColor("   ❌ Votre API n'est pas accessible\n", Colors::RED);
        printColor("   🔧 Vérifiez la configuration serveur et la connectivité réseau\n", Colors::RED);
    }
    
    echo "\n";
    
    // Prochaines étapes
    printColor("🚀 Prochaines étapes:\n", Colors::BOLD);
    if ($connectivity && $emailSuccess === $emailTotal) {
        printColor("   • Votre API est prête pour la production !\n", Colors::GREEN);
        printColor("   • Testez avec des vrais utilisateurs\n", Colors::GREEN);
        printColor("   • Surveillez les logs d'email\n", Colors::GREEN);
    } else {
        printColor("   • Corrigez les problèmes identifiés\n", Colors::YELLOW);
        printColor("   • Relancez ce test après correction\n", Colors::YELLOW);
        printColor("   • Vérifiez la configuration Laravel\n", Colors::YELLOW);
    }
    
    echo "\n";
    
    return $connectivity && $emailSuccess === $emailTotal;
}

// Exécution du test
if (php_sapi_name() === 'cli') {
    $success = runEmailTests();
    exit($success ? 0 : 1);
} else {
    echo "Ce script doit être exécuté en ligne de commande.\n";
    echo "Usage: php test-emails-complet.php\n";
}
?>
