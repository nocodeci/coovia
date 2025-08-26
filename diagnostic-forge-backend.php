<?php
/**
 * Diagnostic du backend Laravel sur Forge
 * Identifie les problèmes de configuration et de déploiement
 */

$baseUrl = 'https://api.wozif.com';

echo "🔍 DIAGNOSTIC DU BACKEND FORGE - COOVIA\n";
echo "========================================\n\n";

echo "URL testée: {$baseUrl}\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";

/**
 * Fonction pour effectuer une requête HTTP
 */
function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    $defaultHeaders = [
        'Content-Type: application/json',
        'Accept: application/json',
        'User-Agent: Coovia-Diagnostic/1.0'
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
        CURLOPT_VERBOSE => false,
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
 * Test de connectivité de base
 */
echo "🔍 1. TEST DE CONNECTIVITÉ DE BASE\n";
echo "==================================\n";

$result = makeRequest($baseUrl);
echo "URL: {$baseUrl}\n";

if ($result['error']) {
    echo "❌ Erreur cURL: {$result['error']}\n";
} else {
    echo "✅ Connexion établie\n";
    echo "   HTTP Code: {$result['http_code']}\n";
    echo "   Taille réponse: " . strlen($result['response']) . " bytes\n";
    echo "   Temps de réponse: " . round($result['info']['total_time'] * 1000, 2) . "ms\n";
}

echo "\n";

/**
 * Analyse de la réponse
 */
echo "📄 2. ANALYSE DE LA RÉPONSE\n";
echo "===========================\n";

if (isset($result['response']) && $result['response']) {
    $response = $result['response'];
    
    // Vérifier le type de contenu
    if (strpos($response, '<!DOCTYPE html>') !== false) {
        echo "📝 Type: Page HTML (probablement une page d'erreur Laravel)\n";
        
        // Chercher des indices d'erreur
        if (strpos($response, 'Server Error') !== false) {
            echo "❌ Erreur: Page d'erreur serveur Laravel\n";
        } elseif (strpos($response, 'Not Found') !== false) {
            echo "❌ Erreur: Page 404 Laravel\n";
        } elseif (strpos($response, 'Whoops') !== false) {
            echo "❌ Erreur: Page d'erreur Whoops (développement)\n";
        }
        
        // Extraire des informations utiles
        if (preg_match('/<title>(.*?)<\/title>/', $response, $matches)) {
            echo "   Titre: {$matches[1]}\n";
        }
        
        // Chercher des messages d'erreur
        if (preg_match('/<div[^>]*class="[^"]*error[^"]*"[^>]*>(.*?)<\/div>/s', $response, $matches)) {
            echo "   Message d'erreur: " . trim(strip_tags($matches[1])) . "\n";
        }
        
    } elseif (strpos($response, '{') !== false && strpos($response, '}') !== false) {
        echo "📝 Type: Réponse JSON\n";
        $jsonData = json_decode($response, true);
        if ($jsonData) {
            echo "✅ JSON valide\n";
            if (isset($jsonData['message'])) {
                echo "   Message: {$jsonData['message']}\n";
            }
            if (isset($jsonData['error'])) {
                echo "   Erreur: {$jsonData['error']}\n";
            }
        } else {
            echo "❌ JSON invalide\n";
        }
    } else {
        echo "📝 Type: Réponse texte brut\n";
        echo "   Contenu: " . substr($response, 0, 200) . "...\n";
    }
} else {
    echo "❌ Aucune réponse reçue\n";
}

echo "\n";

/**
 * Test des endpoints spécifiques
 */
echo "🎯 3. TEST DES ENDPOINTS SPÉCIFIQUES\n";
echo "===================================\n";

$endpoints = [
    '/' => 'Racine',
    '/test' => 'Test public',
    '/health' => 'Health check',
    '/ping' => 'Ping',
    '/status' => 'Statut',
    '/api/test' => 'API Test',
    '/api/health' => 'API Health',
    '/api/ping' => 'API Ping'
];

foreach ($endpoints as $endpoint => $description) {
    echo "  {$description} ({$endpoint})... ";
    
    $url = $baseUrl . $endpoint;
    $result = makeRequest($url);
    
    if ($result['error']) {
        echo "❌ Erreur: {$result['error']}\n";
    } else {
        echo "HTTP {$result['http_code']}";
        
        if ($result['http_code'] === 200) {
            echo " ✅";
        } elseif ($result['http_code'] === 404) {
            echo " ❌ 404";
        } elseif ($result['http_code'] === 500) {
            echo " ❌ 500";
        } else {
            echo " ⚠️ {$result['http_code']}";
        }
        
        echo "\n";
    }
}

echo "\n";

/**
 * Test des en-têtes de réponse
 */
echo "📋 4. ANALYSE DES EN-TÊTES\n";
echo "==========================\n";

$result = makeRequest($baseUrl);
if (!$result['error']) {
    $headers = [];
    
    // Extraire les en-têtes de la réponse
    if (isset($result['info']['header_size']) && $result['info']['header_size'] > 0) {
        $headerText = substr($result['response'], 0, $result['info']['header_size']);
        $headerLines = explode("\n", $headerText);
        
        foreach ($headerLines as $line) {
            if (strpos($line, ':') !== false) {
                list($key, $value) = explode(':', $line, 2);
                $headers[trim($key)] = trim($value);
            }
        }
    }
    
    if (empty($headers)) {
        echo "⚠️ Aucun en-tête extrait\n";
    } else {
        echo "En-têtes détectés:\n";
        foreach ($headers as $key => $value) {
            echo "  {$key}: {$value}\n";
        }
    }
} else {
    echo "❌ Impossible d'analyser les en-têtes\n";
}

echo "\n";

/**
 * Test de configuration Nginx
 */
echo "🌐 5. TEST DE CONFIGURATION NGINX\n";
echo "=================================\n";

// Test avec différents User-Agent
$userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' => 'Navigateur standard',
    'curl/7.68.0' => 'cURL',
    'PostmanRuntime/7.29.0' => 'Postman',
    'Coovia-Test/1.0' => 'Script de test'
];

foreach ($userAgents as $userAgent => $description) {
    echo "  {$description}... ";
    
    $headers = ['User-Agent: ' . $userAgent];
    $result = makeRequest($baseUrl, 'GET', null, $headers);
    
    if ($result['error']) {
        echo "❌ Erreur\n";
    } else {
        echo "HTTP {$result['http_code']}\n";
    }
}

echo "\n";

/**
 * Test des méthodes HTTP
 */
echo "🔧 6. TEST DES MÉTHODES HTTP\n";
echo "============================\n";

$methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
foreach ($methods as $method) {
    echo "  {$method}... ";
    
    $result = makeRequest($baseUrl, $method);
    
    if ($result['error']) {
        echo "❌ Erreur: {$result['error']}\n";
    } else {
        echo "HTTP {$result['http_code']}\n";
    }
}

echo "\n";

/**
 * Test de performance
 */
echo "⚡ 7. TEST DE PERFORMANCE\n";
echo "========================\n";

$times = [];
for ($i = 0; $i < 3; $i++) {
    $start = microtime(true);
    $result = makeRequest($baseUrl);
    $end = microtime(true);
    
    if (!$result['error']) {
        $times[] = ($end - $start) * 1000;
    }
    
    usleep(500000); // 500ms de pause
}

if (!empty($times)) {
    $avgTime = array_sum($times) / count($times);
    $minTime = min($times);
    $maxTime = max($times);
    
    echo "Temps de réponse:\n";
    echo "  Moyenne: " . round($avgTime, 2) . "ms\n";
    echo "  Min: " . round($minTime, 2) . "ms\n";
    echo "  Max: " . round($maxTime, 2) . "ms\n";
    
    if ($avgTime < 500) {
        echo "  Performance: ✅ Excellente\n";
    } elseif ($avgTime < 1000) {
        echo "  Performance: 👍 Bonne\n";
    } elseif ($avgTime < 2000) {
        echo "  Performance: ⚠️ Acceptable\n";
    } else {
        echo "  Performance: ❌ Lente\n";
    }
} else {
    echo "❌ Impossible de mesurer les performances\n";
}

echo "\n";

/**
 * Diagnostic des problèmes
 */
echo "🔍 8. DIAGNOSTIC DES PROBLÈMES\n";
echo "==============================\n";

$problems = [];

// Vérifier les erreurs HTTP
if (isset($result['http_code'])) {
    if ($result['http_code'] === 500) {
        $problems[] = "Erreur 500 - Problème serveur interne";
    } elseif ($result['http_code'] === 404) {
        $problems[] = "Erreur 404 - Route non trouvée";
    } elseif ($result['http_code'] >= 500) {
        $problems[] = "Erreur {$result['http_code']} - Problème serveur";
    }
}

// Vérifier la connectivité
if (isset($result['error']) && $result['error']) {
    $problems[] = "Problème de connectivité: {$result['error']}";
}

// Vérifier le contenu de la réponse
if (isset($result['response']) && strpos($result['response'], 'Server Error') !== false) {
    $problems[] = "Page d'erreur serveur Laravel affichée";
}

if (empty($problems)) {
    echo "✅ Aucun problème majeur détecté\n";
} else {
    echo "❌ Problèmes identifiés:\n";
    foreach ($problems as $problem) {
        echo "  • {$problem}\n";
    }
}

echo "\n";

/**
 * Recommandations
 */
echo "💡 9. RECOMMANDATIONS\n";
echo "=====================\n";

if (!empty($problems)) {
    echo "Actions recommandées:\n\n";
    
    if (in_array("Erreur 500 - Problème serveur interne", $problems)) {
        echo "🔧 Pour l'erreur 500:\n";
        echo "  1. Vérifiez les logs Laravel sur Forge\n";
        echo "  2. Vérifiez la configuration de la base de données\n";
        echo "  3. Vérifiez les permissions des fichiers\n";
        echo "  4. Vérifiez la configuration .env\n\n";
    }
    
    if (in_array("Page d'erreur serveur Laravel affichée", $problems)) {
        echo "🐛 Pour la page d'erreur Laravel:\n";
        echo "  1. Activez le mode debug temporairement\n";
        echo "  2. Vérifiez les logs dans storage/logs\n";
        echo "  3. Vérifiez la configuration de l'application\n\n";
    }
    
    echo "📋 Vérifications générales:\n";
    echo "  1. Vérifiez que Laravel est bien déployé sur Forge\n";
    echo "  2. Vérifiez la configuration Nginx\n";
    echo "  3. Vérifiez les variables d'environnement\n";
    echo "  4. Vérifiez la connectivité à la base de données\n";
    echo "  5. Vérifiez les permissions des dossiers storage et bootstrap/cache\n";
} else {
    echo "✅ Votre backend semble fonctionner correctement\n";
    echo "   Vous pouvez maintenant lancer les tests complets\n";
}

echo "\n";

/**
 * Résumé
 */
echo "📊 RÉSUMÉ DU DIAGNOSTIC\n";
echo "=======================\n";
echo "URL testée: {$baseUrl}\n";
echo "Statut: " . (empty($problems) ? "✅ Fonctionnel" : "❌ Problèmes détectés") . "\n";
echo "Problèmes identifiés: " . count($problems) . "\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n";

echo "\n🏁 Diagnostic terminé !\n";
echo "Utilisez ces informations pour résoudre les problèmes identifiés.\n";
