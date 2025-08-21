<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Storage;

echo "🚀 Migration complète vers Cloudflare R2\n\n";

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
    echo "URL: " . $r2Config['url'] . "\n\n";
    
    // Test de connexion R2
    echo "🔗 Test de connexion R2...\n";
    
    try {
        $disk = Storage::disk('r2');
        $localDisk = Storage::disk('public');
        
        // Test d'upload simple
        $testContent = "Test R2 Migration " . date('Y-m-d H:i:s');
        $testPath = 'test/migration-test.txt';
        
        $result = $disk->put($testPath, $testContent);
        
        if ($result) {
            echo "✅ Connexion R2 réussie!\n";
            $disk->delete($testPath);
            
            // Trouver tous les fichiers média
            echo "\n🔄 Recherche des fichiers à migrer...\n";
            
            $allFiles = [];
            
            // Chercher dans media/
            $mediaFiles = $localDisk->allFiles('media');
            $allFiles = array_merge($allFiles, $mediaFiles);
            
            // Chercher dans store-logos/
            $logoFiles = $localDisk->allFiles('store-logos');
            $allFiles = array_merge($allFiles, $logoFiles);
            
            echo "📦 Trouvé " . count($allFiles) . " fichiers à migrer\n\n";
            
            if (empty($allFiles)) {
                echo "ℹ️ Aucun fichier trouvé à migrer\n";
                exit(0);
            }
            
            // Migration des fichiers
            $migrated = 0;
            $errors = 0;
            $skipped = 0;
            
            foreach ($allFiles as $file) {
                echo "🔄 Migration: {$file}\n";
                
                try {
                    // Vérifier si le fichier existe déjà dans R2
                    if ($disk->exists($file)) {
                        echo "  ⏭️ Déjà présent dans R2, ignoré\n";
                        $skipped++;
                        continue;
                    }
                    
                    // Lire le fichier local
                    $content = $localDisk->get($file);
                    
                    if ($content === false) {
                        echo "  ❌ Impossible de lire le fichier local\n";
                        $errors++;
                        continue;
                    }
                    
                    // Upload vers R2
                    $result = $disk->put($file, $content);
                    
                    if ($result) {
                        $r2Url = $disk->url($file);
                        echo "  ✅ Migré vers: " . $r2Url . "\n";
                        $migrated++;
                    } else {
                        echo "  ❌ Échec de l'upload\n";
                        $errors++;
                    }
                    
                } catch (Exception $e) {
                    echo "  ❌ Erreur: " . $e->getMessage() . "\n";
                    $errors++;
                }
            }
            
            echo "\n📊 Résumé de la migration:\n";
            echo "✅ Fichiers migrés: {$migrated}\n";
            echo "⏭️ Fichiers ignorés (déjà présents): {$skipped}\n";
            echo "❌ Erreurs: {$errors}\n";
            
            if ($migrated > 0) {
                echo "\n🎉 Migration réussie !\n";
                echo "📝 Pour activer R2, modifiez votre .env:\n";
                echo "FILESYSTEM_DISK=r2\n\n";
                
                // Test d'accès aux fichiers migrés
                echo "🧪 Test d'accès aux fichiers migrés...\n";
                $testFiles = array_slice($allFiles, 0, 3); // Tester les 3 premiers
                
                foreach ($testFiles as $testFile) {
                    if ($disk->exists($testFile)) {
                        $url = $disk->url($testFile);
                        echo "  ✅ {$testFile} → {$url}\n";
                    } else {
                        echo "  ❌ {$testFile} non trouvé dans R2\n";
                    }
                }
            }
            
        } else {
            echo "❌ Échec du test de connexion R2\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Erreur de connexion R2: " . $e->getMessage() . "\n";
        echo "💡 Vérifiez vos clés API et la configuration\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    exit(1);
}
