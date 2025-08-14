<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BoutiqueController extends Controller
{
    /**
     * Récupérer le slug d'une boutique par son ID
     */
    public function getStoreSlug(string $storeId): JsonResponse
    {
        $store = Store::where('id', $storeId)
            ->where('status', 'active')
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Boutique non trouvée'
            ], 404);
        }

        return response()->json([
            'id' => $store->id,
            'slug' => $store->slug,
            'name' => $store->name,
        ]);
    }

    /**
     * Récupérer une boutique par son slug
     */
    public function getStoreBySlug(string $slug): JsonResponse
    {
        $store = Store::where('slug', $slug)
            ->where('status', 'active')
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Boutique non trouvée'
            ], 404);
        }

        return response()->json([
            'id' => $store->id,
            'name' => $store->name,
            'slug' => $store->slug,
            'description' => $store->description,
            'logo' => $store->logo,
            'status' => $store->status,
            'domain' => $store->domain,
            'created_at' => $store->created_at,
            'updated_at' => $store->updated_at,
        ]);
    }

    /**
     * Récupérer les produits d'une boutique
     */
    public function getStoreProducts(string $storeId): JsonResponse
    {
        $store = Store::where('slug', $storeId)
            ->where('status', 'active')
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Boutique non trouvée'
            ], 404);
        }

        $products = Product::where('store_id', $store->id)
            ->whereIn('status', ['active', 'draft']) // Inclure les produits actifs et brouillons
            ->get()
            ->map(function ($product) {
                // Gérer les images
                $images = [];
                if ($product->images) {
                    if (is_string($product->images)) {
                        $images = json_decode($product->images, true) ?: [];
                    } elseif (is_array($product->images)) {
                        $images = $product->images;
                    }
                }

                // Gérer les tags
                $tags = [];
                if ($product->tags) {
                    if (is_string($product->tags)) {
                        $tags = json_decode($product->tags, true) ?: [];
                    } elseif (is_array($product->tags)) {
                        $tags = $product->tags;
                    }
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => (float) $product->price,
                    'original_price' => $product->compare_price ? (float) $product->compare_price : null,
                    'images' => $images,
                    'category' => $product->category,
                    'tags' => $tags,
                    'in_stock' => $product->stock_quantity > 0,
                    'stock' => (int) $product->stock_quantity,
                    'store_id' => $product->store_id,
                    'status' => $product->status, // Ajouter le statut pour information
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            });

        return response()->json($products);
    }

    /**
     * Récupérer un produit spécifique
     */
    public function getProduct(string $storeId, string $productId): JsonResponse
    {
        $store = Store::where('slug', $storeId)
            ->where('status', 'active')
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Boutique non trouvée'
            ], 404);
        }

        $product = Product::where('id', $productId)
            ->where('store_id', $store->id)
            ->whereIn('status', ['active', 'draft'])
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Produit non trouvé'
            ], 404);
        }

        // Gérer les images
        $images = [];
        if ($product->images) {
            if (is_string($product->images)) {
                $images = json_decode($product->images, true) ?: [];
            } elseif (is_array($product->images)) {
                $images = $product->images;
            }
        }

        // Gérer les tags
        $tags = [];
        if ($product->tags) {
            if (is_string($product->tags)) {
                $tags = json_decode($product->tags, true) ?: [];
            } elseif (is_array($product->tags)) {
                $tags = $product->tags;
            }
        }

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => (float) $product->price,
            'original_price' => $product->compare_price ? (float) $product->compare_price : null,
            'images' => $images,
            'category' => $product->category,
            'tags' => $tags,
            'in_stock' => $product->stock_quantity > 0,
            'stock' => (int) $product->stock_quantity,
            'store_id' => $product->store_id,
            'status' => $product->status,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ]);
    }

    /**
     * Récupérer les catégories d'une boutique
     */
    public function getStoreCategories(string $storeId): JsonResponse
    {
        $store = Store::where('slug', $storeId)
            ->where('status', 'active')
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Boutique non trouvée'
            ], 404);
        }

        // Extraire les catégories uniques des produits de cette boutique
        $categories = Product::where('store_id', $store->id)
            ->whereIn('status', ['active', 'draft'])
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values()
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Catégories récupérées avec succès'
        ]);
    }
} 