<?php
/**
 * Test rapide du backend Laravel sur Forge
 * Vérifications essentielles en moins de 30 secondes
 */

$baseUrl = 'https://api.wozif.com';

echo "🚀 Test rapide du Backend Forge - {$baseUrl}\n";
echo "==========================================\n\n";

// Test de connectivité
echo "🔍 Test de connectivité... ";
$ch = curl_init($baseUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_NOBODY => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "❌ ERREUR: {$error}\n";
} elseif ($httpCode >= 200 && $httpCode < 400) {
    echo "✅ OK (HTTP {$httpCode})\n";
} else {
    echo "❌ ERREUR HTTP: {$httpCode}\n";
}

// Test des endpoints critiques
$endpoints = ['/health', '/ping', '/status'];
echo "\n🏥 Test des endpoints critiques:\n";

foreach ($endpoints as $endpoint) {
    echo "  {$endpoint}... ";
    
    $ch = curl_init($baseUrl . $endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if ($data) {
            echo "✅ OK\n";
        } else {
            echo "⚠️ Réponse non-JSON\n";
        }
    } else {
        echo "❌ HTTP {$httpCode}\n";
    }
}

// Test de performance rapide
echo "\n⚡ Test de performance rapide... ";
$start = microtime(true);

$ch = curl_init($baseUrl . '/ping');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$end = microtime(true);
$time = ($end - $start) * 1000;

if ($httpCode === 200) {
    if ($time < 500) {
        echo "✅ Excellent ({$time}ms)\n";
    } elseif ($time < 1000) {
        echo "👍 Bon ({$time}ms)\n";
    } else {
        echo "⚠️ Lent ({$time}ms)\n";
    }
} else {
    echo "❌ Échec\n";
}

echo "\n🏁 Test rapide terminé !\n";
echo "Pour un test complet, exécutez: php test-forge-backend.php\n";
