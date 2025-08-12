<?php

echo "🔍 Diagnostic de l'erreur frontend\n";
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
    // Vérifier l'utilisateur KOFFIYOHANERIC225@GMAIL.COM
    $user = \App\Models\User::where('email', 'KOFFIYOHANERIC225@GMAIL.COM')->first();
    
    if (!$user) {
        echo "❌ Utilisateur KOFFIYOHANERIC225@GMAIL.COM non trouvé\n";
        exit(1);
    }

    echo "1. Utilisateur:\n";
    echo "   - ID: {$user->id}\n";
    echo "   - Email: {$user->email}\n";
    echo "   - Nom: {$user->name}\n";
    echo "   - Rôle: {$user->role}\n\n";

    // Vérifier les boutiques de cet utilisateur
    $stores = \App\Models\Store::where('owner_id', $user->id)->get();
    
    echo "2. Boutiques de l'utilisateur:\n";
    if ($stores->count() > 0) {
        foreach ($stores as $store) {
            echo "   - ID: {$store->id}\n";
            echo "   - Nom: {$store->name}\n";
            echo "   - Slug: {$store->slug}\n";
            echo "   - Statut: {$store->status}\n";
            echo "   - Créée: {$store->created_at}\n";
            echo "   ---\n";
        }
        echo "   ❌ L'utilisateur a déjà {$stores->count()} boutique(s)\n\n";
    } else {
        echo "   ✅ Aucune boutique trouvée\n\n";
    }

    // Créer un nouveau token pour tester
    echo "3. Création d'un nouveau token de test...\n";
    $token = $user->createToken('debug-token')->plainTextToken;
    echo "   ✅ Token créé: " . substr($token, 0, 50) . "...\n\n";

    // Tester l'API de création avec le même format que le frontend
    echo "4. Test de l'API de création (format frontend)...\n";
    
    $formData = [
        'name' => 'Test Debug Frontend',
        'slug' => 'test-debug-frontend',
        'description' => 'Test de diagnostic frontend',
        'productType' => 'digital',
        'productCategories' => json_encode(['formations']),
        'address[city]' => 'Abidjan',
        'contact[email]' => 'test@debug-frontend.com',
        'contact[phone]' => '+2250123456789',
        'settings[paymentMethods]' => json_encode(['wozif']),
        'settings[currency]' => 'XOF',
        'settings[monneroo][enabled]' => '0',
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
    
    if ($httpCode === 400) {
        $responseData = json_decode($response, true);
        if (strpos($responseData['message'], 'déjà une boutique') !== false) {
            echo "   ❌ Erreur attendue : L'utilisateur a déjà une boutique\n\n";
            
            echo "5. Solution : Supprimer la boutique existante...\n";
            $store = $stores->first();
            if ($store) {
                $store->delete();
                echo "   ✅ Boutique supprimée\n\n";
                
                echo "6. Test de création après suppression...\n";
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
                    echo "   ✅ Création réussie après suppression !\n\n";
                    
                    echo "📋 Token à utiliser dans le navigateur:\n";
                    echo "localStorage.setItem('sanctum_token', '$token');\n\n";
                    
                    echo "🎯 Maintenant vous pouvez créer une boutique via l'interface !\n";
                }
            }
        }
    } else if ($httpCode === 200 || $httpCode === 201) {
        echo "   ✅ Création réussie !\n\n";
        
        echo "📋 Token à utiliser dans le navigateur:\n";
        echo "localStorage.setItem('sanctum_token', '$token');\n\n";
        
        echo "🎯 Le système fonctionne, utilisez ce token !\n";
    } else {
        echo "   ❌ Erreur inattendue\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
