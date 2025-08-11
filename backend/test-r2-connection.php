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

echo "🔧 Configuration R2:\n";
echo "Access Key ID: " . substr($accessKeyId, 0, 10) . "...\n";
echo "Secret Access Key: " . substr($secretAccessKey, 0, 10) . "...\n";
echo "Bucket: $bucket\n";
echo "Endpoint: $endpoint\n\n";

if (empty($accessKeyId) || empty($secretAccessKey) || empty($bucket) || empty($endpoint)) {
    echo "❌ Variables d'environnement manquantes\n";
    exit(1);
}

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

    // Test de connexion - Lister les objets
    echo "🔄 Test de connexion...\n";
    $result = $s3Client->listObjects([
        'Bucket' => $bucket,
        'MaxKeys' => 5
    ]);

    echo "✅ Connexion réussie !\n";
    echo "📦 Objets trouvés: " . count($result['Contents'] ?? []) . "\n";

    // Test d'upload d'un fichier de test
    echo "🔄 Test d'upload...\n";
    $testContent = "Test R2 connection - " . date('Y-m-d H:i:s');
    $testKey = 'test/connection-test-' . time() . '.txt';

    $result = $s3Client->putObject([
        'Bucket' => $bucket,
        'Key' => $testKey,
        'Body' => $testContent,
        'ContentType' => 'text/plain',
    ]);

    echo "✅ Upload réussi !\n";
    echo "📁 Fichier créé: $testKey\n";

    // Test de lecture du fichier
    echo "🔄 Test de lecture...\n";
    $result = $s3Client->getObject([
        'Bucket' => $bucket,
        'Key' => $testKey,
    ]);

    $content = $result['Body']->getContents();
    echo "✅ Lecture réussie !\n";
    echo "📄 Contenu: $content\n";

    // Nettoyer le fichier de test
    echo "🔄 Nettoyage...\n";
    $s3Client->deleteObject([
        'Bucket' => $bucket,
        'Key' => $testKey,
    ]);

    echo "✅ Nettoyage réussi !\n";
    echo "🎉 Tous les tests R2 sont passés avec succès !\n";

} catch (AwsException $e) {
    echo "❌ Erreur AWS: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getAwsErrorCode() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    exit(1);
}
