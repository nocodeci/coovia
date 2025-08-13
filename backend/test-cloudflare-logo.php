<?php

// Charger l'autoloader de Laravel
require_once __DIR__ . '/vendor/autoload.php';

// Charger l'application Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Services\CloudflareUploadService;
use Illuminate\Support\Facades\Log;

echo "🧪 Test de configuration Cloudflare R2 pour les logos\n";
echo "====================================================\n\n";

$cloudflareService = new CloudflareUploadService();

// Test 1: Vérifier la configuration
echo "1️⃣ Vérification de la configuration Cloudflare R2:\n";

if ($cloudflareService->isConfigured()) {
    echo "  ✅ Configuration Cloudflare R2 détectée\n";
    
    // Afficher les paramètres de configuration (sans les clés secrètes)
    $config = config('filesystems.disks.r2');
    echo "  📋 Bucket: " . ($config['bucket'] ?? 'Non configuré') . "\n";
    echo "  📋 Endpoint: " . ($config['endpoint'] ?? 'Non configuré') . "\n";
    echo "  📋 Région: " . ($config['region'] ?? 'Non configuré') . "\n";
    echo "  📋 Clé d'accès: " . (isset($config['key']) ? 'Configurée' : 'Non configurée') . "\n";
    echo "  📋 Clé secrète: " . (isset($config['secret']) ? 'Configurée' : 'Non configurée') . "\n";
    
} else {
    echo "  ❌ Configuration Cloudflare R2 manquante\n";
    echo "  📝 Variables d'environnement requises:\n";
    echo "     - CLOUDFLARE_R2_ACCESS_KEY_ID\n";
    echo "     - CLOUDFLARE_R2_SECRET_ACCESS_KEY\n";
    echo "     - CLOUDFLARE_R2_BUCKET\n";
    echo "     - CLOUDFLARE_R2_ENDPOINT\n";
    echo "     - CLOUDFLARE_R2_URL\n";
    echo "\n  💡 Fallback vers stockage local activé\n";
}

echo "\n2️⃣ Test de connexion à Cloudflare R2:\n";

if ($cloudflareService->isConfigured()) {
    if ($cloudflareService->testConnection()) {
        echo "  ✅ Connexion à Cloudflare R2 réussie\n";
    } else {
        echo "  ❌ Échec de connexion à Cloudflare R2\n";
        echo "  💡 Vérifiez vos clés d'accès et l'endpoint\n";
    }
} else {
    echo "  ⚠️ Test de connexion ignoré (configuration manquante)\n";
}

echo "\n3️⃣ Test de validation des fichiers:\n";

// Créer un fichier de test temporaire
$testImagePath = __DIR__ . '/test-logo.png';
$testImageContent = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
file_put_contents($testImagePath, $testImageContent);

echo "  📁 Fichier de test créé: $testImagePath\n";

// Simuler un UploadedFile
$uploadedFile = new \Illuminate\Http\UploadedFile(
    $testImagePath,
    'test-logo.png',
    'image/png',
    null,
    true
);

echo "  📋 Nom: " . $uploadedFile->getClientOriginalName() . "\n";
echo "  📋 Taille: " . $uploadedFile->getSize() . " bytes\n";
echo "  📋 Type MIME: " . $uploadedFile->getMimeType() . "\n";
echo "  📋 Extension: " . $uploadedFile->getClientOriginalExtension() . "\n";

echo "\n4️⃣ Test d'upload vers Cloudflare R2:\n";

if ($cloudflareService->isConfigured()) {
    $logoUrl = $cloudflareService->uploadLogo($uploadedFile, 'test-store');
    
    if ($logoUrl) {
        echo "  ✅ Upload réussi vers Cloudflare R2\n";
        echo "  🌐 URL: $logoUrl\n";
        
        // Test de suppression
        echo "\n5️⃣ Test de suppression du logo:\n";
        $deleted = $cloudflareService->deleteLogo($logoUrl);
        
        if ($deleted) {
            echo "  ✅ Logo supprimé avec succès\n";
        } else {
            echo "  ⚠️ Échec de la suppression du logo\n";
        }
        
    } else {
        echo "  ❌ Échec de l'upload vers Cloudflare R2\n";
        echo "  💡 Vérifiez les permissions et la configuration\n";
    }
} else {
    echo "  ⚠️ Test d'upload ignoré (configuration manquante)\n";
}

// Nettoyer le fichier de test
unlink($testImagePath);

echo "\n6️⃣ Configuration recommandée pour .env:\n";
echo "```env\n";
echo "# Cloudflare R2 Configuration\n";
echo "FILESYSTEM_DISK=r2\n";
echo "CLOUDFLARE_R2_ACCESS_KEY_ID=votre_access_key_id\n";
echo "CLOUDFLARE_R2_SECRET_ACCESS_KEY=votre_secret_access_key\n";
echo "CLOUDFLARE_R2_BUCKET=votre_bucket_name\n";
echo "CLOUDFLARE_R2_ENDPOINT=https://votre_account_id.r2.cloudflarestorage.com\n";
echo "CLOUDFLARE_R2_URL=https://pub-votre_hash.r2.dev\n";
echo "```\n";

echo "\n✅ Test terminé\n";
echo "\n📝 Résumé:\n";
echo "  - Les logos seront uploadés vers Cloudflare R2 si configuré\n";
echo "  - Fallback automatique vers stockage local si Cloudflare non configuré\n";
echo "  - Suppression automatique des anciens logos lors de la mise à jour\n";
echo "  - Nettoyage automatique lors de la suppression de boutique\n";
