<?php

/**
 * Script de test corrigé pour éviter les erreurs Forge
 * Utilise des commandes artisan directes au lieu de Tinker
 */

echo "🔍 Test d'authentification corrigé (sans Tinker)\n";
echo "==============================================\n\n";

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
        
        // Créer un fichier temporaire pour Tinker
        $tinkerScript = '<?php
require_once "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

$user = App\Models\User::first();
if ($user) {
    $token = $user->createToken("test-token")->plainTextToken;
    echo $token;
} else {
    echo "AUCUN_UTILISATEUR";
}
';
        
        file_put_contents('/tmp/tinker_test.php', $tinkerScript);
        
        // Exécuter le script PHP directement
        $output = shell_exec('php /tmp/tinker_test.php 2>&1');
        
        // Nettoyer le fichier temporaire
        unlink('/tmp/tinker_test.php');
        
        if ($output && $output !== 'AUCUN_UTILISATEUR' && !str_contains($output, 'error')) {
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

// Test 3: Vérifier l'état de la base de données (sans Tinker)
echo "3️⃣ Vérification de la base de données (méthode alternative):\n";
if (file_exists('/home/forge/api.wozif.com/artisan')) {
    echo "   Serveur Forge détecté, exécution des commandes...\n";
    
    chdir('/home/forge/api.wozif.com');
    
    // Créer des scripts PHP temporaires pour éviter Tinker
    $userCountScript = '<?php
require_once "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();
echo App\Models\User::count();
';
    
    $storeCountScript = '<?php
require_once "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();
echo App\Models\Store::count();
';
    
    $ownedStoreCountScript = '<?php
require_once "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();
echo App\Models\Store::where("owner_id", "!=", null)->count();
';
    
    file_put_contents('/tmp/user_count.php', $userCountScript);
    file_put_contents('/tmp/store_count.php', $storeCountScript);
    file_put_contents('/tmp/owned_store_count.php', $ownedStoreCountScript);
    
    echo "   📊 Nombre d'utilisateurs:\n";
    $userCount = shell_exec('php /tmp/user_count.php 2>&1');
    echo "      $userCount";
    
    echo "   📊 Nombre de boutiques:\n";
    $storeCount = shell_exec('php /tmp/store_count.php 2>&1');
    echo "      $storeCount";
    
    echo "   📊 Nombre de boutiques avec propriétaire:\n";
    $ownedStoreCount = shell_exec('php /tmp/owned_store_count.php 2>&1');
    echo "      $ownedStoreCount";
    
    // Nettoyer les fichiers temporaires
    unlink('/tmp/user_count.php');
    unlink('/tmp/store_count.php');
    unlink('/tmp/owned_store_count.php');
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
echo "\n💡 Conseil: Utilisez ce script corrigé au lieu de l'ancien !\n";
