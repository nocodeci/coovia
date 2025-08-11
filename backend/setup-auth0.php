<?php

echo "🔐 Configuration Interactive Auth0 pour Coovia\n";
echo "=============================================\n\n";

// Fonction pour lire l'entrée utilisateur
function readInput($prompt) {
    echo $prompt;
    $handle = fopen("php://stdin", "r");
    $line = fgets($handle);
    fclose($handle);
    return trim($line);
}

// Fonction pour valider un domaine Auth0
function validateAuth0Domain($domain) {
    if (empty($domain)) return false;
    if (!preg_match('/^[a-zA-Z0-9-]+\.auth0\.com$/', $domain)) {
        return false;
    }
    return true;
}

// Fonction pour valider un Client ID
function validateClientId($clientId) {
    if (empty($clientId)) return false;
    if (strlen($clientId) < 10) return false;
    return true;
}

echo "📋 Étapes de configuration:\n";
echo "1. Créer un compte Auth0 sur https://auth0.com\n";
echo "2. Créer une application Single Page Application\n";
echo "3. Créer une API avec l'audience https://api.coovia.com\n";
echo "4. Récupérer les informations de configuration\n\n";

echo "🚀 Commençons la configuration...\n\n";

// Demander le domaine Auth0
do {
    $domain = readInput("Entrez votre domaine Auth0 (ex: mon-app.auth0.com): ");
    if (!validateAuth0Domain($domain)) {
        echo "❌ Format invalide. Le domaine doit être au format: nom.auth0.com\n";
    }
} while (!validateAuth0Domain($domain));

// Demander le Client ID
do {
    $clientId = readInput("Entrez votre Client ID (Application SPA): ");
    if (!validateClientId($clientId)) {
        echo "❌ Client ID invalide. Vérifiez dans votre dashboard Auth0.\n";
    }
} while (!validateClientId($clientId));

// Demander le Client Secret
$clientSecret = readInput("Entrez votre Client Secret (optionnel pour SPA): ");

// Audience par défaut
$audience = "https://api.coovia.com";

echo "\n📝 Résumé de la configuration:\n";
echo "==============================\n";
echo "Domain: $domain\n";
echo "Client ID: $clientId\n";
echo "Client Secret: " . (empty($clientSecret) ? "Non fourni" : substr($clientSecret, 0, 10) . "...") . "\n";
echo "Audience: $audience\n";

$confirm = readInput("\nConfirmez-vous cette configuration? (y/N): ");
if (strtolower($confirm) !== 'y' && strtolower($confirm) !== 'yes') {
    echo "❌ Configuration annulée.\n";
    exit(0);
}

// Mettre à jour le fichier .env
echo "\n🔧 Mise à jour du fichier .env...\n";

$envFile = '.env';
$envContent = file_get_contents($envFile);

// Remplacer les valeurs Auth0
$envContent = preg_replace('/AUTH0_DOMAIN=.*/', "AUTH0_DOMAIN=$domain", $envContent);
$envContent = preg_replace('/AUTH0_CLIENT_ID=.*/', "AUTH0_CLIENT_ID=$clientId", $envContent);
if (!empty($clientSecret)) {
    $envContent = preg_replace('/AUTH0_CLIENT_SECRET=.*/', "AUTH0_CLIENT_SECRET=$clientSecret", $envContent);
}
$envContent = preg_replace('/AUTH0_AUDIENCE=.*/', "AUTH0_AUDIENCE=$audience", $envContent);

// Ajouter les variables si elles n'existent pas
if (strpos($envContent, 'AUTH0_DOMAIN') === false) {
    $envContent .= "\n# Auth0 Configuration\n";
    $envContent .= "AUTH0_DOMAIN=$domain\n";
    $envContent .= "AUTH0_CLIENT_ID=$clientId\n";
    if (!empty($clientSecret)) {
        $envContent .= "AUTH0_CLIENT_SECRET=$clientSecret\n";
    }
    $envContent .= "AUTH0_AUDIENCE=$audience\n";
    $envContent .= "AUTH0_REDIRECT_URI=http://localhost:3000\n";
    $envContent .= "AUTH0_JWT_LEEWAY=10\n";
    $envContent .= "AUTH0_JWT_ALGORITHM=RS256\n";
    $envContent .= "AUTH0_CACHE_ENABLED=true\n";
    $envContent .= "AUTH0_CACHE_TTL=3600\n";
    $envContent .= "AUTH0_AUTO_SYNC_USER=true\n";
    $envContent .= "AUTH0_CREATE_USER_IF_NOT_EXISTS=true\n";
}

file_put_contents($envFile, $envContent);
echo "✅ Fichier .env mis à jour\n";

// Mettre à jour le fichier .env du frontend
echo "\n🔧 Mise à jour du fichier frontend/.env...\n";
$frontendEnvFile = '../frontend/.env';
$frontendEnvContent = file_get_contents($frontendEnvFile);

$frontendEnvContent = preg_replace('/VITE_AUTH0_DOMAIN=.*/', "VITE_AUTH0_DOMAIN=$domain", $frontendEnvContent);
$frontendEnvContent = preg_replace('/VITE_AUTH0_CLIENT_ID=.*/', "VITE_AUTH0_CLIENT_ID=$clientId", $frontendEnvContent);
$frontendEnvContent = preg_replace('/VITE_AUTH0_AUDIENCE=.*/', "VITE_AUTH0_AUDIENCE=$audience", $frontendEnvContent);

file_put_contents($frontendEnvFile, $frontendEnvContent);
echo "✅ Fichier frontend/.env mis à jour\n";

// Tester la connexion
echo "\n🧪 Test de la connexion Auth0...\n";
$wellKnownUrl = "https://$domain/.well-known/openid_configuration";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $wellKnownUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ Connexion à Auth0 réussie!\n";
    $configData = json_decode($response, true);
    if ($configData) {
        echo "   - Issuer: {$configData['issuer']}\n";
        echo "   - Authorization Endpoint: {$configData['authorization_endpoint']}\n";
    }
} else {
    echo "❌ Échec de connexion à Auth0 (HTTP $httpCode)\n";
    echo "   Vérifiez votre domaine Auth0\n";
}

echo "\n🎉 Configuration terminée!\n";
echo "========================\n";
echo "✅ Variables d'environnement configurées\n";
echo "✅ Connexion Auth0 testée\n";
echo "\n🚀 Prochaines étapes:\n";
echo "1. Démarrer le backend: php artisan serve --port=8001\n";
echo "2. Démarrer le frontend: cd ../frontend && npm run dev\n";
echo "3. Tester la connexion sur http://localhost:3000\n";
echo "\n📚 Documentation:\n";
echo "- Auth0 Dashboard: https://manage.auth0.com\n";
echo "- Test de connexion: php test-auth0.php\n";

