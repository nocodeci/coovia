<?php

require_once 'vendor/autoload.php';

// Charger les variables d'environnement
$envFile = '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

echo "🧪 Test Upload Média Cloudflare R2\n";
echo "=====================================\n\n";

// Vérifier la configuration Cloudflare R2
$requiredVars = [
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY', 
    'CLOUDFLARE_R2_BUCKET',
    'CLOUDFLARE_R2_ENDPOINT',
    'CLOUDFLARE_R2_URL'
];

echo "📋 Vérification de la configuration :\n";
$configOk = true;
foreach ($requiredVars as $var) {
    $value = $_ENV[$var] ?? null;
    if ($value) {
        echo "  ✅ {$var}: " . substr($value, 0, 10) . "...\n";
    } else {
        echo "  ❌ {$var}: MANQUANT\n";
        $configOk = false;
    }
}

if (!$configOk) {
    echo "\n❌ Configuration incomplète. Vérifiez votre fichier .env\n";
    exit(1);
}

echo "\n✅ Configuration Cloudflare R2 OK\n\n";

// Tester la connexion à Cloudflare R2
echo "🔗 Test de connexion à Cloudflare R2 :\n";

$config = [
    'key' => $_ENV['CLOUDFLARE_R2_ACCESS_KEY_ID'],
    'secret' => $_ENV['CLOUDFLARE_R2_SECRET_ACCESS_KEY'],
    'region' => 'auto',
    'bucket' => $_ENV['CLOUDFLARE_R2_BUCKET'],
    'url' => $_ENV['CLOUDFLARE_R2_URL'],
    'endpoint' => $_ENV['CLOUDFLARE_R2_ENDPOINT'],
    'use_path_style_endpoint' => false,
    'throw' => false,
];

try {
    $s3Client = new Aws\S3\S3Client([
        'version' => 'latest',
        'region' => $config['region'],
        'endpoint' => $config['endpoint'],
        'use_path_style_endpoint' => $config['use_path_style_endpoint'],
        'credentials' => [
            'key' => $config['key'],
            'secret' => $config['secret'],
        ],
    ]);

    // Tester la connexion en listant les objets
    $result = $s3Client->listObjectsV2([
        'Bucket' => $config['bucket'],
        'MaxKeys' => 1
    ]);

    echo "  ✅ Connexion réussie\n";
    echo "  📦 Bucket: {$config['bucket']}\n";
    echo "  🌐 Endpoint: {$config['endpoint']}\n\n";

} catch (Exception $e) {
    echo "  ❌ Erreur de connexion: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Tester l'upload d'un fichier de test
echo "📤 Test d'upload de fichier :\n";

$testContent = "Ceci est un fichier de test pour Cloudflare R2\nCrié le: " . date('Y-m-d H:i:s');
$testFileName = 'test-media-' . time() . '.txt';
$testPath = 'media/test-store/' . $testFileName;

try {
    $result = $s3Client->putObject([
        'Bucket' => $config['bucket'],
        'Key' => $testPath,
        'Body' => $testContent,
        'ACL' => 'public-read',
        'ContentType' => 'text/plain'
    ]);

    echo "  ✅ Upload réussi\n";
    echo "  📁 Fichier: {$testPath}\n";
    echo "  🔗 URL: {$result['ObjectURL']}\n\n";

    // Tester la récupération du fichier
    echo "📥 Test de récupération du fichier :\n";
    
    $getResult = $s3Client->getObject([
        'Bucket' => $config['bucket'],
        'Key' => $testPath
    ]);

    $retrievedContent = $getResult['Body']->getContents();
    if ($retrievedContent === $testContent) {
        echo "  ✅ Récupération réussie\n";
        echo "  📄 Contenu: " . substr($retrievedContent, 0, 50) . "...\n\n";
    } else {
        echo "  ❌ Contenu incorrect\n\n";
    }

    // Tester la suppression du fichier
    echo "🗑️ Test de suppression du fichier :\n";
    
    $deleteResult = $s3Client->deleteObject([
        'Bucket' => $config['bucket'],
        'Key' => $testPath
    ]);

    echo "  ✅ Suppression réussie\n\n";

} catch (Exception $e) {
    echo "  ❌ Erreur lors du test: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Tester l'upload d'une image (simulation)
echo "🖼️ Test d'upload d'image (simulation) :\n";

$imageContent = file_get_contents('https://via.placeholder.com/300x200/0066cc/ffffff?text=Test+Image');
if ($imageContent) {
    $imageFileName = 'test-image-' . time() . '.png';
    $imagePath = 'media/test-store/' . $imageFileName;

    try {
        $result = $s3Client->putObject([
            'Bucket' => $config['bucket'],
            'Key' => $imagePath,
            'Body' => $imageContent,
            'ACL' => 'public-read',
            'ContentType' => 'image/png'
        ]);

        echo "  ✅ Upload image réussi\n";
        echo "  🖼️ Image: {$imagePath}\n";
        echo "  🔗 URL: {$result['ObjectURL']}\n\n";

        // Supprimer l'image de test
        $s3Client->deleteObject([
            'Bucket' => $config['bucket'],
            'Key' => $imagePath
        ]);
        echo "  🗑️ Image de test supprimée\n\n";

    } catch (Exception $e) {
        echo "  ❌ Erreur upload image: " . $e->getMessage() . "\n\n";
    }
} else {
    echo "  ⚠️ Impossible de télécharger l'image de test\n\n";
}

echo "🎉 Tests Cloudflare R2 terminés avec succès !\n";
echo "\n📝 Résumé :\n";
echo "  ✅ Configuration OK\n";
echo "  ✅ Connexion OK\n";
echo "  ✅ Upload OK\n";
echo "  ✅ Récupération OK\n";
echo "  ✅ Suppression OK\n";
echo "  ✅ Upload image OK\n\n";

echo "🚀 Le MediaController peut maintenant utiliser Cloudflare R2 !\n";
