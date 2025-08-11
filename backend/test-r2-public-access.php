<?php

require_once 'vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

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

// Configuration R2
$accessKeyId = $_ENV['CLOUDFLARE_R2_ACCESS_KEY_ID'] ?? '';
$secretAccessKey = $_ENV['CLOUDFLARE_R2_SECRET_ACCESS_KEY'] ?? '';
$bucket = $_ENV['CLOUDFLARE_R2_BUCKET'] ?? '';
$endpoint = $_ENV['CLOUDFLARE_R2_ENDPOINT'] ?? '';
$publicUrl = $_ENV['CLOUDFLARE_R2_URL'] ?? '';

echo "🔧 Configuration R2:\n";
echo "Bucket: $bucket\n";
echo "Public URL: $publicUrl\n\n";

try {
    // Créer le client S3 pour R2
    $s3Client = new S3Client([
        'version' => 'latest',
        'region' => 'auto',
        'endpoint' => $endpoint,
        'credentials' => [
            'key' => $accessKeyId,
            'secret' => $secretAccessKey,
        ],
        'use_path_style_endpoint' => false,
    ]);

    echo "✅ Client S3 créé avec succès\n";

    // Lister tous les objets pour voir ce qui existe
    echo "🔄 Liste des objets dans le bucket...\n";
    $result = $s3Client->listObjects([
        'Bucket' => $bucket,
        'MaxKeys' => 20
    ]);

    $objects = $result['Contents'] ?? [];
    echo "📦 Objets trouvés: " . count($objects) . "\n\n";

    foreach ($objects as $object) {
        $key = $object['Key'];
        $size = $object['Size'];
        $lastModified = $object['LastModified']->format('Y-m-d H:i:s');
        
        echo "📁 $key ($size bytes, modifié: $lastModified)\n";
        
        // Tester l'accès public
        $publicUrl = "https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com/$key";
        echo "🔗 URL publique: $publicUrl\n";
        
        // Tester l'accès HTTP
        $headers = get_headers($publicUrl, 1);
        if ($headers && strpos($headers[0], '200') !== false) {
            echo "✅ Accès public OK\n";
        } else {
            echo "❌ Accès public échoué: " . ($headers[0] ?? 'Pas de réponse') . "\n";
        }
        echo "\n";
    }

    // Tester l'upload d'une image de test avec permissions publiques
    echo "🔄 Test d'upload d'image avec permissions publiques...\n";
    $testImageContent = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='); // 1x1 pixel PNG
    $testKey = 'test/public-test-' . time() . '.png';

    $result = $s3Client->putObject([
        'Bucket' => $bucket,
        'Key' => $testKey,
        'Body' => $testImageContent,
        'ContentType' => 'image/png',
        'ACL' => 'public-read', // Essayer de rendre public
        'CacheControl' => 'public, max-age=31536000',
    ]);

    echo "✅ Upload réussi !\n";
    echo "📁 Fichier créé: $testKey\n";
    
    // Tester l'accès public
    $publicUrl = "https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com/$testKey";
    echo "🔗 URL publique: $publicUrl\n";
    
    $headers = get_headers($publicUrl, 1);
    if ($headers && strpos($headers[0], '200') !== false) {
        echo "✅ Accès public OK\n";
    } else {
        echo "❌ Accès public échoué: " . ($headers[0] ?? 'Pas de réponse') . "\n";
        echo "💡 Le bucket R2 n'est probablement pas configuré pour l'accès public\n";
    }

    // Nettoyer
    $s3Client->deleteObject([
        'Bucket' => $bucket,
        'Key' => $testKey,
    ]);

} catch (AwsException $e) {
    echo "❌ Erreur AWS: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getAwsErrorCode() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    exit(1);
}
