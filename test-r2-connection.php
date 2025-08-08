<?php

require_once 'backend/vendor/autoload.php';

use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

// Configuration R2
$config = [
    'version' => 'latest',
    'region' => 'auto',
    'endpoint' => 'https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com',
    'credentials' => [
        'key' => 'YOUR_ACCESS_KEY_ID',
        'secret' => 'YOUR_SECRET_ACCESS_KEY',
    ],
    'use_path_style_endpoint' => false,
];

try {
    $s3Client = new S3Client($config);
    
    // Test de connexion
    $result = $s3Client->listBuckets();
    echo "✅ Connexion R2 réussie!\n";
    echo "Buckets disponibles:\n";
    foreach ($result['Buckets'] as $bucket) {
        echo "- " . $bucket['Name'] . "\n";
    }
    
    // Test d'upload
    $testContent = "Test R2 " . date('Y-m-d H:i:s');
    $s3Client->putObject([
        'Bucket' => 'coovia-files',
        'Key' => 'test/connection-test.txt',
        'Body' => $testContent,
        'ContentType' => 'text/plain',
    ]);
    echo "✅ Upload test réussi!\n";
    
    // Test de lecture
    $result = $s3Client->getObject([
        'Bucket' => 'coovia-files',
        'Key' => 'test/connection-test.txt',
    ]);
    echo "✅ Lecture test réussie!\n";
    echo "Contenu: " . $result['Body']->getContents() . "\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
