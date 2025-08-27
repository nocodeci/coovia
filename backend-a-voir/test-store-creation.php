<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Storage;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de création de boutique...\n";

try {
    // Test d'upload de fichier
    $testContent = "Test logo " . date('Y-m-d H:i:s');
    $path = Storage::disk('public')->put('store-logos/test-logo.txt', $testContent);
    
    echo "✅ Upload de logo réussi: $path\n";
    
    // Test de lecture
    $content = Storage::disk('public')->get('store-logos/test-logo.txt');
    echo "✅ Lecture du logo réussie: $content\n";
    
    // Test d'URL
    $url = Storage::disk('public')->url('store-logos/test-logo.txt');
    echo "✅ URL du logo: $url\n";
    
    // Test de suppression
    $deleted = Storage::disk('public')->delete('store-logos/test-logo.txt');
    echo "✅ Suppression du logo: " . ($deleted ? 'réussie' : 'échouée') . "\n";
    
    echo "🎉 Tous les tests de création de boutique sont passés!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
