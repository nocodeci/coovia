<?php

require_once 'backend/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Store;

// Charger l'application Laravel
$app = require_once 'backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Test de création de produit...\n";

try {
    // Récupérer une boutique existante
    $store = Store::first();
    if (!$store) {
        echo "❌ Aucune boutique trouvée\n";
        exit(1);
    }
    
    echo "✅ Boutique trouvée: {$store->name}\n";
    
    // Données de test complètes
    $productData = [
        'store_id' => $store->id,
        'name' => 'Produit Test ' . time(),
        'description' => 'Description du produit test',
        'price' => 99.99,
        'sku' => 'TEST-' . time(),
        'stock_quantity' => 10,
        'min_stock_level' => 5,
        'category' => 'Test', // Colonne requise
        'status' => 'active',
        'images' => json_encode([]), // Maintenant nullable
        'files' => json_encode([]),
        'inventory' => json_encode(['quantity' => 10]), // Maintenant nullable
        'attributes' => json_encode([]),
        'seo' => json_encode([]),
        'tags' => json_encode([]),
    ];
    
    echo "📝 Tentative de création du produit...\n";
    
    // Créer le produit
    $product = Product::create($productData);
    
    echo "✅ Produit créé avec succès!\n";
    echo "   - ID: {$product->id}\n";
    echo "   - Nom: {$product->name}\n";
    echo "   - Slug: {$product->slug}\n";
    echo "   - Prix: {$product->price}\n";
    echo "   - Stock: {$product->stock_quantity}\n";
    echo "   - Catégorie: {$product->category}\n";
    
    // Vérifier que le slug a été généré
    if ($product->slug) {
        echo "✅ Slug généré automatiquement: {$product->slug}\n";
    } else {
        echo "❌ Slug non généré\n";
    }
    
    // Nettoyer le produit de test
    $product->delete();
    echo "🧹 Produit de test supprimé\n";
    
    echo "🎉 Test réussi!\n";
    
} catch (Exception $e) {
    echo "❌ Erreur lors du test: " . $e->getMessage() . "\n";
    echo "📍 Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}
