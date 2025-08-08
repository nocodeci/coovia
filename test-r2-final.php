<?php

require_once 'backend/vendor/autoload.php';

use Aws\S3\S3Client;

// Configuration R2
$config = [
    'version' => 'latest',
    'region' => 'auto',
    'endpoint' => 'https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com',
    'credentials' => [
        'key' => 'd8bd4ac4100f9d1af000d8b59c0d5810',
        'secret' => '67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c',
    ],
    'use_path_style_endpoint' => false,
];

try {
    echo "🔧 Test de connexion R2...\n";
    
    $s3Client = new S3Client($config);
    
    // Test d'upload
    $testContent = "Test R2 " . date('Y-m-d H:i:s');
    $key = 'test/connection-test-' . time() . '.txt';
    
    echo "📤 Upload vers coovia-files/$key...\n";
    
    $result = $s3Client->putObject([
        'Bucket' => 'coovia-files',
        'Key' => $key,
        'Body' => $testContent,
        'ContentType' => 'text/plain',
    ]);
    
    echo "✅ Upload réussi!\n";
    echo "URL: " . $result['ObjectURL'] . "\n";
    
    // Attendre un peu avant de lire
    sleep(2);
    
    // Test de lecture
    echo "📖 Test de lecture...\n";
    $result = $s3Client->getObject([
        'Bucket' => 'coovia-files',
        'Key' => $key,
    ]);
    
    echo "✅ Lecture réussie!\n";
    echo "Contenu: " . $result['Body']->getContents() . "\n";
    
    // Test de suppression
    echo "🗑️ Test de suppression...\n";
    $s3Client->deleteObject([
        'Bucket' => 'coovia-files',
        'Key' => $key,
    ]);
    
    echo "✅ Suppression réussie!\n";
    echo "🎉 Tous les tests R2 sont passés!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "🔍 Code d'erreur: " . $e->getCode() . "\n";
}
