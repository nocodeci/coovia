<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request, Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        // Créer une clé de cache unique basée sur les paramètres
        $cacheKey = "store_products_{$store->id}_" . md5(serialize($request->all()));
        
        // Vérifier le cache d'abord
        $cachedProducts = Cache::get($cacheKey);
        if ($cachedProducts && !$request->has('refresh')) {
            return response()->json([
                'success' => true,
                'message' => 'Produits récupérés avec succès (cache)',
                'data' => $cachedProducts
            ]);
        }

        // Requête optimisée avec select() et pagination
        $query = $store->products()
            ->select([
                'id', 'name', 'description', 'price', 'sale_price', 
                'sku', 'category', 'status', 'stock_quantity', 
                'min_stock_level', 'created_at', 'updated_at'
            ])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            });

        // Pagination pour éviter de charger trop de produits
        $perPage = min($request->get('per_page', 20), 100); // Max 100 produits par page
        $products = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $productResources = ProductResource::collection($products);
        
        // Mettre en cache pour 10 minutes
        Cache::put($cacheKey, $productResources, 10 * 60);

        return response()->json([
            'success' => true,
            'message' => 'Produits récupérés avec succès',
            'data' => $productResources,
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }

    public function store(ProductRequest $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $product = $store->products()->create($request->validated());

        // Invalider le cache des produits de cette boutique
        $this->invalidateStoreProductsCache($store->id);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => new ProductResource($product),
        ], 201);
    }

    public function show(Store $store, Product $product): JsonResponse
    {
        $this->authorize('view', $store);

        $cacheKey = "product_{$product->id}";
        $cachedProduct = Cache::get($cacheKey);
        
        if ($cachedProduct && !request()->has('refresh')) {
            return response()->json([
                'success' => true,
                'product' => $cachedProduct
            ]);
        }

        $productResource = new ProductResource($product);
        
        // Mettre en cache pour 15 minutes
        Cache::put($cacheKey, $productResource, 15 * 60);

        return response()->json([
            'success' => true,
            'product' => $productResource
        ]);
    }

    public function update(ProductRequest $request, Store $store, Product $product): JsonResponse
    {
        $this->authorize('update', $store);

        $product->update($request->validated());

        // Invalider les caches
        Cache::forget("product_{$product->id}");
        $this->invalidateStoreProductsCache($store->id);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'product' => new ProductResource($product),
        ]);
    }

    public function destroy(Store $store, Product $product): JsonResponse
    {
        $this->authorize('update', $store);

        $product->delete();

        // Invalider les caches
        Cache::forget("product_{$product->id}");
        $this->invalidateStoreProductsCache($store->id);

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès',
        ]);
    }

    /**
     * Invalider tous les caches de produits d'une boutique
     */
    private function invalidateStoreProductsCache(string $storeId): void
    {
        // Supprimer tous les caches de produits de cette boutique
        // Note: Dans un environnement de production, vous pourriez utiliser
        // Redis avec des patterns pour une invalidation plus efficace
        $keys = Cache::get('store_products_keys_' . $storeId, []);
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        Cache::forget('store_products_keys_' . $storeId);
    }
}
