<?php

require_once 'vendor/autoload.php';

use App\Services\SubdomainService;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Récupérer le slug depuis les arguments
$slug = $argv[1] ?? null;

if (!$slug) {
    echo "❌ Usage: php delete-test-subdomain.php <slug>\n";
    echo "💡 Exemple: php delete-test-subdomain.php test-boutique-20250814-071548\n";
    exit(1);
}

echo "🗑️ Suppression du sous-domaine de test...\n";

try {
    $subdomainService = new SubdomainService();
    
    echo "📝 Slug à supprimer: $slug\n";
    
    // Vérifier si le sous-domaine existe
    $exists = $subdomainService->subdomainExists($slug);
    echo "🔍 Sous-domaine existe: " . ($exists ? 'oui' : 'non') . "\n";
    
    if (!$exists) {
        echo "⚠️ Le sous-domaine n'existe pas\n";
        exit(0);
    }
    
    // Supprimer le sous-domaine
    echo "🚀 Suppression du sous-domaine...\n";
    $deleted = $subdomainService->deleteSubdomain($slug);
    
    if ($deleted) {
        echo "✅ Sous-domaine supprimé avec succès!\n";
        echo "🌐 URL supprimée: " . $subdomainService->getSubdomainUrl($slug) . "\n";
        
        // Vérifier que le sous-domaine n'existe plus
        sleep(2);
        $existsNow = $subdomainService->subdomainExists($slug);
        echo "🔍 Vérification post-suppression: " . ($existsNow ? 'existe encore' : 'supprimé') . "\n";
        
        echo "\n🎉 Sous-domaine de test supprimé!\n";
        
    } else {
        echo "❌ Échec de la suppression du sous-domaine\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
