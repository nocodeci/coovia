<?php

echo "🔑 Générateur de Token Simple\n";
echo "============================\n\n";

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
    // Créer un nouvel utilisateur de test
    echo "1. Création d'un nouvel utilisateur de test...\n";
    
    $newUser = \App\Models\User::create([
        'id' => \Illuminate\Support\Str::uuid(),
        'name' => 'Test User Fresh',
        'email' => 'test-fresh-' . time() . '@example.com',
        'password' => bcrypt('password123'),
        'role' => 'user'
    ]);
    
    echo "   ✅ Utilisateur créé:\n";
    echo "   - ID: {$newUser->id}\n";
    echo "   - Email: {$newUser->email}\n";
    echo "   - Nom: {$newUser->name}\n\n";

    // Créer un token pour cet utilisateur
    echo "2. Création du token d'authentification...\n";
    $token = $newUser->createToken('fresh-test-token')->plainTextToken;
    
    echo "   ✅ Token créé:\n";
    echo "   " . $token . "\n\n";
    
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
    
    if ($httpCode === 200) {
        echo "   ✅ Authentification réussie!\n\n";
        
        echo "📋 Instructions pour utiliser ce token:\n";
        echo "1. Ouvrez la console du navigateur (F12)\n";
        echo "2. Exécutez cette commande:\n";
        echo "   localStorage.setItem('sanctum_token', '$token');\n";
        echo "3. Rechargez la page\n";
        echo "4. Testez la création de boutique\n\n";
        
        echo "🎯 Ce token devrait permettre de créer une nouvelle boutique !\n";
        echo "   (Cet utilisateur n'a pas encore de boutique)\n\n";
        
        echo "🔧 Alternative: Utilisez la page de fix mise à jour\n";
        echo "   http://localhost:5175/fix-auth.html\n";
        
    } else {
        echo "   ❌ Échec de l'authentification\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
