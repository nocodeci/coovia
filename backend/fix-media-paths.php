<?php

require_once 'vendor/autoload.php';

use App\Models\Media;

echo "🔄 Correction des chemins des médias...\n\n";

// Initialiser Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Récupérer tous les médias
    $media = Media::all();
    echo "📦 Trouvé " . $media->count() . " fichiers média à corriger\n\n";

    $updated = 0;

    foreach ($media as $item) {
        echo "🔄 Correction: {$item->name} (ID: {$item->id})\n";
        
        $updatedUrl = false;
        $updatedThumbnail = false;
        
        // Corriger l'URL principale
        if ($item->url && !str_starts_with($item->url, 'public/')) {
            $oldUrl = $item->url;
            $newUrl = 'public/' . $item->url;
            $item->url = $newUrl;
            $updatedUrl = true;
            echo "  ✅ URL corrigée: {$oldUrl} → {$newUrl}\n";
        }
        
        // Corriger le thumbnail
        if ($item->thumbnail && !str_starts_with($item->thumbnail, 'public/')) {
            $oldThumbnail = $item->thumbnail;
            $newThumbnail = 'public/' . $item->thumbnail;
            $item->thumbnail = $newThumbnail;
            $updatedThumbnail = true;
            echo "  ✅ Thumbnail corrigé: {$oldThumbnail} → {$newThumbnail}\n";
        }
        
        if ($updatedUrl || $updatedThumbnail) {
            $item->save();
            $updated++;
        } else {
            echo "  ⚠️ Aucune correction nécessaire\n";
        }
        
        echo "\n";
    }

    echo "🎉 Correction terminée !\n";
    echo "✅ Fichiers corrigés: {$updated}\n";

} catch (Exception $e) {
    echo "❌ Erreur lors de la correction: " . $e->getMessage() . "\n";
    exit(1);
}
