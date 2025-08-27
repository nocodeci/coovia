<?php

require_once 'vendor/autoload.php';

use App\Models\Media;
use App\Services\CloudflareUploadService;
use Illuminate\Http\UploadedFile;

// Charger la configuration Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test Upload Média ===\n\n";

// Créer un fichier de test
$testContent = "Test image content";
$testFilePath = storage_path('app/test-image.jpg');
file_put_contents($testFilePath, $testContent);

// Créer un UploadedFile
$uploadedFile = new UploadedFile(
    $testFilePath,
    'test-image.jpg',
    'image/jpeg',
    null,
    true
);

echo "📁 Fichier de test créé: {$testFilePath}\n";

// Upload vers Cloudflare R2
try {
    $cloudflareService = new CloudflareUploadService();
    $storeId = '9f9e713f-6c6f-49fc-9c32-bd4e7216bcf7'; // Store ID de test
    
    echo "📤 Upload vers Cloudflare R2...\n";
    $result = $cloudflareService->uploadFile($uploadedFile, 'media/' . $storeId);
    
    if ($result['success']) {
        echo "✅ Upload réussi\n";
        echo "- Chemin: {$result['path']}\n";
        echo "- URL: {$result['urls']['original']}\n";
        
        // Créer l'enregistrement en base de données
        $media = Media::create([
            'store_id' => $storeId, // Utiliser le vrai store_id
            'name' => 'test-image.jpg',
            'type' => 'image',
            'size' => strlen($testContent),
            'url' => $result['urls']['original'],
            'thumbnail' => $result['urls']['thumbnails']['medium']['url'] ?? null,
            'mime_type' => 'image/jpeg',
            'metadata' => [
                'original_name' => 'test-image.jpg',
                'extension' => 'jpg',
                'cloudflare_path' => $result['path'],
                'cloudflare_urls' => $result['urls'],
                'original_store_id' => $storeId,
            ],
        ]);
        
        echo "✅ Enregistrement créé en base de données\n";
        echo "- ID: {$media->id}\n";
        echo "- URL Proxy: {$media->proxy_url}\n";
        echo "- Thumbnail Proxy: {$media->proxy_thumbnail_url}\n";
        
        // Tester le proxy
        echo "\n🔗 Test du proxy:\n";
        $proxyUrl = $media->proxy_url;
        echo "URL: {$proxyUrl}\n";
        
        // Tester avec l'URL locale
        $localProxyUrl = "http://localhost:8000/api/media-proxy/{$storeId}/{$media->id}";
        echo "URL locale: {$localProxyUrl}\n";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $localProxyUrl);
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
        
    } else {
        echo "❌ Échec de l'upload: {$result['error']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}

// Nettoyer
unlink($testFilePath);
echo "\n🧹 Fichier de test supprimé\n";

echo "\n=== Fin du test ===\n";
