<?php

/**
 * Script de test pour vérifier que la route /user/stores fonctionne
 * après les corrections du middleware
 */

echo "🔧 Test de la route /user/stores après corrections\n";
echo "================================================\n\n";

// Test 1: Route sans authentification (doit retourner 401)
echo "1️⃣ Test sans authentification (attendu: 401):\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.wozif.com/api/user/stores");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: " . substr($response, 0, 200) . "...\n\n";

// Test 2: Route avec authentification invalide (doit retourner 401)
echo "2️⃣ Test avec token invalide (attendu: 401):\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.wozif.com/api/user/stores");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json',
    'Authorization: Bearer invalid_token_123'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: " . substr($response, 0, 200) . "...\n\n";

// Test 3: Route publique /stores (doit fonctionner)
echo "3️⃣ Test route publique /stores (attendu: 200):\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.wozif.com/api/stores");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: " . substr($response, 0, 200) . "...\n\n";

echo "✅ Tests terminés !\n";
echo "📝 Si vous obtenez 401 au lieu de 500, c'est que le problème est résolu !\n";
echo "🔑 Pour tester avec un vrai token, connectez-vous via le frontend.\n";
