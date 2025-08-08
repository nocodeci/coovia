<?php

require_once 'backend/vendor/autoload.php';

use Aws\S3\S3Client;

// Configuration R2 avec vos vraies clés
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
    echo "🔗 Test de connexion Cloudflare R2...\n";
    
    $s3Client = new S3Client($config);
    
    // Test direct avec le bucket coovia-files
    echo "📦 Test avec le bucket coovia-files...\n";
    
    // Test d'upload
    echo "📤 Test d'upload...\n";
    $testContent = "Test R2 " . date('Y-m-d H:i:s');
    $result = $s3Client->putObject([
        'Bucket' => 'coovia-files',
        'Key' => 'test/connection-test.txt',
        'Body' => $testContent,
        'ContentType' => 'text/plain',
    ]);
    echo "✅ Upload test réussi!\n";
    echo "📄 ETag: " . $result['ETag'] . "\n";
    
    // Test de lecture
    echo "📥 Test de lecture...\n";
    $result = $s3Client->getObject([
        'Bucket' => 'coovia-files',
        'Key' => 'test/connection-test.txt',
    ]);
    echo "✅ Lecture test réussie!\n";
    echo "📄 Contenu: " . $result['Body']->getContents() . "\n";
    
    // Test d'URL publique
    echo "🌐 Test d'URL publique...\n";
    $publicUrl = "https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com/test/connection-test.txt";
    echo "🔗 URL: " . $publicUrl . "\n";
    
    // Test de liste des objets dans le bucket
    echo "📋 Liste des objets...\n";
    $result = $s3Client->listObjects([
        'Bucket' => 'coovia-files',
        'MaxKeys' => 10
    ]);
    
    if (isset($result['Contents'])) {
        echo "📁 Objets trouvés:\n";
        foreach ($result['Contents'] as $object) {
            echo "- " . $object['Key'] . " (" . $object['Size'] . " bytes)\n";
        }
    } else {
        echo "📁 Aucun objet trouvé\n";
    }
    
    echo "🎉 Tous les tests sont passés avec succès!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
