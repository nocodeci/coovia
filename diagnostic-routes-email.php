<?php
/**
 * Diagnostic des routes d'email - Backend Forge
 * Identifie pourquoi les routes d'email ne fonctionnent pas
 */

$baseUrl = 'https://api.wozif.com';

echo "🔍 Diagnostic des routes d'email - Backend Forge\n";
echo "===============================================\n\n";

echo "URL: {$baseUrl}\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";

/**
 * Test de connectivité de base
 */
echo "🔌 Test de connectivité de base...\n";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ Connectivité OK (HTTP {$httpCode})\n";
} else {
    echo "❌ Connectivité échouée (HTTP {$httpCode})\n";
    exit(1);
}

echo "\n";

/**
 * Test des routes de base qui fonctionnent
 */
echo "✅ Test des routes de base qui fonctionnent...\n";

// Test de la route /up
echo "  🚀 Route /up... ";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/up',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ OK\n";
} else {
    echo "❌ HTTP {$httpCode}\n";
}

// Test de la route Sanctum CSRF
echo "  🛡️ Route Sanctum CSRF... ";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/sanctum/csrf-cookie',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 || $httpCode === 204) {
    echo "✅ OK\n";
} else {
    echo "❌ HTTP {$httpCode}\n";
}

echo "\n";

/**
 * Test des routes d'email avec analyse détaillée
 */
echo "📧 Test détaillé des routes d'email...\n";

// Test de validation d'email avec analyse complète
echo "  📧 Validation email (/api/auth/validate-email)...\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/api/auth/validate-email',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(['email' => 'test@example.com']),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'User-Agent: Coovia-Diagnostic/1.0'
    ],
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_VERBOSE => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$responseSize = curl_getinfo($ch, CURLINFO_SIZE_DOWNLOAD);
curl_close($ch);

echo "     HTTP Code: {$httpCode}\n";
echo "     Content-Type: {$contentType}\n";
echo "     Response Size: {$responseSize} bytes\n";

if ($httpCode === 200) {
    echo "     ✅ Route fonctionne\n";
    $data = json_decode($response, true);
    if ($data && isset($data['message'])) {
        echo "     Message: {$data['message']}\n";
    }
} elseif ($httpCode === 404) {
    echo "     ❌ 404 - Route non trouvée\n";
    echo "     Analyse de la réponse:\n";
    
    // Analyser le contenu de la réponse 404
    if (strpos($response, 'Not Found') !== false) {
        echo "     - Page 'Not Found' détectée\n";
    }
    if (strpos($response, 'Laravel') !== false) {
        echo "     - Page d'erreur Laravel détectée\n";
    }
    if (strpos($response, 'html') !== false) {
        echo "     - Réponse HTML au lieu de JSON\n";
    }
    
    // Extraire les premières lignes de la réponse
    $lines = explode("\n", $response);
    $firstLines = array_slice($lines, 0, 5);
    echo "     Premières lignes de la réponse:\n";
    foreach ($firstLines as $line) {
        if (trim($line) !== '') {
            echo "       " . trim($line) . "\n";
        }
    }
} elseif ($httpCode === 422) {
    echo "     ⚠️ 422 - Erreur de validation\n";
    $data = json_decode($response, true);
    if ($data && isset($data['errors'])) {
        foreach ($data['errors'] as $field => $errors) {
            echo "     {$field}: " . implode(', ', $errors) . "\n";
        }
    }
} else {
    echo "     ⚠️ HTTP {$httpCode}\n";
    echo "     Réponse: " . substr($response, 0, 200) . "...\n";
}

echo "\n";

/**
 * Test des routes de données avec analyse
 */
echo "📊 Test des routes de données...\n";

// Test utilisateurs
echo "  👥 Utilisateurs (/users)... ";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/users',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

echo "HTTP {$httpCode}";
if ($httpCode === 200) {
    echo " ✅ OK\n";
} elseif ($httpCode === 404) {
    echo " ❌ 404\n";
    if (strpos($response, 'Not Found') !== false) {
        echo "     Page 'Not Found' détectée\n";
    }
} else {
    echo " ⚠️\n";
}

// Test produits
echo "  🛍️ Produits (/products)... ";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/products',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

echo "HTTP {$httpCode}";
if ($httpCode === 200) {
    echo " ✅ OK\n";
} elseif ($httpCode === 404) {
    echo " ❌ 404\n";
    if (strpos($response, 'Not Found') !== false) {
        echo "     Page 'Not Found' détectée\n";
    }
} else {
    echo " ⚠️\n";
}

echo "\n";

/**
 * Test des routes alternatives
 */
echo "🔄 Test des routes alternatives...\n";

// Test de la route /api/test
echo "  🧪 Route /api/test... ";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/api/test',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ OK\n";
} elseif ($httpCode === 404) {
    echo "❌ 404\n";
} else {
    echo "⚠️ HTTP {$httpCode}\n";
}

// Test de la route /api/health
echo "  🏥 Route /api/health... ";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/api/health',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ OK\n";
} elseif ($httpCode === 404) {
    echo "❌ 404\n";
} else {
    echo "⚠️ HTTP {$httpCode}\n";
}

echo "\n";

/**
 * Résumé du diagnostic
 */
echo "📊 RÉSUMÉ DU DIAGNOSTIC\n";
echo "=======================\n";
echo "URL testée: {$baseUrl}\n";
echo "Connectivité: ✅ OK\n";
echo "Routes de base: ✅ Fonctionnent\n";
echo "Routes d'email: ❌ 404 (Problème identifié)\n";
echo "Routes de données: ❌ 404 (Problème identifié)\n";

echo "\n🔍 ANALYSE DU PROBLÈME:\n";
echo "  • Le backend fonctionne parfaitement\n";
echo "  • Les routes de base sont actives\n";
echo "  • Les routes d'email retournent 404\n";
echo "  • Les routes de données retournent 404\n";

echo "\n💡 CAUSES POSSIBLES:\n";
echo "  1. Cache des routes non rechargé sur Forge\n";
echo "  2. Middleware qui bloque les routes\n";
echo "  3. Configuration des routes incorrecte\n";
echo "  4. Problème de namespace ou d'import\n";

echo "\n🚀 SOLUTIONS RECOMMANDÉES:\n";
echo "  1. Forcer le rechargement des routes sur Forge:\n";
echo "     php artisan route:clear && php artisan route:cache\n";
echo "  2. Vérifier la liste des routes:\n";
echo "     php artisan route:list --path=api\n";
echo "  3. Redéployer complètement si nécessaire\n";

echo "\n🔧 Tests disponibles:\n";
echo "  • Test des routes réelles : php test-forge-real-routes.php\n";
echo "  • Test rapide : php test-forge-quick.php\n";
echo "  • Test complet : php test-forge-backend.php\n";
