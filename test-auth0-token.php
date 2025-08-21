<?php

require_once 'vendor/autoload.php';

use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Token\Verifier;

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
    
    $config = [
        'domain' => $envVars['AUTH0_DOMAIN'] ?? 'your-domain.auth0.com',
        'clientId' => $envVars['AUTH0_CLIENT_ID'] ?? 'your-client-id',
        'clientSecret' => $envVars['AUTH0_CLIENT_SECRET'] ?? 'your-client-secret',
        'audience' => $envVars['AUTH0_AUDIENCE'] ?? 'https://api.coovia.com',
    ];
} else {
    echo "❌ Fichier .env non trouvé\n";
    exit(1);
}

echo "🔐 Test de Validation Token Auth0\n";
echo "================================\n\n";

// Vérifier si un token est fourni
if (!isset($argv[1])) {
    echo "Usage: php test-auth0-token.php <votre_token_jwt>\n";
    echo "\n📋 Pour obtenir un token de test:\n";
    echo "1. Allez sur https://jwt.io\n";
    echo "2. Créez un token de test avec votre domaine Auth0\n";
    echo "3. Ou utilisez un token réel depuis votre application\n";
    echo "\nExemple:\n";
    echo "php test-auth0-token.php eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...\n";
    exit(1);
}

$token = $argv[1];

echo "1. Configuration Auth0:\n";
echo "   - Domain: {$config['domain']}\n";
echo "   - Client ID: {$config['clientId']}\n";
echo "   - Audience: {$config['audience']}\n\n";

echo "2. Token fourni:\n";
echo "   " . substr($token, 0, 50) . "...\n\n";

// Décoder le token JWT (sans validation)
$tokenParts = explode('.', $token);
if (count($tokenParts) !== 3) {
    echo "❌ Format de token invalide (JWT doit avoir 3 parties)\n";
    exit(1);
}

$header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0])), true);
$payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1])), true);

echo "3. Informations du token:\n";
if ($header) {
    echo "   - Algorithm: {$header['alg']}\n";
    echo "   - Type: {$header['typ']}\n";
}
if ($payload) {
    echo "   - Issuer: {$payload['iss']}\n";
    echo "   - Subject: {$payload['sub']}\n";
    echo "   - Audience: " . (is_array($payload['aud']) ? implode(', ', $payload['aud']) : $payload['aud']) . "\n";
    echo "   - Expires: " . date('Y-m-d H:i:s', $payload['exp']) . "\n";
    echo "   - Issued At: " . date('Y-m-d H:i:s', $payload['iat']) . "\n";
    if (isset($payload['email'])) {
        echo "   - Email: {$payload['email']}\n";
    }
    if (isset($payload['name'])) {
        echo "   - Name: {$payload['name']}\n";
    }
}
echo "\n";

// Vérifier l'expiration
if ($payload && isset($payload['exp'])) {
    $now = time();
    if ($payload['exp'] < $now) {
        echo "❌ Token expiré (expiré le " . date('Y-m-d H:i:s', $payload['exp']) . ")\n";
    } else {
        echo "✅ Token non expiré (expire le " . date('Y-m-d H:i:s', $payload['exp']) . ")\n";
    }
}
echo "\n";

// Test de validation avec Auth0 SDK
echo "4. Test de validation avec Auth0 SDK...\n";
try {
    $sdkConfig = new SdkConfiguration([
        'domain' => $config['domain'],
        'clientId' => $config['clientId'],
        'clientSecret' => $config['clientSecret'],
        'audience' => $config['audience'],
    ]);
    
    $verifier = new Verifier(
        $sdkConfig,
        cache: null,
        algorithm: 'RS256',
        leeway: 10
    );
    
    $decoded = $verifier->verify($token);
    echo "✅ Token validé avec succès!\n";
    echo "   - User ID: {$decoded['sub']}\n";
    echo "   - Email: {$decoded['email']}\n";
    echo "   - Name: {$decoded['name']}\n";
    
} catch (Exception $e) {
    echo "❌ Échec de validation: " . $e->getMessage() . "\n";
    echo "\n🔍 Causes possibles:\n";
    echo "- Token malformé\n";
    echo "- Signature invalide\n";
    echo "- Audience incorrecte\n";
    echo "- Domaine Auth0 incorrect\n";
    echo "- Token expiré\n";
}

echo "\n🎯 Prochaines étapes:\n";
echo "1. Testez avec un vrai token depuis votre application\n";
echo "2. Vérifiez la configuration dans votre dashboard Auth0\n";
echo "3. Testez l'API de votre backend: curl -H 'Authorization: Bearer <token>' http://localhost:8000/api/auth/auth0/validate\n";

