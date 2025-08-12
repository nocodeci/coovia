<?php

echo "🔍 Test avec l'utilisateur actuel\n";
echo "==================================\n\n";

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__FILE__))
    ->withRouting(
        web: __DIR__.'/routes/web.php',
        api: __DIR__.'/routes/api.php',
        commands: __DIR__.'/routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    // Trouver l'utilisateur qui a reçu l'OTP récemment
    $user = \App\Models\User::where('email', 'KOFFIYOHANERIC225@GMAIL.COM')->first();
    
    if (!$user) {
        echo "❌ Utilisateur KOFFIYOHANERIC225@GMAIL.COM non trouvé\n";
        exit(1);
    }

    echo "1. Utilisateur trouvé:\n";
    echo "   - ID: {$user->id}\n";
    echo "   - Email: {$user->email}\n";
    echo "   - Nom: {$user->name}\n";
    echo "   - Rôle: {$user->role}\n";
    echo "   ✅ Utilisateur identifié\n\n";

    // Créer un token pour cet utilisateur
    echo "2. Création d'un token d'authentification...\n";
    $token = $user->createToken('frontend-token')->plainTextToken;
    echo "   ✅ Token créé: " . substr($token, 0, 50) . "...\n\n";

    // Tester l'authentification
    echo "3. Test d'authentification...\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/auth/check');
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   Code HTTP: $httpCode\n";
    echo "   Réponse: $response\n\n";
    
    if ($httpCode === 200) {
        echo "   ✅ Authentification réussie!\n\n";
        
        // Tester la création de boutique
        echo "4. Test de création de boutique...\n";
        
        $formData = [
            'name' => 'Boutique Test Utilisateur Actuel',
            'slug' => 'boutique-test-utilisateur-actuel',
            'description' => 'Test avec l\'utilisateur actuellement connecté',
            'productType' => 'digital',
            'productCategories' => json_encode(['formations']),
            'address[city]' => 'Abidjan',
            'contact[email]' => 'contact@boutique-test.com',
            'contact[phone]' => '+2250123456789',
            'settings[paymentMethods]' => json_encode(['wozif']),
            'settings[currency]' => 'XOF',
            'settings[monneroo][enabled]' => false,
            'settings[monneroo][secretKey]' => '',
            'settings[monneroo][environment]' => 'sandbox'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/stores/create');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "   Code HTTP: $httpCode\n";
        echo "   Réponse: $response\n\n";
        
        if ($httpCode === 200 || $httpCode === 201) {
            $responseData = json_decode($response, true);
            if ($responseData['success']) {
                echo "   ✅ Création de boutique réussie!\n";
                echo "   - ID: {$responseData['data']['id']}\n";
                echo "   - Nom: {$responseData['data']['name']}\n";
                echo "   - Slug: {$responseData['data']['slug']}\n";
                echo "   - Domaine: {$responseData['data']['slug']}.wozif.store\n";
                
                echo "\n5. Token pour le frontend:\n";
                echo "   Copiez ce token dans localStorage:\n";
                echo "   localStorage.setItem('sanctum_token', '$token');\n\n";
                
                echo "6. Test dans le navigateur:\n";
                echo "   Ouvrez la console (F12) et exécutez:\n";
                echo "   localStorage.setItem('sanctum_token', '$token');\n";
                echo "   Puis testez la création de boutique\n\n";
                
            } else {
                echo "   ❌ Erreur lors de la création\n";
                echo "   - Message: {$responseData['message']}\n";
                if (isset($responseData['errors'])) {
                    echo "   - Erreurs:\n";
                    foreach ($responseData['errors'] as $field => $errors) {
                        echo "     * $field: " . implode(', ', $errors) . "\n";
                    }
                }
            }
        } else {
            echo "   ❌ Erreur HTTP $httpCode\n";
            echo "   Réponse: $response\n";
        }
    } else {
        echo "   ❌ Échec de l'authentification\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n📚 Instructions pour résoudre le problème:\n";
echo "1. Copiez le token ci-dessus\n";
echo "2. Ouvrez la console du navigateur (F12)\n";
echo "3. Exécutez: localStorage.setItem('sanctum_token', 'TOKEN_ICI');\n";
echo "4. Rechargez la page et testez la création de boutique\n\n";
