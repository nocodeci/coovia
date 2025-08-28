<?php

/**
 * Script de test pour vérifier l'authentification avec un token valide
 * et tester la route /api/user/stores
 */

echo "🔍 Test d'authentification avec token valide\n";
echo "==========================================\n\n";

// Configuration
$baseUrl = "https://api.wozif.com/api";
$token = null;

// Demander le token à l'utilisateur
echo "🔑 Entrez votre token d'authentification (ou appuyez sur Entrée pour utiliser le dernier token connu): ";
$handle = fopen("php://stdin", "r");
$input = trim(fgets($handle));
fclose($handle);

if (!empty($input)) {
    $token = $input;
} else {
    // Essayer de récupérer le dernier token connu
    $token = "VOTRE_TOKEN_ICI"; // Remplacez par un vrai token
    echo "⚠️  Utilisation du token par défaut. Assurez-vous qu'il est valide.\n\n";
}

if (empty($token)) {
    echo "❌ Aucun token fourni. Arrêt du test.\n";
    exit(1);
}

echo "🔑 Token utilisé: " . substr($token, 0, 20) . "...\n\n";

// Test 1: Vérifier l'authentification
echo "1️⃣ Test de vérification d'authentification (/auth/me):\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$baseUrl/auth/me");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: " . substr($response, 0, 300) . "...\n\n";

// Test 2: Tester la route /api/user/stores
echo "2️⃣ Test de la route /api/user/stores:\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$baseUrl/user/stores");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: " . substr($response, 0, 300) . "...\n\n";

// Test 3: Vérifier l'état de la base de données
echo "3️⃣ Vérification de la base de données:\n";
echo "   Exécutez sur le serveur Forge:\n";
echo "   php artisan tinker\n";
echo "   >>> App\\Models\\User::count();\n";
echo "   >>> App\\Models\\Store::count();\n";
echo "   >>> App\\Models\\Store::where('owner_id', '!=', null)->count();\n\n";

echo "✅ Tests terminés !\n";
echo "📝 Si vous obtenez 401, le token est invalide ou expiré.\n";
echo "📝 Si vous obtenez 200, le backend fonctionne correctement.\n";
echo "🔍 Vérifiez les logs Laravel pour plus de détails.\n";
