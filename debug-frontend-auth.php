<?php

echo "🔍 Débogage de l'authentification frontend\n";
echo "==========================================\n\n";

// Test de l'endpoint de vérification d'authentification
echo "1. Test de l'endpoint /api/auth/check...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/auth/check');
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: $response\n\n";

// Test de l'endpoint de création de boutique sans authentification
echo "2. Test de l'endpoint /api/stores/create sans authentification...\n";

$formData = [
    'name' => 'Test Debug',
    'slug' => 'test-debug',
    'description' => 'Test de débogage'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/stores/create');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";
echo "   Réponse: $response\n\n";

// Vérifier les routes API
echo "3. Vérification des routes API...\n";

$routes = [
    'GET /api/auth/check' => 'http://localhost:8000/api/auth/check',
    'POST /api/stores/create' => 'http://localhost:8000/api/stores/create',
    'GET /api/stores' => 'http://localhost:8000/api/stores'
];

foreach ($routes as $route => $url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   $route: HTTP $httpCode\n";
}

echo "\n📚 Analyse:\n";
echo "   - Si /api/auth/check retourne 401: L'utilisateur n'est pas authentifié\n";
echo "   - Si /api/stores/create retourne 401: Authentification requise\n";
echo "   - Si /api/stores/create retourne 422: Problème de validation des données\n";
echo "   - Si /api/stores/create retourne 500: Erreur serveur\n\n";

echo "🔧 Solutions possibles:\n";
echo "   1. Vérifier que l'utilisateur est connecté dans le frontend\n";
echo "   2. Vérifier que le token d'authentification est envoyé\n";
echo "   3. Vérifier le format des données envoyées\n";
echo "   4. Vérifier les logs du backend pour plus de détails\n\n";
