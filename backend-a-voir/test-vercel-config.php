<?php

require_once 'vendor/autoload.php';

use App\Services\SubdomainService;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de configuration Vercel...\n";

try {
    $subdomainService = new SubdomainService();
    
    // Test de validation de slug
    $testSlug = 'test-boutique-' . time();
    $validation = $subdomainService->validateSlug($testSlug);
    
    echo "✅ Validation de slug: " . ($validation['valid'] ? 'valide' : 'invalide') . "\n";
    if (!$validation['valid']) {
        echo "❌ Erreurs: " . implode(', ', $validation['errors']) . "\n";
    }
    
    // Test de vérification d'existence
    $exists = $subdomainService->subdomainExists($testSlug);
    echo "✅ Vérification d'existence: " . ($exists ? 'existe' : 'n\'existe pas') . "\n";
    
    // Test d'URL
    $url = $subdomainService->getSubdomainUrl($testSlug);
    echo "✅ URL générée: $url\n";
    
    echo "🎉 Configuration Vercel testée avec succès!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
