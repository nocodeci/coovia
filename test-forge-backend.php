<?php
/**
 * Script de test complet pour le backend Laravel déployé sur Forge
 * Teste tous les endpoints critiques et vérifie la connectivité
 */

// Configuration
$baseUrl = 'https://api.wozif.com';
$timeout = 30;

// Couleurs pour l'affichage
$colors = [
    'success' => "\033[32m",
    'error' => "\033[31m",
    'warning' => "\033[33m",
    'info' => "\033[36m",
    'reset' => "\033[0m"
];

echo "🚀 Test du Backend Laravel sur Forge - {$baseUrl}\n";
echo "================================================\n\n";

/**
 * Fonction pour effectuer une requête HTTP
 */
function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    global $timeout;
    
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
        CURLOPT_TIMEOUT => $timeout,
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
    $info = curl_getinfo($ch);
    
    curl_close($ch);
    
    return [
        'http_code' => $httpCode,
        'response' => $response,
        'error' => $error,
        'info' => $info
    ];
}

/**
 * Fonction pour afficher le résultat d'un test
 */
function displayResult($testName, $success, $message = '', $details = null) {
    global $colors;
    
    $status = $success ? "✅ PASS" : "❌ FAIL";
    $color = $success ? $colors['success'] : $colors['error'];
    
    echo "{$color}{$status}{$colors['reset']} {$testName}\n";
    
    if ($message) {
        echo "   {$colors['info']}{$message}{$colors['reset']}\n";
    }
    
    if ($details && !$success) {
        echo "   {$colors['warning']}Détails: {$details}{$colors['reset']}\n";
    }
    
    echo "\n";
    
    return $success;
}

/**
 * Test de connectivité de base
 */
function testBasicConnectivity() {
    global $baseUrl;
    
    echo "🔍 Test de connectivité de base...\n";
    
    $result = makeRequest($baseUrl);
    
    if ($result['error']) {
        return displayResult('Connectivité de base', false, 'Erreur de connexion', $result['error']);
    }
    
    if ($result['http_code'] >= 200 && $result['http_code'] < 400) {
        return displayResult('Connectivité de base', true, "HTTP {$result['http_code']} - Serveur accessible");
    }
    
    return displayResult('Connectivité de base', false, 'Serveur non accessible', "HTTP {$result['http_code']}");
}

/**
 * Test des endpoints de santé
 */
function testHealthEndpoints() {
    global $baseUrl;
    
    echo "🏥 Test des endpoints de santé...\n";
    
    $endpoints = [
        '/health' => 'Endpoint de santé',
        '/status' => 'Endpoint de statut',
        '/ping' => 'Endpoint ping',
        '/test' => 'Endpoint de test'
    ];
    
    $allPassed = true;
    
    foreach ($endpoints as $endpoint => $description) {
        $url = $baseUrl . $endpoint;
        $result = makeRequest($url);
        
        if ($result['error']) {
            displayResult($description, false, 'Erreur de connexion', $result['error']);
            $allPassed = false;
            continue;
        }
        
        if ($result['http_code'] === 200) {
            $response = json_decode($result['response'], true);
            if ($response) {
                displayResult($description, true, "HTTP 200 - Réponse valide");
            } else {
                displayResult($description, false, 'Réponse non-JSON valide');
                $allPassed = false;
            }
        } else {
            displayResult($description, false, 'Erreur HTTP', "HTTP {$result['http_code']}");
            $allPassed = false;
        }
    }
    
    return $allPassed;
}

/**
 * Test de la base de données
 */
function testDatabase() {
    global $baseUrl;
    
    echo "🗄️ Test de la base de données...\n";
    
    $url = $baseUrl . '/status';
    $result = makeRequest($url);
    
    if ($result['error']) {
        return displayResult('Connexion base de données', false, 'Erreur de connexion', $result['error']);
    }
    
    if ($result['http_code'] !== 200) {
        return displayResult('Connexion base de données', false, 'Erreur HTTP', "HTTP {$result['http_code']}");
    }
    
    $response = json_decode($result['response'], true);
    
    if (!$response) {
        return displayResult('Connexion base de données', false, 'Réponse invalide');
    }
    
    if (isset($response['database']['connected']) && $response['database']['connected']) {
        return displayResult('Connexion base de données', true, 'Base de données connectée');
    }
    
    $error = $response['database']['error'] ?? 'Erreur inconnue';
    return displayResult('Connexion base de données', false, 'Base de données non connectée', $error);
}

/**
 * Test des performances
 */
function testPerformance() {
    global $baseUrl;
    
    echo "⚡ Test des performances...\n";
    
    $url = $baseUrl . '/ping';
    $times = [];
    
    for ($i = 0; $i < 5; $i++) {
        $start = microtime(true);
        $result = makeRequest($url);
        $end = microtime(true);
        
        if ($result['http_code'] === 200) {
            $times[] = ($end - $start) * 1000; // en millisecondes
        }
        
        usleep(100000); // 100ms de pause entre les tests
    }
    
    if (empty($times)) {
        return displayResult('Performance', false, 'Aucun test réussi');
    }
    
    $avgTime = array_sum($times) / count($times);
    $minTime = min($times);
    $maxTime = max($times);
    
    $performance = "Moyenne: " . round($avgTime, 2) . "ms, Min: " . round($minTime, 2) . "ms, Max: " . round($maxTime, 2) . "ms";
    
    if ($avgTime < 500) {
        return displayResult('Performance', true, "Excellente - {$performance}");
    } elseif ($avgTime < 1000) {
        return displayResult('Performance', true, "Bonne - {$performance}");
    } elseif ($avgTime < 2000) {
        return displayResult('Performance', true, "Acceptable - {$performance}");
    } else {
        return displayResult('Performance', false, "Lente - {$performance}");
    }
}

/**
 * Test de sécurité SSL
 */
function testSSL() {
    global $baseUrl;
    
    echo "🔒 Test de sécurité SSL...\n";
    
    $parsedUrl = parse_url($baseUrl);
    $host = $parsedUrl['host'];
    $port = $parsedUrl['port'] ?? 443;
    
    $context = stream_context_create([
        'ssl' => [
            'capture_peer_cert' => true,
            'verify_peer' => false,
            'verify_peer_name' => false,
        ]
    ]);
    
    $socket = @stream_socket_client(
        "ssl://{$host}:{$port}",
        $errno,
        $errstr,
        30,
        STREAM_CLIENT_CONNECT,
        $context
    );
    
    if (!$socket) {
        return displayResult('Certificat SSL', false, 'Impossible de se connecter en SSL', "{$errstr} ({$errno})");
    }
    
    $params = stream_context_get_params($socket);
    $cert = $params['options']['ssl']['peer_certificate'] ?? null;
    
    if (!$cert) {
        fclose($socket);
        return displayResult('Certificat SSL', false, 'Aucun certificat SSL trouvé');
    }
    
    $certInfo = openssl_x509_parse($cert);
    fclose($socket);
    
    if (!$certInfo) {
        return displayResult('Certificat SSL', false, 'Impossible de parser le certificat');
    }
    
    $validFrom = $certInfo['validFrom_time_t'];
    $validTo = $certInfo['validTo_time_t'];
    $now = time();
    
    if ($now < $validFrom || $now > $validTo) {
        return displayResult('Certificat SSL', false, 'Certificat expiré ou pas encore valide');
    }
    
    $issuer = $certInfo['issuer']['CN'] ?? 'Inconnu';
    $subject = $certInfo['subject']['CN'] ?? 'Inconnu';
    
    return displayResult('Certificat SSL', true, "Valide - Émis par {$issuer} pour {$subject}");
}

/**
 * Test des en-têtes de sécurité
 */
function testSecurityHeaders() {
    global $baseUrl;
    
    echo "🛡️ Test des en-têtes de sécurité...\n";
    
    $url = $baseUrl . '/ping';
    $result = makeRequest($url);
    
    if ($result['error']) {
        return displayResult('En-têtes de sécurité', false, 'Erreur de connexion', $result['error']);
    }
    
    $headers = [];
    if (isset($result['info']['header_size'])) {
        $headerText = substr($result['response'], 0, $result['info']['header_size']);
        $headerLines = explode("\n", $headerText);
        
        foreach ($headerLines as $line) {
            if (strpos($line, ':') !== false) {
                list($key, $value) = explode(':', $line, 2);
                $headers[trim($key)] = trim($value);
            }
        }
    }
    
    $securityHeaders = [
        'X-Frame-Options' => 'Protection contre le clickjacking',
        'X-Content-Type-Options' => 'Protection MIME type sniffing',
        'X-XSS-Protection' => 'Protection XSS',
        'Strict-Transport-Security' => 'HSTS',
        'Content-Security-Policy' => 'CSP'
    ];
    
    $allPresent = true;
    
    foreach ($securityHeaders as $header => $description) {
        if (isset($headers[$header])) {
            displayResult($description, true, "Présent: {$headers[$header]}");
        } else {
            displayResult($description, false, 'Absent');
            $allPresent = false;
        }
    }
    
    return $allPresent;
}

/**
 * Test des routes d'API principales
 */
function testMainAPIRoutes() {
    global $baseUrl;
    
    echo "🔗 Test des routes d'API principales...\n";
    
    // Test des routes publiques
    $publicRoutes = [
        '/api/stores' => 'Liste des boutiques',
        '/api/products' => 'Liste des produits'
    ];
    
    $allPassed = true;
    
    foreach ($publicRoutes as $route => $description) {
        $url = $baseUrl . $route;
        $result = makeRequest($url);
        
        if ($result['error']) {
            displayResult($description, false, 'Erreur de connexion', $result['error']);
            $allPassed = false;
            continue;
        }
        
        if ($result['http_code'] === 200 || $result['http_code'] === 401) {
            // 401 est acceptable pour les routes protégées
            displayResult($description, true, "HTTP {$result['http_code']} - Route accessible");
        } else {
            displayResult($description, false, 'Route non accessible', "HTTP {$result['http_code']}");
            $allPassed = false;
        }
    }
    
    return $allPassed;
}

/**
 * Test de la gestion des erreurs
 */
function testErrorHandling() {
    global $baseUrl;
    
    echo "🚨 Test de la gestion des erreurs...\n";
    
    // Test d'une route inexistante
    $url = $baseUrl . '/api/route-inexistante';
    $result = makeRequest($url);
    
    if ($result['http_code'] === 404) {
        displayResult('Gestion 404', true, 'Erreur 404 correctement gérée');
    } else {
        displayResult('Gestion 404', false, 'Erreur 404 non gérée', "HTTP {$result['http_code']}");
    }
    
    // Test avec une méthode HTTP invalide
    $url = $baseUrl . '/ping';
    $result = makeRequest($url, 'POST');
    
    if ($result['http_code'] === 405) {
        displayResult('Gestion 405', true, 'Méthode non autorisée correctement gérée');
    } else {
        displayResult('Gestion 405', false, 'Méthode non autorisée non gérée', "HTTP {$result['http_code']}");
    }
    
    return true;
}

/**
 * Fonction principale
 */
function runAllTests() {
    $tests = [
        'testBasicConnectivity' => 'Connectivité de base',
        'testHealthEndpoints' => 'Endpoints de santé',
        'testDatabase' => 'Base de données',
        'testPerformance' => 'Performance',
        'testSSL' => 'Certificat SSL',
        'testSecurityHeaders' => 'En-têtes de sécurité',
        'testMainAPIRoutes' => 'Routes d\'API principales',
        'testErrorHandling' => 'Gestion des erreurs'
    ];
    
    $results = [];
    $totalTests = count($tests);
    $passedTests = 0;
    
    echo "🧪 Exécution de {$totalTests} tests...\n\n";
    
    foreach ($tests as $testFunction => $testName) {
        echo "📋 {$testName}\n";
        echo str_repeat('-', strlen($testName) + 4) . "\n";
        
        $result = $testFunction();
        $results[$testName] = $result;
        
        if ($result) {
            $passedTests++;
        }
        
        echo "\n";
    }
    
    // Résumé final
    echo "📊 RÉSUMÉ DES TESTS\n";
    echo "==================\n";
    echo "Tests réussis: {$colors['success']}{$passedTests}/{$totalTests}{$colors['reset']}\n";
    echo "Tests échoués: {$colors['error']}" . ($totalTests - $passedTests) . "/{$totalTests}{$colors['reset']}\n";
    
    $successRate = ($passedTests / $totalTests) * 100;
    
    if ($successRate >= 90) {
        echo "{$colors['success']}🎉 Excellent ! Votre backend fonctionne parfaitement !{$colors['reset']}\n";
    } elseif ($successRate >= 75) {
        echo "{$colors['success']}👍 Bien ! Votre backend fonctionne correctement avec quelques points à améliorer.{$colors['reset']}\n";
    } elseif ($successRate >= 50) {
        echo "{$colors['warning']}⚠️ Moyen ! Votre backend a des problèmes mais reste fonctionnel.{$colors['reset']}\n";
    } else {
        echo "{$colors['error']}❌ Critique ! Votre backend a de nombreux problèmes nécessitant une attention immédiate.{$colors['reset']}\n";
    }
    
    echo "\n";
    
    // Détails des échecs
    if ($passedTests < $totalTests) {
        echo "🔍 DÉTAILS DES ÉCHECS :\n";
        foreach ($results as $testName => $result) {
            if (!$result) {
                echo "  • {$colors['error']}{$testName}{$colors['reset']}\n";
            }
        }
    }
    
    return $passedTests === $totalTests;
}

// Exécution des tests
$startTime = microtime(true);
$allTestsPassed = runAllTests();
$endTime = microtime(true);

$executionTime = ($endTime - $startTime) * 1000;

echo "⏱️ Temps d'exécution total: " . round($executionTime, 2) . "ms\n";
echo "🏁 Test terminé à " . date('Y-m-d H:i:s') . "\n";

exit($allTestsPassed ? 0 : 1);
