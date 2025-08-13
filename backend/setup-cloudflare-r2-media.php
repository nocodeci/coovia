<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Storage;
use App\Models\StoreMedia;

echo "🚀 Configuration Cloudflare R2 pour les médias\n\n";

// Initialiser Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Vérifier la configuration R2
    echo "🔧 Vérification de la configuration R2...\n";
    
    $r2Config = config('filesystems.disks.r2');
    echo "Access Key ID: " . substr($r2Config['key'], 0, 10) . "...\n";
    echo "Secret Access Key: " . substr($r2Config['secret'], 0, 10) . "...\n";
    echo "Bucket: " . $r2Config['bucket'] . "\n";
    echo "Endpoint: " . $r2Config['endpoint'] . "\n";
    echo "URL: " . $r2Config['url'] . "\n\n";
    
    // Test de connexion R2
    echo "🔗 Test de connexion R2...\n";
    
    try {
        $disk = Storage::disk('r2');
        
        // Test d'upload simple
        $testContent = "Test R2 Media " . date('Y-m-d H:i:s');
        $testPath = 'test/media-test.txt';
        
        $result = $disk->put($testPath, $testContent);
        
        if ($result) {
            echo "✅ Upload test réussi!\n";
            
            // Test de lecture
            $content = $disk->get($testPath);
            echo "✅ Lecture test réussie: " . $content . "\n";
            
            // Test d'URL
            $url = $disk->url($testPath);
            echo "✅ URL générée: " . $url . "\n";
            
            // Nettoyer le test
            $disk->delete($testPath);
            echo "✅ Fichier de test supprimé\n\n";
            
            // Configuration réussie
            echo "🎉 Configuration R2 réussie !\n";
            echo "📝 Pour activer R2, modifiez votre .env:\n";
            echo "FILESYSTEM_DISK=r2\n\n";
            
            // Migrer les médias existants
            echo "🔄 Migration des médias existants...\n";
            $media = StoreMedia::all();
            echo "📦 Trouvé " . $media->count() . " fichiers média à migrer\n\n";
            
            $migrated = 0;
            $errors = 0;
            
            foreach ($media as $item) {
                echo "🔄 Migration: {$item->name} (ID: {$item->id})\n";
                
                // Migrer le fichier principal
                if ($item->url && !str_starts_with($item->url, 'http')) {
                    $oldPath = 'public/' . $item->url;
                    $newPath = $item->url;
                    
                    if (Storage::disk('public')->exists($oldPath)) {
                        $content = Storage::disk('public')->get($oldPath);
                        $result = Storage::disk('r2')->put($newPath, $content);
                        
                        if ($result) {
                            $item->url = Storage::disk('r2')->url($newPath);
                            echo "  ✅ Fichier principal migré\n";
                        } else {
                            echo "  ❌ Erreur migration fichier principal\n";
                            $errors++;
                            continue;
                        }
                    } else {
                        echo "  ⚠️ Fichier principal non trouvé: {$oldPath}\n";
                    }
                }
                
                // Migrer le thumbnail
                if ($item->thumbnail && !str_starts_with($item->thumbnail, 'http')) {
                    $oldThumbPath = 'public/' . $item->thumbnail;
                    $newThumbPath = $item->thumbnail;
                    
                    if (Storage::disk('public')->exists($oldThumbPath)) {
                        $content = Storage::disk('public')->get($oldThumbPath);
                        $result = Storage::disk('r2')->put($newThumbPath, $content);
                        
                        if ($result) {
                            $item->thumbnail = Storage::disk('r2')->url($newThumbPath);
                            echo "  ✅ Thumbnail migré\n";
                        } else {
                            echo "  ❌ Erreur migration thumbnail\n";
                        }
                    } else {
                        echo "  ⚠️ Thumbnail non trouvé: {$oldThumbPath}\n";
                    }
                }
                
                $item->save();
                $migrated++;
                echo "\n";
            }
            
            echo "🎉 Migration terminée !\n";
            echo "✅ Fichiers migrés: {$migrated}\n";
            echo "❌ Erreurs: {$errors}\n";
            
        } else {
            echo "❌ Échec de l'upload test\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Erreur de connexion R2: " . $e->getMessage() . "\n";
        echo "💡 Vérifiez vos clés API et la configuration\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    exit(1);
}
