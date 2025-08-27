<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

echo "=== Test Configuration Cloudflare ===\n\n";

// Simuler l'environnement Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "1. Configuration Cloudflare:\n";
$cloudflareConfig = config('cloudflare');
print_r($cloudflareConfig);

echo "\n2. Configuration Filesystems R2:\n";
$r2Config = config('filesystems.disks.r2');
print_r($r2Config);

echo "\n3. Configuration Filesystems Cloudflare:\n";
$cfConfig = config('filesystems.disks.cloudflare');
print_r($cfConfig);

echo "\n4. Variables d'environnement:\n";
echo "CLOUDFLARE_R2_ACCESS_KEY_ID: " . (env('CLOUDFLARE_R2_ACCESS_KEY_ID') ? 'SET' : 'NOT SET') . "\n";
echo "CLOUDFLARE_R2_SECRET_ACCESS_KEY: " . (env('CLOUDFLARE_R2_SECRET_ACCESS_KEY') ? 'SET' : 'NOT SET') . "\n";
echo "CLOUDFLARE_R2_BUCKET: " . (env('CLOUDFLARE_R2_BUCKET') ?: 'NOT SET') . "\n";
echo "CLOUDFLARE_R2_URL: " . (env('CLOUDFLARE_R2_URL') ?: 'NOT SET') . "\n";
echo "CLOUDFLARE_R2_PUBLIC_URL: " . (env('CLOUDFLARE_R2_PUBLIC_URL') ?: 'NOT SET') . "\n";

echo "\n5. Test d'accès au disque R2:\n";
try {
    $disk = Storage::disk('r2');
    echo "Disque R2 accessible: OUI\n";
    
    // Test de listage
    $files = $disk->listContents('/', false);
    echo "Fichiers dans le bucket: " . count($files) . "\n";
    
} catch (Exception $e) {
    echo "Erreur d'accès au disque R2: " . $e->getMessage() . "\n";
}

echo "\n6. Test d'accès au disque Cloudflare:\n";
try {
    $disk = Storage::disk('cloudflare');
    echo "Disque Cloudflare accessible: OUI\n";
    
    // Test de listage
    $files = $disk->listContents('/', false);
    echo "Fichiers dans le bucket: " . count($files) . "\n";
    
} catch (Exception $e) {
    echo "Erreur d'accès au disque Cloudflare: " . $e->getMessage() . "\n";
}

echo "\n=== Fin du test ===\n";
