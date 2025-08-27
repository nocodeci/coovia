<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Product;

class AddProductsToMaBoutiqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Trouver la boutique ma-boutique
        $store = Store::where('slug', 'ma-boutique')->first();

        if (!$store) {
            $this->command->error('Boutique ma-boutique non trouvée');
            return;
        }

        // Produits pour ma-boutique
        $products = [
            [
                'name' => 'Ordinateur Portable Pro',
                'description' => 'Ordinateur portable haute performance pour professionnels',
                'price' => 1299.99,
                'compare_price' => 1499.99,
                'stock_quantity' => 10,
                'category' => 'Informatique',
                'tags' => json_encode(['ordinateur', 'portable', 'professionnel']),
                'images' => json_encode(['https://picsum.photos/400/300?random=10']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 3]),
            ],
            [
                'name' => 'Montre Connectée',
                'description' => 'Montre intelligente avec suivi d\'activité',
                'price' => 299.99,
                'compare_price' => 349.99,
                'stock_quantity' => 25,
                'category' => 'Technologie',
                'tags' => json_encode(['montre', 'connectée', 'fitness']),
                'images' => json_encode(['https://picsum.photos/400/300?random=11']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 5]),
            ],
            [
                'name' => 'Sac à Dos Premium',
                'description' => 'Sac à dos durable et élégant pour tous les jours',
                'price' => 89.99,
                'compare_price' => 119.99,
                'stock_quantity' => 30,
                'category' => 'Accessoires',
                'tags' => json_encode(['sac', 'dos', 'premium']),
                'images' => json_encode(['https://picsum.photos/400/300?random=12']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 8]),
            ],
        ];

        foreach ($products as $productData) {
            Product::firstOrCreate(
                [
                    'name' => $productData['name'],
                    'store_id' => $store->id,
                ],
                array_merge($productData, [
                    'store_id' => $store->id,
                    'status' => 'active',
                    'sku' => 'SKU-' . strtoupper(substr($productData['name'], 0, 3)) . '-' . rand(1000, 9999),
                    'min_stock_level' => 5,
                    'files' => json_encode([]),
                    'attributes' => json_encode([]),
                    'seo' => json_encode([
                        'title' => $productData['name'],
                        'description' => $productData['description']
                    ]),
                ])
            );
        }

        $this->command->info('Produits ajoutés à ma-boutique avec succès !');
        $this->command->info('Store: ' . $store->name);
        $this->command->info('Produits ajoutés: ' . count($products));
    }
} 