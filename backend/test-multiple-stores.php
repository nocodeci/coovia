<?php

echo "🧪 Test de Création de Plusieurs Boutiques\n";
echo "==========================================\n\n";

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
    // Trouver l'utilisateur
    $user = \App\Models\User::where('email', 'KOFFIYOHANERIC225@GMAIL.COM')->first();
    
    if (!$user) {
        echo "❌ Utilisateur KOFFIYOHANERIC225@GMAIL.COM non trouvé\n";
        exit(1);
    }

    echo "1. Utilisateur:\n";
    echo "   - ID: {$user->id}\n";
    echo "   - Email: {$user->email}\n";
    echo "   - Nom: {$user->name}\n\n";

    // Vérifier les boutiques existantes
    $existingStores = \App\Models\Store::where('owner_id', $user->id)->get();
    echo "2. Boutiques existantes: {$existingStores->count()}\n";
    foreach ($existingStores as $store) {
        echo "   - {$store->name} ({$store->slug})\n";
    }
    echo "\n";

    // Créer un token
    $token = $user->createToken('multi-store-test')->plainTextToken;
    echo "3. Token créé: " . substr($token, 0, 50) . "...\n\n";

    // Créer plusieurs boutiques
    $storesToCreate = [
        [
            'name' => 'Boutique Électronique',
            'slug' => 'boutique-electronique',
            'description' => 'Spécialisée dans les produits électroniques',
            'productType' => 'digital',
            'productCategories' => ['logiciels', 'applications']
        ],
        [
            'name' => 'Boutique Formation',
            'slug' => 'boutique-formation',
            'description' => 'Cours et formations en ligne',
            'productType' => 'digital',
            'productCategories' => ['formations', 'cours']
        ],
        [
            'name' => 'Boutique Design',
            'slug' => 'boutique-design',
            'description' => 'Templates et ressources design',
            'productType' => 'digital',
            'productCategories' => ['templates', 'ressources']
        ]
    ];

    echo "4. Création de plusieurs boutiques...\n\n";

    foreach ($storesToCreate as $index => $storeData) {
        echo "   Boutique " . ($index + 1) . ": {$storeData['name']}\n";
        
        $formData = [
            'name' => $storeData['name'],
            'slug' => $storeData['slug'],
            'description' => $storeData['description'],
            'productType' => $storeData['productType'],
            'productCategories' => json_encode($storeData['productCategories']),
            'address[city]' => 'Abidjan',
            'contact[email]' => 'contact@' . $storeData['slug'] . '.com',
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
        
        if ($httpCode === 200 || $httpCode === 201) {
            $responseData = json_decode($response, true);
            echo "   ✅ Créée avec succès: {$responseData['data']['slug']}.wozif.store\n";
        } else {
            $responseData = json_decode($response, true);
            echo "   ❌ Erreur: {$responseData['message']}\n";
        }
        echo "\n";
    }

    // Vérifier le nombre final de boutiques
    $finalStores = \App\Models\Store::where('owner_id', $user->id)->get();
    echo "5. Résultat final:\n";
    echo "   Total de boutiques: {$finalStores->count()}\n";
    foreach ($finalStores as $store) {
        echo "   - {$store->name} ({$store->slug}.wozif.store)\n";
    }
    echo "\n";

    if ($finalStores->count() > 1) {
        echo "🎉 SUCCÈS ! L'utilisateur peut maintenant créer plusieurs boutiques !\n\n";
        
        echo "📋 Token à utiliser dans le navigateur:\n";
        echo "localStorage.setItem('sanctum_token', '$token');\n\n";
        
        echo "🎯 Maintenant vous pouvez créer plusieurs boutiques via l'interface !\n";
    } else {
        echo "❌ Le système ne permet toujours qu'une seule boutique par utilisateur.\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
