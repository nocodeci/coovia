<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Config;

// Charger la configuration Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test Configuration Cloudflare R2 ===\n\n";

// Afficher la configuration
echo "Configuration actuelle:\n";
echo "- Access Key ID: " . env('CLOUDFLARE_ACCESS_KEY_ID') . "\n";
echo "- Secret Access Key: " . substr(env('CLOUDFLARE_SECRET_ACCESS_KEY'), 0, 10) . "...\n";
echo "- Bucket: " . env('CLOUDFLARE_R2_BUCKET') . "\n";
echo "- Endpoint: " . env('CLOUDFLARE_R2_ENDPOINT') . "\n";
echo "- Public URL: " . env('CLOUDFLARE_R2_PUBLIC_URL') . "\n\n";

// Tester le disque R2
try {
    $disk = Storage::disk('r2');
    echo "✅ Disque R2 configuré avec succès\n";
    
    // Tester l'upload d'un fichier de test
    $testContent = "Test file content - " . date('Y-m-d H:i:s');
    $testPath = 'test/test-file-' . time() . '.txt';
    
    echo "📤 Test d'upload vers: {$testPath}\n";
    $uploaded = $disk->put($testPath, $testContent);
    
    if ($uploaded) {
        echo "✅ Upload réussi\n";
        
        // Tester la récupération
        $retrieved = $disk->get($testPath);
        if ($retrieved === $testContent) {
            echo "✅ Récupération réussie\n";
        } else {
            echo "❌ Échec de la récupération\n";
        }
        
        // Tester l'URL
        $url = $disk->url($testPath);
        echo "🔗 URL générée: {$url}\n";
        
        // Tester l'accès HTTP
        $headers = get_headers($url);
        if ($headers && strpos($headers[0], '200') !== false) {
            echo "✅ Accès HTTP réussi\n";
        } else {
            echo "❌ Échec de l'accès HTTP: " . ($headers[0] ?? 'Pas de réponse') . "\n";
        }
        
        // Nettoyer
        $disk->delete($testPath);
        echo "🧹 Fichier de test supprimé\n";
        
    } else {
        echo "❌ Échec de l'upload\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n=== Fin du test ===\n";
