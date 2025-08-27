<?php

require_once 'vendor/autoload.php';

use App\Models\Media;
use Illuminate\Support\Facades\Storage;

echo "🔄 Migration des fichiers média vers R2...\n\n";

// Charger les variables d'environnement
$envFile = '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Initialiser Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Récupérer tous les médias
    $media = Media::all();
    echo "📦 Trouvé " . $media->count() . " fichiers média à migrer\n\n";

    $migrated = 0;
    $errors = 0;

    foreach ($media as $item) {
        echo "🔄 Migration: {$item->name} (ID: {$item->id})\n";
        
        // Migrer le fichier principal
        if ($item->url) {
            $oldPath = 'public/' . $item->url;
            $newPath = $item->url;
            
            if (Storage::disk('public')->exists($oldPath)) {
                $content = Storage::disk('public')->get($oldPath);
                Storage::disk('r2')->put($newPath, $content);
                echo "  ✅ Fichier principal migré: {$newPath}\n";
            } else {
                echo "  ⚠️ Fichier principal non trouvé: {$oldPath}\n";
            }
        }

        // Migrer le thumbnail
        if ($item->thumbnail) {
            $oldThumbPath = 'public/' . $item->thumbnail;
            $newThumbPath = $item->thumbnail;
            
            if (Storage::disk('public')->exists($oldThumbPath)) {
                $content = Storage::disk('public')->get($oldThumbPath);
                Storage::disk('r2')->put($newThumbPath, $content);
                echo "  ✅ Thumbnail migré: {$newThumbPath}\n";
            } else {
                echo "  ⚠️ Thumbnail non trouvé: {$oldThumbPath}\n";
            }
        }

        $migrated++;
        echo "\n";
    }

    echo "🎉 Migration terminée !\n";
    echo "✅ Fichiers migrés: {$migrated}\n";
    echo "❌ Erreurs: {$errors}\n";

} catch (Exception $e) {
    echo "❌ Erreur lors de la migration: " . $e->getMessage() . "\n";
    exit(1);
}
