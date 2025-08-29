<?php

/**
 * Script de test amélioré pour vérifier l'authentification
 * Peut récupérer automatiquement un token ou utiliser un token fourni
 */

echo "🔍 Test d'authentification amélioré\n";
echo "==================================\n\n";

// Configuration
$baseUrl = "https://api.wozif.com/api";
$token = null;

// Option 1: Récupérer automatiquement un token
echo "🔑 Options de récupération du token:\n";
echo "1. Récupération automatique depuis la base de données\n";
echo "2. Entrée manuelle du token\n";
echo "3. Utiliser un token de test prédéfini\n\n";

echo "Choisissez une option (1, 2, ou 3): ";
$handle = fopen("php://stdin", "r");
$option = trim(fgets($handle));

if ($option === "1") {
    echo "🔄 Tentative de récupération automatique du token...\n";
    
    // Vérifier si nous sommes sur le serveur Forge
    if (file_exists('/home/forge/api.wozif.com/artisan')) {
        echo "✅ Serveur Forge détecté, récupération du token...\n";
        
        // Changer vers le répertoire Laravel
        chdir('/home/forge/api.wozif.com');
        
        // Exécuter la commande artisan pour créer un token
        $output = shell_exec('php artisan tinker --execute="echo App\Models\User::first()->createToken(\'test-token\')->plainTextToken;" 2>&1');
        
        if ($output && !str_contains($output, 'error')) {
            $token = trim($output);
            echo "✅ Token récupéré automatiquement: " . substr($token, 0, 20) . "...\n\n";
        } else {
            echo "❌ Échec de la récupération automatique: $output\n";
            echo "⚠️  Passage à l'entrée manuelle...\n\n";
            goto manual_input;
        }
    } else {
        echo "❌ Serveur Forge non détecté, passage à l'entrée manuelle...\n\n";
        goto manual_input;
    }
} elseif ($option === "3") {
    echo "🧪 Utilisation du token de test prédéfini...\n";
    // Token de test (à remplacer par un vrai token)
    $token = "1|test_token_1234567890abcdef";
    echo "⚠️  Token de test utilisé (peut ne pas fonctionner)\n\n";
} else {
    manual_input:
    echo "🔑 Entrez votre token d'authentification: ";
    $handle = fopen("php://stdin", "r");
    $input = trim(fgets($handle));
    fclose($handle);
    
    if (!empty($input)) {
        $token = $input;
    }
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
if (file_exists('/home/forge/api.wozif.com/artisan')) {
    echo "   Serveur Forge détecté, exécution des commandes...\n";
    
    chdir('/home/forge/api.wozif.com');
    
    echo "   📊 Nombre d'utilisateurs:\n";
    $userCount = shell_exec('php artisan tinker --execute="echo App\Models\User::count();" 2>&1');
    echo "      $userCount";
    
    echo "   📊 Nombre de boutiques:\n";
    $storeCount = shell_exec('php artisan tinker --execute="echo App\Models\Store::count();" 2>&1');
    echo "      $storeCount";
    
    echo "   📊 Nombre de boutiques avec propriétaire:\n";
    $ownedStoreCount = shell_exec('php artisan tinker --execute="echo App\Models\Store::where(\'owner_id\', \'!=\', null)->count();" 2>&1');
    echo "      $ownedStoreCount";
} else {
    echo "   Exécutez sur le serveur Forge:\n";
    echo "   php artisan tinker\n";
    echo "   >>> App\\Models\\User::count();\n";
    echo "   >>> App\\Models\\Store::count();\n";
    echo "   >>> App\\Models\\Store::where('owner_id', '!=', null)->count();\n";
}

echo "\n✅ Tests terminés !\n";

if ($httpCode === 200) {
    echo "🎉 SUCCÈS ! L'authentification fonctionne correctement !\n";
    echo "📝 Le backend répond correctement avec le token fourni.\n";
} elseif ($httpCode === 401) {
    echo "❌ ÉCHEC ! Le token est invalide ou expiré.\n";
    echo "🔍 Vérifiez que le token est correct et non expiré.\n";
    echo "🔄 Générez un nouveau token et réessayez.\n";
} else {
    echo "⚠️  CODE HTTP INATTENDU: $httpCode\n";
    echo "🔍 Vérifiez les logs Laravel pour plus de détails.\n";
}

echo "\n🔍 Pour plus de détails, vérifiez les logs Laravel:\n";
echo "   tail -f storage/logs/laravel.log\n";
