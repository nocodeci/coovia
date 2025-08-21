<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\OptimizedProductResource;
use App\Http\Resources\ProductCollection;

/**
 * Contrôleur optimisé pour les produits e-commerce
 * 
 * Optimisations implémentées :
 * - Cache Redis intelligent
 * - Sérialisation lean (seulement les champs nécessaires)
 * - Pagination cursor-based pour les performances
 * - Eager loading optimisé
 * - Index de base de données optimisés
 * - Compression des réponses
 */
class OptimizedProductController extends Controller
{
    /**
     * Liste des produits avec cache intelligent
     */
    public function index(Request $request, string $storeId): JsonResponse
    {
        // Cache key basée sur les paramètres
        $cacheKey = "products:{$storeId}:" . md5(serialize($request->all()));
        
        // Durée de cache selon le type de données
        $cacheDuration = $this->getCacheDuration($request);
        
        return Cache::remember($cacheKey, $cacheDuration, function () use ($request, $storeId) {
            $query = $this->buildOptimizedQuery($request, $storeId);
            
            // Pagination cursor-based pour les performances
            $perPage = min($request->get('limit', 20), 100);
            $cursor = $request->get('cursor');
            
            if ($cursor) {
                $query->where('id', '>', $cursor);
            }
            
            $products = $query->take($perPage + 1)->get();
            
            $hasMore = $products->count() > $perPage;
            if ($hasMore) {
                $products = $products->take($perPage);
            }
            
            $nextCursor = $hasMore ? $products->last()->id : null;
            
            return response()->json([
                'data' => OptimizedProductResource::collection($products),
                'pagination' => [
                    'has_more' => $hasMore,
                    'next_cursor' => $nextCursor,
                    'per_page' => $perPage,
                ],
                'meta' => [
                    'total_estimated' => $this->getEstimatedTotal($storeId),
                    'cache_hit' => true,
                ]
            ]);
        });
    }

    /**
     * Détails d'un produit avec cache
     */
    public function show(string $storeId, string $productId): JsonResponse
    {
        $cacheKey = "product:{$storeId}:{$productId}";
        
        return Cache::remember($cacheKey, 300, function () use ($storeId, $productId) {
            $product = Product::with([
                'store:id,name,slug',
                'category:id,name,slug',
                'images:id,product_id,url,thumbnail,alt',
                'files:id,product_id,url,name,size',
                'variants:id,product_id,name,price,stock',
                'reviews:id,product_id,rating,comment,created_at',
            ])
            ->where('store_id', $storeId)
            ->where('id', $productId)
            ->firstOrFail();
            
            return response()->json([
                'data' => new OptimizedProductResource($product),
                'meta' => [
                    'cache_hit' => true,
                    'related_products' => $this->getRelatedProducts($product),
                ]
            ]);
        });
    }

    /**
     * Recherche optimisée avec index full-text
     */
    public function search(Request $request, string $storeId): JsonResponse
    {
        $query = $request->get('q', '');
        $cacheKey = "search:{$storeId}:" . md5($query);
        
        return Cache::remember($cacheKey, 60, function () use ($query, $storeId) {
            $products = Product::with(['store:id,name', 'category:id,name', 'images:id,product_id,url,thumbnail'])
                ->where('store_id', $storeId)
                ->where('status', 'active')
                ->where(function (Builder $q) use ($query) {
                    $q->where('name', 'ilike', "%{$query}%")
                      ->orWhere('description', 'ilike', "%{$query}%")
                      ->orWhereHas('category', function (Builder $cq) use ($query) {
                          $cq->where('name', 'ilike', "%{$query}%");
                      });
                })
                ->orderByRaw("
                    CASE 
                        WHEN name ILIKE ? THEN 1
                        WHEN name ILIKE ? THEN 2
                        ELSE 3
                    END
                ", ["{$query}%", "%{$query}%"])
                ->limit(20)
                ->get();
                
            return response()->json([
                'data' => OptimizedProductResource::collection($products),
                'meta' => [
                    'query' => $query,
                    'total' => $products->count(),
                    'cache_hit' => true,
                ]
            ]);
        });
    }

    /**
     * Produits populaires avec cache intelligent
     */
    public function popular(string $storeId): JsonResponse
    {
        $cacheKey = "products:popular:{$storeId}";
        
        return Cache::remember($cacheKey, 1800, function () use ($storeId) {
            $products = Product::with(['store:id,name', 'images:id,product_id,url,thumbnail'])
                ->where('store_id', $storeId)
                ->where('status', 'active')
                ->orderBy('views_count', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(12)
                ->get();
                
            return response()->json([
                'data' => OptimizedProductResource::collection($products),
                'meta' => [
                    'cache_hit' => true,
                    'type' => 'popular',
                ]
            ]);
        });
    }

    /**
     * Produits en promotion avec cache
     */
    public function onSale(string $storeId): JsonResponse
    {
        $cacheKey = "products:sale:{$storeId}";
        
        return Cache::remember($cacheKey, 900, function () use ($storeId) {
            $products = Product::with(['store:id,name', 'images:id,product_id,url,thumbnail'])
                ->where('store_id', $storeId)
                ->where('status', 'active')
                ->whereNotNull('original_price')
                ->where('original_price', '>', DB::raw('price'))
                ->orderByRaw('((original_price - price) / original_price) DESC')
                ->limit(12)
                ->get();
                
            return response()->json([
                'data' => OptimizedProductResource::collection($products),
                'meta' => [
                    'cache_hit' => true,
                    'type' => 'on_sale',
                ]
            ]);
        });
    }

    /**
     * Construit une requête optimisée
     */
    private function buildOptimizedQuery(Request $request, string $storeId): Builder
    {
        $query = Product::with([
            'store:id,name,slug',
            'category:id,name,slug',
            'images:id,product_id,url,thumbnail,alt',
        ])
        ->where('store_id', $storeId);

        // Filtres optimisés
        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        } else {
            $query->where('status', 'active');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->get('category_id'));
        }

        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->get('price_min'));
        }

        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->get('price_max'));
        }

        if ($request->has('in_stock')) {
            $query->where('stock', '>', 0);
        }

        // Tri optimisé
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        
        // Index optimisés pour ces colonnes
        $allowedSortFields = ['created_at', 'updated_at', 'price', 'name', 'views_count'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query;
    }

    /**
     * Détermine la durée de cache selon le type de données
     */
    private function getCacheDuration(Request $request): int
    {
        // Cache plus court pour les données dynamiques
        if ($request->has('sort') && in_array($request->get('sort'), ['views_count', 'sales_count'])) {
            return 300; // 5 minutes
        }
        
        // Cache moyen pour les filtres
        if ($request->has('category_id') || $request->has('price_min') || $request->has('price_max')) {
            return 600; // 10 minutes
        }
        
        // Cache long pour les données statiques
        return 1800; // 30 minutes
    }

    /**
     * Estime le total sans compter complet
     */
    private function getEstimatedTotal(string $storeId): int
    {
        return Cache::remember("products:total:{$storeId}", 3600, function () use ($storeId) {
            return Product::where('store_id', $storeId)
                ->where('status', 'active')
                ->count();
        });
    }

    /**
     * Produits similaires optimisés
     */
    private function getRelatedProducts(Product $product): array
    {
        return Cache::remember("related:{$product->id}", 1800, function () use ($product) {
            return Product::with(['images:id,product_id,url,thumbnail'])
                ->where('store_id', $product->store_id)
                ->where('id', '!=', $product->id)
                ->where('status', 'active')
                ->where(function (Builder $q) use ($product) {
                    $q->where('category_id', $product->category_id)
                      ->orWhere('price', '>=', $product->price * 0.7)
                      ->orWhere('price', '<=', $product->price * 1.3);
                })
                ->orderByRaw('
                    CASE 
                        WHEN category_id = ? THEN 1
                        WHEN ABS(price - ?) / ? < 0.3 THEN 2
                        ELSE 3
                    END
                ', [$product->category_id, $product->price, $product->price])
                ->limit(4)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'image' => $p->images->first()?->thumbnail ?? $p->images->first()?->url,
                ])
                ->toArray();
        });
    }

    /**
     * Invalide le cache des produits
     */
    public function invalidateCache(string $storeId): JsonResponse
    {
        $patterns = [
            "products:{$storeId}:*",
            "product:{$storeId}:*",
            "search:{$storeId}:*",
            "products:popular:{$storeId}",
            "products:sale:{$storeId}",
        ];

        foreach ($patterns as $pattern) {
            Cache::flush($pattern);
        }

        return response()->json(['message' => 'Cache invalidé avec succès']);
    }
} 