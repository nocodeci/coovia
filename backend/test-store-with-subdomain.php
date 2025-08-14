<?php

require_once 'vendor/autoload.php';

use App\Services\SubdomainService;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de création de boutique avec sous-domaine...\n";

try {
    $subdomainService = new SubdomainService();
    
    // Générer un slug unique
    $testSlug = 'test-boutique-' . time();
    
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
        echo "⚠️ Le sous-domaine existe déjà, test annulé\n";
        exit(1);
    }
    
    // Créer le sous-domaine
    echo "🚀 Création du sous-domaine...\n";
    $created = $subdomainService->createSubdomain($testSlug);
    
    if ($created) {
        echo "✅ Sous-domaine créé avec succès!\n";
        echo "🌐 URL: " . $subdomainService->getSubdomainUrl($testSlug) . "\n";
        
        // Vérifier que le sous-domaine existe maintenant
        sleep(2); // Attendre un peu
        $existsNow = $subdomainService->subdomainExists($testSlug);
        echo "🔍 Vérification post-création: " . ($existsNow ? 'existe' : 'n\'existe pas') . "\n";
        
        // Supprimer le sous-domaine de test
        echo "🗑️ Suppression du sous-domaine de test...\n";
        $deleted = $subdomainService->deleteSubdomain($testSlug);
        echo "✅ Suppression: " . ($deleted ? 'réussie' : 'échouée') . "\n";
        
    } else {
        echo "❌ Échec de la création du sous-domaine\n";
    }
    
    echo "🎉 Test terminé!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
