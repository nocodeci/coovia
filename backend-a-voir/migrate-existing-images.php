<?php

require_once 'vendor/autoload.php';

use App\Models\Media;
use Illuminate\Support\Facades\Storage;

// Charger la configuration Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Migration des Images Existantes ===\n\n";

// Images existantes trouvées dans le HTML
$existingImages = [
    '1755038578_qrJv6aIi1c.JPG',
    '1755038740_ITnKGQAFH2.JPG',
    '1755040858_tiYKAzZxNn.JPG',
    '1755040879_qzu1CiUDmY.JPG',
    '1755040910_Z5IRavAhm0.png',
    '1755041940_Gx1zPCufP8.JPG',
    'couv-457129-2_1755055707_0TasJRn5_medium.jpg',
    'img-1245_1755056821_KKERTE7x_medium.jpg',
    'img-1247_1755054459_3Wpiwsf5_medium.jpg',
    'img-1247_1755060030_NpxfcdSZ_medium.jpg',
    'img-1248_1755056807_FrqLSkQI_medium.jpg',
    'img-1248_1755057523_khgIdSPQ_medium.jpg',
    'img-1256_1755054442_plNnPhWy_medium.JPG',
    'img-1256_1755055292_YLfklOIB_medium.JPG',
    'img-1256_1755056260_CHVtb30B_medium.JPG',
    'img-1256_1755056462_6fJjbNwO_medium.JPG',
    'img-1256_1755059567_KMr4irs0_medium.JPG',
];

$storeId = '9f9e713f-6c6f-49fc-9c32-bd4e7216bcf7';
$basePath = 'media/' . $storeId;

echo "📁 Migration de " . count($existingImages) . " images pour le store: {$storeId}\n\n";

$migratedCount = 0;
$errors = [];

foreach ($existingImages as $filename) {
    try {
        // Vérifier si l'image existe déjà en base de données
        $existingMedia = Media::where('name', $filename)->first();
        if ($existingMedia) {
            echo "⏭️  Image déjà migrée: {$filename}\n";
            continue;
        }

        // Construire le chemin Cloudflare
        $cloudflarePath = $basePath . '/' . $filename;
        $cloudflareUrl = 'https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com/' . $cloudflarePath;

        // Vérifier si le fichier existe dans Cloudflare R2
        $disk = Storage::disk('r2');
        if (!$disk->exists($cloudflarePath)) {
            echo "❌ Fichier non trouvé: {$cloudflarePath}\n";
            $errors[] = "Fichier non trouvé: {$filename}";
            continue;
        }

        // Obtenir les informations du fichier
        $fileSize = $disk->size($cloudflarePath);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $mimeType = getMimeTypeFromExtension($extension);

        // Créer l'enregistrement en base de données
        $media = Media::create([
            'store_id' => $storeId,
            'name' => $filename,
            'type' => getFileType($mimeType),
            'size' => $fileSize,
            'url' => $cloudflareUrl,
            'thumbnail' => null, // Pas de thumbnail pour l'instant
            'mime_type' => $mimeType,
            'metadata' => [
                'original_name' => $filename,
                'extension' => $extension,
                'cloudflare_path' => $cloudflarePath,
                'cloudflare_urls' => [
                    'original' => $cloudflareUrl,
                ],
                'original_store_id' => $storeId,
                'migrated' => true,
                'migrated_at' => now()->toISOString(),
            ],
        ]);

        echo "✅ Migré: {$filename} (ID: {$media->id})\n";
        $migratedCount++;

    } catch (Exception $e) {
        echo "❌ Erreur lors de la migration de {$filename}: " . $e->getMessage() . "\n";
        $errors[] = "Erreur pour {$filename}: " . $e->getMessage();
    }
}

echo "\n=== Résumé de la Migration ===\n";
echo "✅ Images migrées: {$migratedCount}\n";
echo "❌ Erreurs: " . count($errors) . "\n";

if (!empty($errors)) {
    echo "\nErreurs détaillées:\n";
    foreach ($errors as $error) {
        echo "- {$error}\n";
    }
}

echo "\n=== Test des URLs Proxy ===\n";
$recentMedia = Media::where('store_id', $storeId)->latest()->first();
if ($recentMedia) {
    echo "Test URL proxy: {$recentMedia->proxy_url}\n";
    
    // Tester l'accès
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $recentMedia->proxy_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "✅ Proxy fonctionne (HTTP {$httpCode})\n";
    } else {
        echo "❌ Proxy échoue (HTTP {$httpCode})\n";
    }
}

echo "\n=== Fin de la Migration ===\n";

// Fonctions utilitaires
function getMimeTypeFromExtension($extension) {
    $mimeTypes = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'pdf' => 'application/pdf',
        'txt' => 'text/plain',
    ];
    
    return $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
}

function getFileType($mimeType) {
    if (strpos($mimeType, 'image/') === 0) return 'image';
    if (strpos($mimeType, 'video/') === 0) return 'video';
    if (strpos($mimeType, 'audio/') === 0) return 'audio';
    return 'document';
}
