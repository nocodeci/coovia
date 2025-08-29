<?php

// Test de diagnostic de l'API Cloudflare en production
echo "🔍 Diagnostic de l'API Cloudflare en Production\n";
echo "==============================================\n\n";

// Test 1: Vérification de la route
echo "📡 Test 1: Vérification de la route API...\n";
$url = "https://api.wozif.com/api/cloudflare/upload";
$response = file_get_contents($url);

if ($response === false) {
    echo "❌ Impossible d'accéder à l'API\n";
} else {
    echo "✅ API accessible\n";
}

// Test 2: Test avec méthode GET (pour voir la réponse)
echo "\n📡 Test 2: Test avec méthode GET...\n";
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json'
    ]
]);

$response = file_get_contents($url, false, $context);
echo "📋 Réponse GET: " . substr($response, 0, 200) . "...\n";

// Test 3: Test avec méthode POST sans fichier
echo "\n📡 Test 3: Test POST sans fichier...\n";
$postData = [
    'store_id' => '9fbf121f-1496-4f97-ad7f-096b3866e813',
    'type' => 'document'
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($postData)
    ]
]);

$response = file_get_contents($url, false, $context);
echo "📋 Réponse POST sans fichier: " . substr($response, 0, 200) . "...\n";

// Test 4: Vérification des headers CORS
echo "\n📡 Test 4: Vérification des headers CORS...\n";
$headers = get_headers($url, 1);
if ($headers) {
    foreach ($headers as $key => $value) {
        if (stripos($key, 'access-control') !== false || stripos($key, 'cors') !== false) {
            echo "🔒 {$key}: " . (is_array($value) ? implode(', ', $value) : $value) . "\n";
        }
    }
}

echo "\n🔍 Diagnostic terminé\n";
echo "💡 Si vous voyez toujours l'erreur 422, le serveur n'a pas été mis à jour\n";
echo "📋 Vérifiez que vous avez bien :\n";
echo "   1. Pullé le code depuis GitHub\n";
echo "   2. Mis à jour le fichier .env avec les nouvelles clés\n";
echo "   3. Redémarré le serveur PHP et Nginx\n";
