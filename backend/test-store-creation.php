<?php

require_once 'vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Bootstrap Laravel
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

echo "🧪 Test de création de boutique via l'API\n";
echo "==========================================\n\n";

try {
    // Simuler une requête de création de boutique
    $requestData = [
        'name' => 'Boutique Test API',
        'slug' => 'boutique-test-api',
        'description' => 'Boutique de test créée via API',
        'productType' => 'digital',
        'productCategories' => json_encode(['formations']),
        'address' => [
            'city' => 'Abidjan'
        ],
        'contact' => [
            'email' => 'test@wozif.com',
            'phone' => '+2250123456789'
        ],
        'settings' => [
            'paymentMethods' => json_encode(['wozif']),
            'currency' => 'XOF',
            'monneroo' => [
                'enabled' => false,
                'secretKey' => '',
                'environment' => 'sandbox'
            ]
        ]
    ];

    echo "1. Préparation des données de test...\n";
    echo "   - Nom: {$requestData['name']}\n";
    echo "   - Slug: {$requestData['slug']}\n";
    echo "   - Type: {$requestData['productType']}\n";
    echo "   ✅ Données préparées\n\n";

    // Créer une requête simulée
    $request = new \Illuminate\Http\Request();
    $request->merge($requestData);

    // Simuler un utilisateur authentifié
    $user = \App\Models\User::first();
    if (!$user) {
        echo "❌ Aucun utilisateur trouvé dans la base de données\n";
        exit(1);
    }

    echo "2. Utilisateur authentifié...\n";
    echo "   - Email: {$user->email}\n";
    echo "   - ID: {$user->id}\n";
    echo "   ✅ Utilisateur trouvé\n\n";

    // Simuler l'authentification
    auth()->login($user);

    echo "3. Test de création de boutique...\n";
    
    // Appeler le contrôleur directement
    $controller = new \App\Http\Controllers\Api\StoreController();
    
    // Simuler l'utilisateur dans la requête
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
    
    $response = $controller->createStore($request);
    
    $responseData = json_decode($response->getContent(), true);
    
    if ($responseData['success']) {
        echo "   ✅ Boutique créée avec succès!\n";
        echo "   - ID: {$responseData['data']['id']}\n";
        echo "   - Nom: {$responseData['data']['name']}\n";
        echo "   - Slug: {$responseData['data']['slug']}\n";
        echo "   - Domaine: {$responseData['data']['slug']}.wozif.store\n";
        
        if (isset($responseData['data']['settings']['paymentMethods'])) {
            echo "   - Méthodes de paiement: " . implode(', ', $responseData['data']['settings']['paymentMethods']) . "\n";
        }
        
        echo "\n4. Vérification de l'email...\n";
        echo "   📧 Email de confirmation envoyé à {$user->email}\n";
        echo "   🔍 Vérifiez votre boîte email\n\n";
        
    } else {
        echo "   ❌ Erreur lors de la création\n";
        echo "   - Message: {$responseData['message']}\n";
        
        if (isset($responseData['errors'])) {
            echo "   - Erreurs de validation:\n";
            foreach ($responseData['errors'] as $field => $errors) {
                echo "     * {$field}: " . implode(', ', $errors) . "\n";
            }
        }
    }

} catch (\Exception $e) {
    echo "❌ Erreur lors du test: " . $e->getMessage() . "\n";
    echo "📋 Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n📚 Prochaines étapes:\n";
echo "   🔄 Testez la création via l'interface frontend\n";
echo "   📬 Vérifiez la réception de l'email\n";
echo "   🌐 Testez l'accès au sous-domaine\n";
echo "   🎨 Personnalisez le template si nécessaire\n\n";
