<?php
/**
 * Script de test pour diagnostiquer l'upload frontend
 * Simule exactement ce que le composant CloudflareUpload envoie
 */

echo "=== TEST UPLOAD FRONTEND SIMULATION ===\n\n";

// URL de l'API
$url = 'https://api.wozif.com/api/cloudflare/upload';

// Paramètres de test (identiques au frontend)
$storeId = '9fbbeec1-6aab-4de3-a152-9cf8ae719f62';
$type = 'document';
$directory = 'uploads';

// Créer un fichier de test
$testContent = "Test upload from frontend simulation";
file_put_contents('test-frontend.txt', $testContent);

// Préparer la requête (exactement comme le frontend)
$postData = [
    'file' => new CURLFile('test-frontend.txt', 'text/plain', 'test-frontend.txt'),
    'type' => $type,
    'directory' => $directory,
    'store_id' => $storeId
];

// Headers (exactement comme le frontend)
$headers = [
    'Accept: application/json',
    'Origin: https://app.wozif.store'
];

echo "URL: $url\n";
echo "Store ID: $storeId\n";
echo "Type: $type\n";
echo "Directory: $directory\n";
echo "Headers: " . json_encode($headers, JSON_PRETTY_PRINT) . "\n\n";

// Test 1: Sans store_id dans l'URL (comme le frontend)
echo "=== TEST 1: Sans store_id dans l'URL ===\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_VERBOSE => false,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "CURL Error: $error\n";
}
echo "Response: $response\n\n";

// Test 2: Avec store_id dans l'URL (comme nos tests curl)
echo "=== TEST 2: Avec store_id dans l'URL ===\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url . "?store_id=$storeId",
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_VERBOSE => false,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "CURL Error: $error\n";
}
echo "Response: $response\n\n";

// Test 3: Vérification des paramètres envoyés
echo "=== TEST 3: Vérification des paramètres ===\n";
echo "PostData: " . json_encode($postData, JSON_PRETTY_PRINT) . "\n";

// Nettoyer
unlink('test-frontend.txt');
echo "\n=== FIN DES TESTS ===\n";
?>
