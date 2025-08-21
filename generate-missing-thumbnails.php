<?php

require_once 'vendor/autoload.php';

use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

echo "🔄 Génération des thumbnails manquants...\n\n";

// Initialiser Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Récupérer tous les médias de type image
    $media = Media::where('type', 'image')->get();
    echo "📦 Trouvé " . $media->count() . " images à traiter\n\n";

    $generated = 0;
    $errors = 0;

    foreach ($media as $item) {
        echo "🔄 Traitement: {$item->name} (ID: {$item->id})\n";
        
        // Vérifier si le thumbnail existe déjà
        if ($item->thumbnail && Storage::disk('r2')->exists($item->thumbnail)) {
            echo "  ✅ Thumbnail existe déjà: {$item->thumbnail}\n";
            continue;
        }
        
        // Vérifier si l'image principale existe
        if (!Storage::disk('r2')->exists($item->url)) {
            echo "  ❌ Image principale non trouvée: {$item->url}\n";
            $errors++;
            continue;
        }
        
        try {
            // Récupérer le contenu de l'image
            $imageContent = Storage::disk('r2')->get($item->url);
            
            // Créer un fichier temporaire
            $tempFile = tempnam(sys_get_temp_dir(), 'thumb_');
            file_put_contents($tempFile, $imageContent);
            
            // Générer le thumbnail avec Intervention Image
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($tempFile);
            $image->cover(300, 300);
            
            // Générer le nom du thumbnail
            $thumbnailName = 'thumb_' . time() . '_' . Str::random(10) . '.jpg';
            $thumbnailPath = 'public/media/' . $item->store_id . '/thumbnails/' . $thumbnailName;
            
            // Encoder et sauvegarder le thumbnail
            $encoded = $image->toJpeg(80);
            Storage::disk('r2')->put($thumbnailPath, $encoded);
            
            // Mettre à jour le modèle
            $item->thumbnail = $thumbnailPath;
            $item->save();
            
            echo "  ✅ Thumbnail généré: {$thumbnailPath}\n";
            $generated++;
            
            // Nettoyer le fichier temporaire
            unlink($tempFile);
            
        } catch (Exception $e) {
            echo "  ❌ Erreur lors de la génération: " . $e->getMessage() . "\n";
            $errors++;
        }
        
        echo "\n";
    }

    echo "🎉 Génération terminée !\n";
    echo "✅ Thumbnails générés: {$generated}\n";
    echo "❌ Erreurs: {$errors}\n";

} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    exit(1);
}
