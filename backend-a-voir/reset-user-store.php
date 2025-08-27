<?php

echo "🔄 Reset de la boutique utilisateur\n";
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
    // Trouver l'utilisateur KOFFIYOHANERIC225@GMAIL.COM
    $user = \App\Models\User::where('email', 'KOFFIYOHANERIC225@GMAIL.COM')->first();
    
    if (!$user) {
        echo "❌ Utilisateur KOFFIYOHANERIC225@GMAIL.COM non trouvé\n";
        exit(1);
    }

    echo "1. Utilisateur trouvé:\n";
    echo "   - ID: {$user->id}\n";
    echo "   - Email: {$user->email}\n";
    echo "   - Nom: {$user->name}\n\n";

    // Trouver la boutique de cet utilisateur
    $store = \App\Models\Store::where('owner_id', $user->id)->first();
    
    if ($store) {
        echo "2. Boutique existante trouvée:\n";
        echo "   - ID: {$store->id}\n";
        echo "   - Nom: {$store->name}\n";
        echo "   - Slug: {$store->slug}\n";
        echo "   - Créée: {$store->created_at}\n\n";
        
        // Supprimer la boutique
        echo "3. Suppression de la boutique...\n";
        $store->delete();
        echo "   ✅ Boutique supprimée avec succès !\n\n";
        
        // Vérifier qu'il n'y a plus de boutique
        $remainingStore = \App\Models\Store::where('owner_id', $user->id)->first();
        if (!$remainingStore) {
            echo "   ✅ Vérification : Aucune boutique restante\n\n";
        } else {
            echo "   ❌ Erreur : Boutique toujours présente\n\n";
        }
        
    } else {
        echo "2. Aucune boutique trouvée pour cet utilisateur\n\n";
    }

    // Créer un nouveau token
    echo "4. Création d'un nouveau token...\n";
    $token = $user->createToken('reset-test-token')->plainTextToken;
    echo "   ✅ Token créé: " . substr($token, 0, 50) . "...\n\n";
    
    // Tester l'authentification
    echo "5. Test d'authentification...\n";
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
    
    if ($httpCode === 200) {
        echo "   ✅ Authentification réussie !\n\n";
        
        echo "📋 Instructions pour utiliser ce token:\n";
        echo "1. Ouvrez la console du navigateur (F12)\n";
        echo "2. Exécutez cette commande:\n";
        echo "   localStorage.setItem('sanctum_token', '$token');\n";
        echo "3. Rechargez la page\n";
        echo "4. Testez la création de boutique\n\n";
        
        echo "🎯 Maintenant vous devriez pouvoir créer une nouvelle boutique !\n";
        
    } else {
        echo "   ❌ Échec de l'authentification\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
