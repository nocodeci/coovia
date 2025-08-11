<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Store;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\ProductAttribute;
use App\Models\User;

class LunarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌙 Démarrage du seeding Lunar...');

        // Créer des stores
        $this->createStores();

        // Créer des catégories
        $this->createCategories();

        // Créer des marques
        $this->createBrands();

        // Créer des vendeurs
        $this->createVendors();

        // Créer des produits
        $this->createProducts();

        $this->command->info('✅ Seeding Lunar terminé avec succès !');
    }

    /**
     * Créer des stores
     */
    private function createStores(): void
    {
        $this->command->info('🏪 Création des stores...');

        $stores = [
            [
                'name' => 'TechStore Pro',
                'slug' => 'techstore-pro',
                'description' => 'Votre boutique spécialisée en technologie et gadgets',
                'email' => 'contact@techstore-pro.com',
                'phone' => '+33 1 23 45 67 89',
                'address' => '123 Rue de la Tech, 75001 Paris',
                'city' => 'Paris',
                'postal_code' => '75001',
                'country' => 'France',
                'is_active' => true,
            ],
            [
                'name' => 'Fashion Boutique',
                'slug' => 'fashion-boutique',
                'description' => 'Mode tendance et accessoires de luxe',
                'email' => 'hello@fashion-boutique.com',
                'phone' => '+33 1 98 76 54 32',
                'address' => '456 Avenue de la Mode, 75002 Paris',
                'city' => 'Paris',
                'postal_code' => '75002',
                'country' => 'France',
                'is_active' => true,
            ],
            [
                'name' => 'Home & Garden',
                'slug' => 'home-garden',
                'description' => 'Décoration et aménagement de la maison',
                'email' => 'info@home-garden.com',
                'phone' => '+33 1 45 67 89 12',
                'address' => '789 Boulevard du Jardin, 75003 Paris',
                'city' => 'Paris',
                'postal_code' => '75003',
                'country' => 'France',
                'is_active' => true,
            ],
        ];

        foreach ($stores as $storeData) {
            Store::create($storeData);
        }

        $this->command->info('✅ ' . count($stores) . ' stores créés');
    }

    /**
     * Créer des catégories
     */
    private function createCategories(): void
    {
        $this->command->info('📂 Création des catégories...');

        $categories = [
            [
                'name' => 'Électronique',
                'slug' => 'electronique',
                'description' => 'Produits électroniques et gadgets',
                'is_active' => true,
            ],
            [
                'name' => 'Informatique',
                'slug' => 'informatique',
                'description' => 'Ordinateurs, accessoires et logiciels',
                'is_active' => true,
            ],
            [
                'name' => 'Mode',
                'slug' => 'mode',
                'description' => 'Vêtements et accessoires de mode',
                'is_active' => true,
            ],
            [
                'name' => 'Maison & Jardin',
                'slug' => 'maison-jardin',
                'description' => 'Décoration et aménagement',
                'is_active' => true,
            ],
            [
                'name' => 'Sport & Loisirs',
                'slug' => 'sport-loisirs',
                'description' => 'Équipements sportifs et activités',
                'is_active' => true,
            ],
            [
                'name' => 'Beauté & Santé',
                'slug' => 'beaute-sante',
                'description' => 'Produits de beauté et bien-être',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        $this->command->info('✅ ' . count($categories) . ' catégories créées');
    }

    /**
     * Créer des marques
     */
    private function createBrands(): void
    {
        $this->command->info('🏷️ Création des marques...');

        $brands = [
            [
                'name' => 'Apple',
                'slug' => 'apple',
                'description' => 'Innovation et design premium',
                'logo_url' => 'https://example.com/logos/apple.png',
                'is_active' => true,
            ],
            [
                'name' => 'Samsung',
                'slug' => 'samsung',
                'description' => 'Technologie innovante pour tous',
                'logo_url' => 'https://example.com/logos/samsung.png',
                'is_active' => true,
            ],
            [
                'name' => 'Nike',
                'slug' => 'nike',
                'description' => 'Just Do It - Performance sportive',
                'logo_url' => 'https://example.com/logos/nike.png',
                'is_active' => true,
            ],
            [
                'name' => 'Adidas',
                'slug' => 'adidas',
                'description' => 'Impossible is Nothing',
                'logo_url' => 'https://example.com/logos/adidas.png',
                'is_active' => true,
            ],
            [
                'name' => 'IKEA',
                'slug' => 'ikea',
                'description' => 'Design démocratique pour tous',
                'logo_url' => 'https://example.com/logos/ikea.png',
                'is_active' => true,
            ],
            [
                'name' => 'Zara',
                'slug' => 'zara',
                'description' => 'Mode rapide et tendance',
                'logo_url' => 'https://example.com/logos/zara.png',
                'is_active' => true,
            ],
        ];

        foreach ($brands as $brandData) {
            Brand::create($brandData);
        }

        $this->command->info('✅ ' . count($brands) . ' marques créées');
    }

    /**
     * Créer des vendeurs
     */
    private function createVendors(): void
    {
        $this->command->info('👨‍💼 Création des vendeurs...');

        $vendors = [
            [
                'name' => 'Tech Solutions Inc.',
                'slug' => 'tech-solutions-inc',
                'description' => 'Fournisseur de solutions technologiques',
                'email' => 'contact@techsolutions.com',
                'phone' => '+33 1 11 22 33 44',
                'address' => '100 Tech Street, 75001 Paris',
                'city' => 'Paris',
                'postal_code' => '75001',
                'country' => 'France',
                'is_active' => true,
            ],
            [
                'name' => 'Fashion Partners',
                'slug' => 'fashion-partners',
                'description' => 'Partenaires mode et accessoires',
                'email' => 'partnership@fashionpartners.com',
                'phone' => '+33 1 55 66 77 88',
                'address' => '200 Fashion Avenue, 75002 Paris',
                'city' => 'Paris',
                'postal_code' => '75002',
                'country' => 'France',
                'is_active' => true,
            ],
            [
                'name' => 'Home Suppliers',
                'slug' => 'home-suppliers',
                'description' => 'Fournisseur de produits maison',
                'email' => 'info@homesuppliers.com',
                'phone' => '+33 1 99 88 77 66',
                'address' => '300 Home Boulevard, 75003 Paris',
                'city' => 'Paris',
                'postal_code' => '75003',
                'country' => 'France',
                'is_active' => true,
            ],
        ];

        foreach ($vendors as $vendorData) {
            Vendor::create($vendorData);
        }

        $this->command->info('✅ ' . count($vendors) . ' vendeurs créés');
    }

    /**
     * Créer des produits
     */
    private function createProducts(): void
    {
        $this->command->info('📦 Création des produits...');

        $products = [
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Le dernier iPhone avec puce A17 Pro et appareil photo professionnel',
                'short_description' => 'iPhone 15 Pro - Innovation et performance',
                'sku' => 'IPH15PRO-256',
                'price' => 1199.99,
                'compare_price' => 1299.99,
                'cost_price' => 800.00,
                'stock_quantity' => 50,
                'low_stock_threshold' => 10,
                'is_active' => true,
                'is_featured' => true,
                'is_taxable' => true,
                'tax_rate' => 20.0,
                'weight' => 0.187,
                'height' => 0.147,
                'width' => 0.071,
                'length' => 0.147,
                'category_id' => Category::where('slug', 'electronique')->first()->id,
                'brand_id' => Brand::where('slug', 'apple')->first()->id,
                'vendor_id' => Vendor::where('slug', 'tech-solutions-inc')->first()->id,
                'store_id' => Store::where('slug', 'techstore-pro')->first()->id,
            ],
            [
                'name' => 'MacBook Air M2',
                'description' => 'Ordinateur portable ultra-léger avec puce M2 pour une performance exceptionnelle',
                'short_description' => 'MacBook Air M2 - Légèreté et puissance',
                'sku' => 'MBA-M2-512',
                'price' => 1499.99,
                'compare_price' => 1599.99,
                'cost_price' => 1000.00,
                'stock_quantity' => 25,
                'low_stock_threshold' => 5,
                'is_active' => true,
                'is_featured' => true,
                'is_taxable' => true,
                'tax_rate' => 20.0,
                'weight' => 1.24,
                'height' => 0.44,
                'width' => 30.41,
                'length' => 21.5,
                'category_id' => Category::where('slug', 'informatique')->first()->id,
                'brand_id' => Brand::where('slug', 'apple')->first()->id,
                'vendor_id' => Vendor::where('slug', 'tech-solutions-inc')->first()->id,
                'store_id' => Store::where('slug', 'techstore-pro')->first()->id,
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Smartphone Android premium avec IA intégrée et appareil photo avancé',
                'short_description' => 'Galaxy S24 - IA et innovation',
                'sku' => 'SGS24-256',
                'price' => 999.99,
                'compare_price' => 1099.99,
                'cost_price' => 650.00,
                'stock_quantity' => 40,
                'low_stock_threshold' => 8,
                'is_active' => true,
                'is_featured' => false,
                'is_taxable' => true,
                'tax_rate' => 20.0,
                'weight' => 0.168,
                'height' => 0.147,
                'width' => 0.071,
                'length' => 0.147,
                'category_id' => Category::where('slug', 'electronique')->first()->id,
                'brand_id' => Brand::where('slug', 'samsung')->first()->id,
                'vendor_id' => Vendor::where('slug', 'tech-solutions-inc')->first()->id,
                'store_id' => Store::where('slug', 'techstore-pro')->first()->id,
            ],
            [
                'name' => 'Nike Air Max 270',
                'description' => 'Chaussures de sport confortables avec amorti Air Max révolutionnaire',
                'short_description' => 'Air Max 270 - Confort maximal',
                'sku' => 'NIKE-AM270-42',
                'price' => 149.99,
                'compare_price' => 179.99,
                'cost_price' => 80.00,
                'stock_quantity' => 100,
                'low_stock_threshold' => 20,
                'is_active' => true,
                'is_featured' => false,
                'is_taxable' => true,
                'tax_rate' => 20.0,
                'weight' => 0.8,
                'height' => 0.15,
                'width' => 0.25,
                'length' => 0.30,
                'category_id' => Category::where('slug', 'sport-loisirs')->first()->id,
                'brand_id' => Brand::where('slug', 'nike')->first()->id,
                'vendor_id' => Vendor::where('slug', 'fashion-partners')->first()->id,
                'store_id' => Store::where('slug', 'fashion-boutique')->first()->id,
            ],
            [
                'name' => 'Canapé IKEA Ektorp',
                'description' => 'Canapé confortable et élégant pour votre salon',
                'short_description' => 'Canapé Ektorp - Confort et style',
                'sku' => 'IKEA-EK-3P',
                'price' => 599.99,
                'compare_price' => 699.99,
                'cost_price' => 300.00,
                'stock_quantity' => 15,
                'low_stock_threshold' => 3,
                'is_active' => true,
                'is_featured' => false,
                'is_taxable' => true,
                'tax_rate' => 20.0,
                'weight' => 45.0,
                'height' => 0.85,
                'width' => 2.20,
                'length' => 0.85,
                'category_id' => Category::where('slug', 'maison-jardin')->first()->id,
                'brand_id' => Brand::where('slug', 'ikea')->first()->id,
                'vendor_id' => Vendor::where('slug', 'home-suppliers')->first()->id,
                'store_id' => Store::where('slug', 'home-garden')->first()->id,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::create($productData);

            // Créer des images pour le produit
            $this->createProductImages($product);

            // Créer des variantes pour certains produits
            if (in_array($product->name, ['iPhone 15 Pro', 'MacBook Air M2', 'Samsung Galaxy S24'])) {
                $this->createProductVariants($product);
            }

            // Créer des attributs pour le produit
            $this->createProductAttributes($product);
        }

        $this->command->info('✅ ' . count($products) . ' produits créés');
    }

    /**
     * Créer des images pour un produit
     */
    private function createProductImages(Product $product): void
    {
        $imageUrls = [
            'https://example.com/images/' . Str::slug($product->name) . '-1.jpg',
            'https://example.com/images/' . Str::slug($product->name) . '-2.jpg',
            'https://example.com/images/' . Str::slug($product->name) . '-3.jpg',
        ];

        foreach ($imageUrls as $index => $url) {
            ProductImage::create([
                'product_id' => $product->id,
                'url' => $url,
                'thumbnail_url' => str_replace('.jpg', '-thumb.jpg', $url),
                'is_primary' => $index === 0,
                'alt_text' => $product->name . ' - Image ' . ($index + 1),
                'order' => $index + 1,
            ]);
        }
    }

    /**
     * Créer des variantes pour un produit
     */
    private function createProductVariants(Product $product): void
    {
        $variants = [
            [
                'sku' => $product->sku . '-BLACK',
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity / 2,
                'meta' => ['color' => 'Noir', 'size' => 'Standard'],
            ],
            [
                'sku' => $product->sku . '-WHITE',
                'price' => $product->price + 50,
                'stock_quantity' => $product->stock_quantity / 2,
                'meta' => ['color' => 'Blanc', 'size' => 'Standard'],
            ],
        ];

        foreach ($variants as $variantData) {
            ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $variantData['sku'],
                'price' => $variantData['price'],
                'stock_quantity' => $variantData['stock_quantity'],
                'meta' => $variantData['meta'],
            ]);
        }
    }

    /**
     * Créer des attributs pour un produit
     */
    private function createProductAttributes(Product $product): void
    {
        $attributes = [
            'Couleur' => 'Noir',
            'Matériau' => 'Aluminium',
            'Garantie' => '2 ans',
            'Origine' => 'Chine',
        ];

        foreach ($attributes as $name => $value) {
            // Créer l'attribut s'il n'existe pas
            $attribute = ProductAttribute::firstOrCreate([
                'name' => $name,
            ], [
                'description' => 'Attribut ' . $name,
                'type' => 'text',
                'is_required' => false,
                'is_searchable' => true,
                'is_filterable' => true,
            ]);

            // Attacher l'attribut au produit
            $product->attributes()->attach($attribute->id, [
                'value' => $value,
            ]);
        }
    }
}
