<?php

echo "🔍 Vérification de l'état d'authentification\n";
echo "===========================================\n\n";

// Vérifier les utilisateurs dans la base de données
echo "1. Utilisateurs dans la base de données:\n";

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
    $users = \App\Models\User::all(['id', 'email', 'name', 'role', 'created_at']);
    
    if ($users->count() > 0) {
        foreach ($users as $user) {
            echo "   - ID: {$user->id}\n";
            echo "     Email: {$user->email}\n";
            echo "     Nom: {$user->name}\n";
            echo "     Rôle: {$user->role}\n";
            echo "     Créé: {$user->created_at}\n";
            echo "     ---\n";
        }
    } else {
        echo "   ❌ Aucun utilisateur trouvé\n";
    }
} catch (\Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n2. Test de création d'un token d'authentification...\n";

try {
    $user = \App\Models\User::first();
    if ($user) {
        // Créer un token Sanctum
        $token = $user->createToken('test-token')->plainTextToken;
        echo "   ✅ Token créé pour {$user->email}\n";
        echo "   Token: " . substr($token, 0, 50) . "...\n\n";
        
        // Tester l'authentification avec ce token
        echo "3. Test d'authentification avec le token...\n";
        
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
            
            // Tester la création de boutique avec ce token
            echo "4. Test de création de boutique avec authentification...\n";
            
            $formData = [
                'name' => 'Boutique Test Auth',
                'slug' => 'boutique-test-auth',
                'description' => 'Test avec authentification',
                'productType' => 'digital',
                'productCategories' => json_encode(['formations']),
                'address[city]' => 'Abidjan',
                'contact[email]' => 'test@auth.com',
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
                echo "   ✅ Création de boutique réussie!\n";
            } else {
                echo "   ❌ Erreur lors de la création de boutique\n";
            }
        } else {
            echo "   ❌ Échec de l'authentification\n";
        }
        
    } else {
        echo "   ❌ Aucun utilisateur disponible pour le test\n";
    }
} catch (\Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n📚 Recommandations:\n";
echo "   1. Vérifiez que l'utilisateur est connecté dans le frontend\n";
echo "   2. Vérifiez que le token est stocké dans localStorage\n";
echo "   3. Vérifiez que le token est envoyé dans les headers\n";
echo "   4. Vérifiez la configuration CORS si nécessaire\n\n";
