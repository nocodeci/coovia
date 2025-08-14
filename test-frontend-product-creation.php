<?php

require_once 'backend/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Store;

// Charger l'application Laravel
$app = require_once 'backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de création de produit (simulation frontend)...\n";

try {
    // Récupérer une boutique existante
    $store = Store::first();
    if (!$store) {
        echo "❌ Aucune boutique trouvée\n";
        exit(1);
    }
    
    echo "✅ Boutique trouvée: {$store->name}\n";
    
    // Données simulées du frontend (comme dans index.tsx)
    $productData = [
        'store_id' => $store->id,
        'name' => 'Cisco Router Test ' . time(),
        'description' => '<p>Description du produit Cisco avec HTML</p>',
        'price' => 3555.00,
        'sale_price' => 200.00,
        'sku' => 'cisco-test-' . time(),
        'category' => 'Graphiques',
        'stock_quantity' => 296,
        'min_stock_level' => 0,
        'status' => 'active',
        // Données JSON comme envoyées par le frontend
        'images' => ['image1.jpg', 'image2.jpg'], // Array
        'files' => ['file1.pdf', 'file2.pdf'], // Array
        'inventory' => [ // Object
            'quantity' => 296,
            'min_level' => 0,
            'track_inventory' => true,
            'low_stock_threshold' => 0,
        ],
        'attributes' => [ // Object
            'type' => 'hardware',
            'featured' => true,
        ],
        'seo' => [ // Object
            'meta_title' => 'Cisco Router Test',
            'meta_description' => 'Description du produit Cisco avec HTML',
        ],
        'tags' => ['cisco', 'router', 'hardware'], // Array
    ];
    
    echo "📝 Tentative de création du produit avec données frontend...\n";
    
    // Créer le produit
    $product = Product::create($productData);
    
    echo "✅ Produit créé avec succès!\n";
    echo "   - ID: {$product->id}\n";
    echo "   - Nom: {$product->name}\n";
    echo "   - Slug: {$product->slug}\n";
    echo "   - Prix: {$product->price}\n";
    echo "   - Prix promo: {$product->sale_price}\n";
    echo "   - Stock: {$product->stock_quantity}\n";
    echo "   - Catégorie: {$product->category}\n";
    echo "   - Images: " . json_encode($product->images) . "\n";
    echo "   - Files: " . json_encode($product->files) . "\n";
    echo "   - Inventory: " . json_encode($product->inventory) . "\n";
    echo "   - Attributes: " . json_encode($product->attributes) . "\n";
    echo "   - SEO: " . json_encode($product->seo) . "\n";
    echo "   - Tags: " . json_encode($product->tags) . "\n";
    
    // Vérifier que le slug a été généré
    if ($product->slug) {
        echo "✅ Slug généré automatiquement: {$product->slug}\n";
    } else {
        echo "❌ Slug non généré\n";
    }
    
    // Nettoyer le produit de test
    $product->delete();
    echo "🧹 Produit de test supprimé\n";
    
    echo "🎉 Test frontend réussi!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur lors du test: " . $e->getMessage() . "\n";
    echo "📍 Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}
