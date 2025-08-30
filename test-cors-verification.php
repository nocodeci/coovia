<?php
/**
 * Script de test pour vérifier la configuration CORS et l'API
 * Usage: php test-cors-verification.php
 */

echo "🔍 Test de vérification CORS et API\n";
echo "==================================\n\n";

// Configuration
$apiBaseUrl = 'https://api.wozif.com';
$testEndpoints = [
    '/api/health',
    '/api/test',
    '/api/auth/check'
];

echo "🌐 Test des endpoints API sur: {$apiBaseUrl}\n";
echo "============================================\n\n";

foreach ($testEndpoints as $endpoint) {
    echo "Testing: {$endpoint}\n";
    echo str_repeat('-', strlen($endpoint) + 8) . "\n";
    
    // Test 1: Requête simple
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiBaseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "❌ Erreur cURL: {$error}\n";
    } else {
        echo "✅ HTTP Code: {$httpCode}\n";
        
        // Extraire les en-têtes de la réponse
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        // Vérifier les en-têtes CORS
        $corsHeaders = [
            'Access-Control-Allow-Origin' => false,
            'Access-Control-Allow-Methods' => false,
            'Access-Control-Allow-Headers' => false,
            'Access-Control-Allow-Credentials' => false
        ];
        
        foreach ($corsHeaders as $header => $found) {
            if (preg_match("/^{$header}:\s*(.+)$/mi", $headers, $matches)) {
                $corsHeaders[$header] = $matches[1];
            }
        }
        
        echo "🔒 En-têtes CORS:\n";
        foreach ($corsHeaders as $header => $value) {
            if ($value !== false) {
                echo "   ✅ {$header}: {$value}\n";
            } else {
                echo "   ❌ {$header}: Manquant\n";
            }
        }
        
        // Afficher le corps de la réponse (truncated)
        if ($body) {
            $bodyPreview = substr($body, 0, 200);
            if (strlen($body) > 200) {
                $bodyPreview .= "...";
            }
            echo "📄 Réponse: {$bodyPreview}\n";
        }
    }
    
    echo "\n";
}

// Test 2: Test CORS preflight (OPTIONS)
echo "🔄 Test CORS Preflight (OPTIONS)\n";
echo "================================\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiBaseUrl . '/api/auth/check');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'OPTIONS');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Origin: https://app.wozif.store',
    'Access-Control-Request-Method: GET',
    'Access-Control-Request-Headers: Content-Type, Authorization'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "❌ Erreur cURL preflight: {$error}\n";
} else {
    echo "✅ HTTP Code preflight: {$httpCode}\n";
    
    // Extraire les en-têtes de la réponse preflight
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    
    // Vérifier les en-têtes CORS preflight
    $preflightHeaders = [
        'Access-Control-Allow-Origin' => false,
        'Access-Control-Allow-Methods' => false,
        'Access-Control-Allow-Headers' => false,
        'Access-Control-Max-Age' => false
    ];
    
    foreach ($preflightHeaders as $header => $found) {
        if (preg_match("/^{$header}:\s*(.+)$/mi", $headers, $matches)) {
            $preflightHeaders[$header] = $matches[1];
        }
    }
    
    echo "🔒 En-têtes CORS Preflight:\n";
    foreach ($preflightHeaders as $header => $value) {
        if ($value !== false) {
            echo "   ✅ {$header}: {$value}\n";
        } else {
            echo "   ❌ {$header}: Manquant\n";
        }
    }
}

echo "\n📋 Résumé des tests:\n";
echo "====================\n";
echo "Si tous les en-têtes CORS sont présents, votre configuration est correcte.\n";
echo "Si des en-têtes manquent, vérifiez:\n";
echo "1. Que le middleware CORS est bien enregistré\n";
echo "2. Que le serveur Forge a été redémarré\n";
echo "3. Que les modifications ont été déployées\n\n";

echo "🚀 Pour tester depuis le frontend:\n";
echo "Ouvrez la console de votre navigateur sur https://app.wozif.store\n";
echo "Et exécutez:\n";
echo "fetch('https://api.wozif.com/api/health')\n";
echo "  .then(r => r.json())\n";
echo "  .then(console.log)\n";
echo "  .catch(console.error);\n";
