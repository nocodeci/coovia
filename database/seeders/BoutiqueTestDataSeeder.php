<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;

class BoutiqueTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur de test
        $user = User::firstOrCreate(
            ['email' => 'test@coovia.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Créer une boutique de test
        $store = Store::firstOrCreate(
            ['slug' => 'store-123'],
            [
                'name' => 'Boutique Test Coovia',
                'description' => 'Une boutique de test pour démontrer les fonctionnalités',
                'owner_id' => $user->id,
                'status' => 'active',
                'category' => 'Général',
                'address' => json_encode([
                    'street' => '123 Rue de la Paix',
                    'city' => 'Paris',
                    'postal_code' => '75001',
                    'country' => 'France'
                ]),
                'contact' => json_encode([
                    'email' => 'contact@test-coovia.com',
                    'phone' => '+33 1 23 45 67 89'
                ]),
                'settings' => json_encode([
                    'currency' => 'EUR',
                    'language' => 'fr'
                ]),
            ]
        );

        // Créer des catégories
        $categories = [
            'Électronique' => Category::firstOrCreate(['name' => 'Électronique'], [
                'description' => 'Produits électroniques',
                'slug' => \Str::slug('Électronique')
            ]),
            'Vêtements' => Category::firstOrCreate(['name' => 'Vêtements'], [
                'description' => 'Vêtements et accessoires',
                'slug' => \Str::slug('Vêtements')
            ]),
            'Livres' => Category::firstOrCreate(['name' => 'Livres'], [
                'description' => 'Livres et publications',
                'slug' => \Str::slug('Livres')
            ]),
        ];

        // Créer des produits de test
        $products = [
            [
                'name' => 'Smartphone Galaxy S23',
                'description' => 'Smartphone Samsung Galaxy S23 avec 128GB de stockage',
                'price' => 899.99,
                'compare_price' => 999.99,
                'stock_quantity' => 15,
                'category' => 'Électronique',
                'tags' => json_encode(['smartphone', 'samsung', '5G']),
                'images' => json_encode(['https://picsum.photos/400/300?random=1']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 5]),
            ],
            [
                'name' => 'T-shirt Premium',
                'description' => 'T-shirt en coton bio de haute qualité',
                'price' => 29.99,
                'compare_price' => 39.99,
                'stock_quantity' => 50,
                'category' => 'Vêtements',
                'tags' => json_encode(['t-shirt', 'coton', 'bio']),
                'images' => json_encode(['https://picsum.photos/400/300?random=2']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 10]),
            ],
            [
                'name' => 'Livre "Le Guide du Développeur"',
                'description' => 'Guide complet pour les développeurs web modernes',
                'price' => 49.99,
                'compare_price' => null,
                'stock_quantity' => 25,
                'category' => 'Livres',
                'tags' => json_encode(['livre', 'développement', 'web']),
                'images' => json_encode(['https://picsum.photos/400/300?random=3']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 3]),
            ],
            [
                'name' => 'Écouteurs Sans Fil',
                'description' => 'Écouteurs bluetooth avec réduction de bruit',
                'price' => 199.99,
                'compare_price' => 249.99,
                'stock_quantity' => 30,
                'category' => 'Électronique',
                'tags' => json_encode(['écouteurs', 'bluetooth', 'audio']),
                'images' => json_encode(['https://picsum.photos/400/300?random=4']),
                'inventory' => json_encode(['tracking' => 'enabled', 'low_stock_threshold' => 5]),
            ],
            [
                'name' => 'Jeans Classique',
                'description' => 'Jeans confortable en denim stretch',
                'price' => 79.99,
                'compare_price' => 89.99,
                'stock_quantity' => 40,
                'category' => 'Vêtements',
                'tags' => json_encode(['jeans', 'denim', 'stretch']),
                'images' => json_encode(['https://picsum.photos/400/300?random=5']),
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

        $this->command->info('Données de test pour la boutique créées avec succès !');
        $this->command->info('Store ID: ' . $store->id);
        $this->command->info('Store Slug: ' . $store->slug);
    }
} 