<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Storage;

// Démarrer Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test d'upload avec stockage local...\n";

try {
    // Test d'upload simple
    $testContent = "Test upload " . date('Y-m-d H:i:s');
    $path = Storage::disk('local')->put('test/upload-test.txt', $testContent);
    
    echo "✅ Upload réussi: $path\n";
    
    // Test de lecture
    $content = Storage::disk('local')->get('test/upload-test.txt');
    echo "✅ Lecture réussie: $content\n";
    
    // Test d'URL publique (si stockage public)
    if (Storage::disk('public')->exists('test/upload-test.txt')) {
        $url = Storage::disk('public')->url('test/upload-test.txt');
        echo "✅ URL publique: $url\n";
    }
    
    // Test avec le disk par défaut
    $defaultDisk = config('filesystems.default');
    echo "✅ Disk par défaut: $defaultDisk\n";
    
    // Test d'upload avec le disk par défaut
    $path2 = Storage::put('test/default-disk-test.txt', $testContent);
    echo "✅ Upload avec disk par défaut: $path2\n";
    
    echo "🎉 Tous les tests d'upload sont passés!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
