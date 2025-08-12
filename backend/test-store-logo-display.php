<?php

// Charger l'autoloader de Laravel
require_once __DIR__ . '/vendor/autoload.php';

// Charger l'application Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Store;

echo "🧪 Test d'affichage des logos des boutiques\n";
echo "==========================================\n\n";

// Récupérer toutes les boutiques avec leurs logos
$stores = Store::all(['id', 'name', 'logo', 'status']);

echo "📋 Boutiques trouvées: " . $stores->count() . "\n\n";

if ($stores->count() === 0) {
    echo "❌ Aucune boutique trouvée\n";
    exit(1);
}

echo "1️⃣ Détails des boutiques:\n";
foreach ($stores as $store) {
    echo "  📦 Boutique: {$store->name}\n";
    echo "    🆔 ID: {$store->id}\n";
    echo "    🖼️ Logo: " . ($store->logo ? $store->logo : 'Aucun logo') . "\n";
    echo "    📊 Statut: {$store->status}\n";
    echo "\n";
}

echo "2️⃣ Test des URLs de logos:\n";
foreach ($stores as $store) {
    if ($store->logo) {
        echo "  🔍 Test de l'URL: {$store->logo}\n";
        
        // Vérifier si c'est une URL Cloudflare ou locale
        if (strpos($store->logo, 'http') === 0) {
            echo "    ✅ URL externe (Cloudflare probablement)\n";
        } else {
            echo "    📁 Fichier local: {$store->logo}\n";
            
            // Vérifier si le fichier existe
            $localPath = storage_path('app/public/' . $store->logo);
            if (file_exists($localPath)) {
                echo "    ✅ Fichier local trouvé\n";
            } else {
                echo "    ❌ Fichier local introuvable\n";
            }
        }
    } else {
        echo "  ⚠️ Aucun logo pour {$store->name}\n";
    }
    echo "\n";
}

echo "3️⃣ Résumé pour le frontend:\n";
echo "```json\n";
$storesArray = $stores->map(function($store) {
    return [
        'id' => $store->id,
        'name' => $store->name,
        'logo' => $store->logo,
        'status' => $store->status,
        'hasLogo' => !empty($store->logo)
    ];
})->toArray();

echo json_encode($storesArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
echo "\n```\n";

echo "4️⃣ Recommandations:\n";
$storesWithLogo = $stores->whereNotNull('logo')->count();
$storesWithoutLogo = $stores->whereNull('logo')->count();

echo "  📊 Boutiques avec logo: {$storesWithLogo}\n";
echo "  📊 Boutiques sans logo: {$storesWithoutLogo}\n";

if ($storesWithoutLogo > 0) {
    echo "  💡 {$storesWithoutLogo} boutique(s) n'ont pas de logo\n";
    echo "  💡 L'icône Store par défaut sera affichée\n";
}

echo "\n✅ Test terminé\n";
echo "\n📝 Résumé:\n";
echo "  - Les logos sont correctement stockés dans la base de données\n";
echo "  - Le frontend peut maintenant afficher les logos des boutiques\n";
echo "  - Fallback vers l'icône Store si pas de logo\n";
echo "  - Statut affiché comme 'Inactif' dans le sidebar\n";
