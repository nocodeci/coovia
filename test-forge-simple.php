<?php
/**
 * Test très simple du backend Forge
 * Vérifie uniquement la connectivité et les réponses de base
 */

$baseUrl = 'https://api.wozif.com';

echo "🧪 Test simple du Backend Forge\n";
echo "===============================\n\n";

echo "URL: {$baseUrl}\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";

// Test 1: Connectivité de base
echo "1️⃣ Test de connectivité... ";
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
} else {
    echo "✅ OK (HTTP {$httpCode})\n";
}

// Test 2: Contenu de la réponse
echo "\n2️⃣ Test du contenu... ";
$ch = curl_init($baseUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    if (strpos($response, 'Server Error') !== false) {
        echo "❌ Page d'erreur serveur\n";
    } elseif (strpos($response, 'Laravel') !== false) {
        echo "✅ Page Laravel détectée\n";
    } elseif (strpos($response, '{') !== false && strpos($response, '}') !== false) {
        echo "✅ Réponse JSON détectée\n";
    } else {
        echo "⚠️ Contenu inattendu\n";
    }
} else {
    echo "❌ HTTP {$httpCode}\n";
}

// Test 3: Endpoint de test
echo "\n3️⃣ Test endpoint /test... ";
$ch = curl_init($baseUrl . '/test');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ OK\n";
} elseif ($httpCode === 404) {
    echo "❌ 404 - Route non trouvée\n";
} elseif ($httpCode === 500) {
    echo "❌ 500 - Erreur serveur\n";
} else {
    echo "⚠️ HTTP {$httpCode}\n";
}

// Résumé
echo "\n📊 RÉSUMÉ\n";
echo "==========\n";

if ($httpCode === 200 && strpos($response, 'Server Error') === false) {
    echo "🎉 Votre backend fonctionne !\n";
    echo "   Vous pouvez maintenant lancer les tests complets.\n";
} else {
    echo "❌ Votre backend a encore des problèmes.\n";
    echo "   Consultez le GUIDE_RESOLUTION_FORGE.md\n";
    echo "   Vérifiez la configuration sur Forge.\n";
}

echo "\n🏁 Test simple terminé !\n";
