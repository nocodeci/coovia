<?php

require_once 'vendor/autoload.php';

use App\Services\SubdomainService;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🚀 Création d'un sous-domaine de test permanent...\n";

try {
    $subdomainService = new SubdomainService();
    
    // Générer un slug unique
    $testSlug = 'test-boutique-' . date('Ymd-His');
    
    echo "📝 Slug généré: $testSlug\n";
    
    // Valider le slug
    $validation = $subdomainService->validateSlug($testSlug);
    echo "✅ Validation: " . ($validation['valid'] ? 'valide' : 'invalide') . "\n";
    
    if (!$validation['valid']) {
        echo "❌ Erreurs: " . implode(', ', $validation['errors']) . "\n";
        exit(1);
    }
    
    // Vérifier si le sous-domaine existe déjà
    $exists = $subdomainService->subdomainExists($testSlug);
    echo "🔍 Sous-domaine existe: " . ($exists ? 'oui' : 'non') . "\n";
    
    if ($exists) {
        echo "⚠️ Le sous-domaine existe déjà\n";
        echo "🌐 URL: " . $subdomainService->getSubdomainUrl($testSlug) . "\n";
        exit(0);
    }
    
    // Créer le sous-domaine
    echo "🚀 Création du sous-domaine...\n";
    $created = $subdomainService->createSubdomain($testSlug);
    
    if ($created) {
        echo "✅ Sous-domaine créé avec succès!\n";
        echo "🌐 URL: " . $subdomainService->getSubdomainUrl($testSlug) . "\n";
        echo "📋 Vérifiez dans Vercel Dashboard: https://vercel.com/dashboard\n";
        echo "🔍 Projet: wozif-store\n";
        echo "📁 Section: Domains\n";
        
        // Vérifier que le sous-domaine existe maintenant
        sleep(2);
        $existsNow = $subdomainService->subdomainExists($testSlug);
        echo "🔍 Vérification post-création: " . ($existsNow ? 'existe' : 'n\'existe pas') . "\n";
        
        echo "\n🎉 Sous-domaine de test créé et conservé!\n";
        echo "💡 Pour le supprimer plus tard, utilisez: php delete-test-subdomain.php $testSlug\n";
        
    } else {
        echo "❌ Échec de la création du sous-domaine\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
