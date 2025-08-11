<?php

require_once 'vendor/autoload.php';

use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;

// Charger les variables d'environnement
$envFile = '.env';
if (file_exists($envFile)) {
    $envContent = file_get_contents($envFile);
    $envLines = explode("\n", $envContent);
    $envVars = [];
    
    foreach ($envLines as $line) {
        if (strpos($line, '=') !== false && !str_starts_with(trim($line), '#')) {
            list($key, $value) = explode('=', $line, 2);
            $envVars[trim($key)] = trim($value);
        }
    }
    
    // Configuration Auth0 depuis le fichier .env
    $config = [
        'domain' => $envVars['AUTH0_DOMAIN'] ?? 'your-domain.auth0.com',
        'clientId' => $envVars['AUTH0_CLIENT_ID'] ?? 'your-client-id',
        'clientSecret' => $envVars['AUTH0_CLIENT_SECRET'] ?? 'your-client-secret',
        'audience' => $envVars['AUTH0_AUDIENCE'] ?? 'https://api.coovia.com',
    ];
} else {
    // Configuration Auth0 par défaut
    $config = [
        'domain' => 'your-domain.auth0.com',
        'clientId' => 'your-client-id',
        'clientSecret' => 'your-client-secret',
        'audience' => 'https://api.coovia.com',
    ];
}

echo "🔐 Test de Connexion Auth0\n";
echo "========================\n\n";

// Test 1: Vérifier la configuration
echo "1. Vérification de la configuration...\n";
if (empty($config['domain']) || $config['domain'] === 'your-domain.auth0.com') {
    echo "❌ Configuration Auth0 manquante dans le fichier .env\n";
    echo "   Veuillez configurer vos vraies valeurs Auth0\n\n";
    exit(1);
}
echo "✅ Configuration détectée\n\n";

// Test 2: Tester la connexion à l'API Auth0
echo "2. Test de connexion à l'API Auth0...\n";
$wellKnownUrl = "https://{$config['domain']}/.well-known/openid_configuration";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $wellKnownUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ Connexion à Auth0 réussie (HTTP $httpCode)\n";
    $configData = json_decode($response, true);
    if ($configData) {
        echo "   - Issuer: {$configData['issuer']}\n";
        echo "   - Authorization Endpoint: {$configData['authorization_endpoint']}\n";
        echo "   - Token Endpoint: {$configData['token_endpoint']}\n";
    }
} else {
    echo "❌ Échec de connexion à Auth0 (HTTP $httpCode)\n";
    echo "   Vérifiez votre domaine Auth0\n";
}
echo "\n";

// Test 3: Tester la validation JWT (si un token est fourni)
if (isset($argv[1]) && $argv[1] === '--token') {
    echo "3. Test de validation JWT...\n";
    if (isset($argv[2])) {
        $token = $argv[2];
        echo "   Token fourni: " . substr($token, 0, 50) . "...\n";
        
        try {
            $sdkConfig = new SdkConfiguration($config);
            $auth0 = new Auth0($sdkConfig);
            
            // Ici vous pouvez ajouter la logique de validation du token
            echo "   ✅ Token reçu (validation à implémenter)\n";
        } catch (Exception $e) {
            echo "   ❌ Erreur lors de la validation: " . $e->getMessage() . "\n";
        }
    } else {
        echo "   ⚠️  Aucun token fourni. Utilisez: php test-auth0.php --token <votre_token>\n";
    }
    echo "\n";
}

// Test 4: Informations sur l'environnement
echo "4. Informations sur l'environnement...\n";
echo "   - PHP Version: " . PHP_VERSION . "\n";
echo "   - Auth0 PHP SDK: " . (class_exists('Auth0\SDK\Auth0') ? '✅ Installé' : '❌ Non installé') . "\n";
echo "   - cURL: " . (function_exists('curl_init') ? '✅ Disponible' : '❌ Non disponible') . "\n";
echo "   - JSON: " . (function_exists('json_decode') ? '✅ Disponible' : '❌ Non disponible') . "\n";

echo "\n🎯 Prochaines étapes:\n";
echo "1. Configurez vos vraies valeurs Auth0 dans le fichier .env\n";
echo "2. Testez la connexion: php test-auth0.php\n";
echo "3. Testez avec un token: php test-auth0.php --token <votre_token>\n";
echo "4. Lancez votre application: php artisan serve --port=8001\n";

echo "\n📚 Documentation:\n";
echo "- Auth0 Dashboard: https://manage.auth0.com\n";
echo "- Auth0 PHP SDK: https://github.com/auth0/auth0-PHP\n";
echo "- OpenID Connect: https://openid.net/connect/\n";
