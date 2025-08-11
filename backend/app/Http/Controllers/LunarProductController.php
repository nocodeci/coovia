<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\Store;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Vendor;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\ProductAttribute;
use App\Models\ProductReview;
use App\Services\CloudflareStorageService;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Http\Requests\ProductRequest;

class LunarProductController extends Controller
{
    protected $cloudflareService;

    public function __construct(CloudflareStorageService $cloudflareService)
    {
        $this->cloudflareService = $cloudflareService;
        $this->middleware('auth:sanctum')->except(['index', 'show', 'search', 'featured', 'byCategory', 'byBrand']);
        $this->middleware('can:manage-products')->only(['store', 'update', 'destroy']);
    }

    /**
     * Afficher la liste des produits avec pagination et filtres
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Product::with([
                'store:id,name,slug',
                'category:id,name,slug',
                'brand:id,name,slug',
                'vendor:id,name,slug',
                'images:id,product_id,url,thumbnail_url,is_primary',
                'variants:id,product_id,sku,price,stock_quantity',
                'attributes:id,name,value',
                'reviews:id,product_id,rating,comment'
            ]);

            // Filtres
            $this->applyFilters($query, $request);

            // Tri
            $this->applySorting($query, $request);

            // Pagination
            $perPage = $request->get('per_page', 20);
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => new ProductCollection($products),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un produit spécifique
     */
    public function show(string $id): JsonResponse
    {
        try {
            $product = Product::with([
                'store:id,name,slug,description',
                'category:id,name,slug,description',
                'brand:id,name,slug,description',
                'vendor:id,name,slug,description',
                'images:id,product_id,url,thumbnail_url,is_primary,alt_text',
                'variants:id,product_id,sku,price,compare_price,stock_quantity,weight,height,width,length',
                'attributes:id,name,value',
                'reviews' => function($query) {
                    $query->with('user:id,name,avatar')
                          ->orderBy('created_at', 'desc');
                }
            ])->findOrFail($id);

            // Incrémenter le compteur de vues
            $product->increment('views_count');

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Créer un nouveau produit
     */
    public function store(ProductRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            
            // Créer le produit
            $product = Product::create([
                'store_id' => $validated['store_id'],
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'sku' => $validated['sku'] ?? null,
                'barcode' => $validated['barcode'] ?? null,
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? null,
                'cost_price' => $validated['cost_price'] ?? null,
                'weight' => $validated['weight'] ?? null,
                'height' => $validated['height'] ?? null,
                'width' => $validated['width'] ?? null,
                'length' => $validated['length'] ?? null,
                'stock_quantity' => $validated['stock_quantity'] ?? 0,
                'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
                'is_active' => $validated['is_active'] ?? true,
                'is_featured' => $validated['is_featured'] ?? false,
                'is_taxable' => $validated['is_taxable'] ?? true,
                'tax_rate' => $validated['tax_rate'] ?? 0,
                'meta_title' => $validated['meta_title'] ?? null,
                'meta_description' => $validated['meta_description'] ?? null,
                'meta_keywords' => $validated['meta_keywords'] ?? null,
                'category_id' => $validated['category_id'] ?? null,
                'brand_id' => $validated['brand_id'] ?? null,
                'vendor_id' => $validated['vendor_id'] ?? null,
                'published_at' => $validated['published_at'] ?? now(),
            ]);

            // Gérer les images
            if ($request->hasFile('images')) {
                $this->handleProductImages($product, $request->file('images'));
            }

            // Gérer les variantes
            if ($request->has('variants')) {
                $this->handleProductVariants($product, $request->input('variants'));
            }

            // Gérer les attributs
            if ($request->has('attributes')) {
                $this->handleProductAttributes($product, $request->input('attributes'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => new ProductResource($product->load(['images', 'variants', 'attributes']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un produit
     */
    public function update(ProductRequest $request, string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $product = Product::findOrFail($id);
            $validated = $request->validated();

            // Vérifier les permissions
            if (!$this->canManageProduct($product, $request->user())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas les permissions pour modifier ce produit'
                ], 403);
            }

            // Mettre à jour le produit
            $product->update([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? $product->description,
                'short_description' => $validated['short_description'] ?? $product->short_description,
                'sku' => $validated['sku'] ?? $product->sku,
                'barcode' => $validated['barcode'] ?? $product->barcode,
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? $product->compare_price,
                'cost_price' => $validated['cost_price'] ?? $product->cost_price,
                'weight' => $validated['weight'] ?? $product->weight,
                'height' => $validated['height'] ?? $product->height,
                'width' => $validated['width'] ?? $product->width,
                'length' => $validated['length'] ?? $product->length,
                'stock_quantity' => $validated['stock_quantity'] ?? $product->stock_quantity,
                'low_stock_threshold' => $validated['low_stock_threshold'] ?? $product->low_stock_threshold,
                'is_active' => $validated['is_active'] ?? $product->is_active,
                'is_featured' => $validated['is_featured'] ?? $product->is_featured,
                'is_taxable' => $validated['is_taxable'] ?? $product->is_taxable,
                'tax_rate' => $validated['tax_rate'] ?? $product->tax_rate,
                'meta_title' => $validated['meta_title'] ?? $product->meta_title,
                'meta_description' => $validated['meta_description'] ?? $product->meta_description,
                'meta_keywords' => $validated['meta_keywords'] ?? $product->meta_keywords,
                'category_id' => $validated['category_id'] ?? $product->category_id,
                'brand_id' => $validated['brand_id'] ?? $product->brand_id,
                'vendor_id' => $validated['vendor_id'] ?? $product->vendor_id,
                'published_at' => $validated['published_at'] ?? $product->published_at,
            ]);

            // Gérer les images
            if ($request->hasFile('images')) {
                $this->handleProductImages($product, $request->file('images'));
            }

            // Gérer les variantes
            if ($request->has('variants')) {
                $this->handleProductVariants($product, $request->input('variants'));
            }

            // Gérer les attributs
            if ($request->has('attributes')) {
                $this->handleProductAttributes($product, $request->input('attributes'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Produit mis à jour avec succès',
                'data' => new ProductResource($product->load(['images', 'variants', 'attributes']))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un produit
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            // Vérifier les permissions
            if (!$this->canManageProduct($product, request()->user())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas les permissions pour supprimer ce produit'
                ], 403);
            }

            // Supprimer les images associées
            foreach ($product->images as $image) {
                $this->cloudflareService->deleteFile($image->url);
                if ($image->thumbnail_url) {
                    $this->cloudflareService->deleteFile($image->thumbnail_url);
                }
            }

            // Supprimer le produit (soft delete)
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rechercher des produits
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q');
            $category = $request->get('category');
            $brand = $request->get('brand');
            $minPrice = $request->get('min_price');
            $maxPrice = $request->get('max_price');
            $inStock = $request->get('in_stock');
            $featured = $request->get('featured');

            $products = Product::with(['images', 'category', 'brand'])
                ->when($query, function ($q) use ($query) {
                    $q->search($query);
                })
                ->when($category, function ($q) use ($category) {
                    $q->byCategory($category);
                })
                ->when($brand, function ($q) use ($brand) {
                    $q->where('brand_id', $brand);
                })
                ->when($minPrice, function ($q) use ($minPrice) {
                    $q->where('price', '>=', $minPrice);
                })
                ->when($maxPrice, function ($q) use ($maxPrice) {
                    $q->where('price', '<=', $maxPrice);
                })
                ->when($inStock, function ($q) {
                    $q->inStock();
                })
                ->when($featured, function ($q) {
                    $q->featured();
                })
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => new ProductCollection($products)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Produits en vedette
     */
    public function featured(): JsonResponse
    {
        try {
            $products = Product::with(['images', 'category', 'brand'])
                ->featured()
                ->active()
                ->inStock()
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits en vedette',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Produits par catégorie
     */
    public function byCategory(string $categorySlug): JsonResponse
    {
        try {
            $category = Category::where('slug', $categorySlug)->firstOrFail();

            $products = Product::with(['images', 'brand', 'vendor'])
                ->byCategory($category->id)
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => new ProductCollection($products),
                'category' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Produits par marque
     */
    public function byBrand(string $brandSlug): JsonResponse
    {
        try {
            $brand = Brand::where('slug', $brandSlug)->firstOrFail();

            $products = Product::with(['images', 'category', 'vendor'])
                ->where('brand_id', $brand->id)
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => new ProductCollection($products),
                'brand' => [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'description' => $brand->description
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Marque non trouvée',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Appliquer les filtres à la requête
     */
    private function applyFilters($query, Request $request): void
    {
        if ($request->has('store_id')) {
            $query->byStore($request->store_id);
        }

        if ($request->has('category_id')) {
            $query->byCategory($request->category_id);
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->has('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('in_stock')) {
            $query->inStock();
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('active')) {
            $query->active();
        }
    }

    /**
     * Appliquer le tri à la requête
     */
    private function applySorting($query, Request $request): void
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortFields = [
            'name', 'price', 'created_at', 'updated_at', 'stock_quantity', 'views_count'
        ];

        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }
    }

    /**
     * Gérer les images du produit
     */
    private function handleProductImages(Product $product, array $images): void
    {
        foreach ($images as $index => $image) {
            $path = $this->cloudflareService->uploadFile($image, 'products');
            $thumbnailPath = $this->cloudflareService->createThumbnail($path, 300, 300);

            $product->images()->create([
                'url' => $path,
                'thumbnail_url' => $thumbnailPath,
                'is_primary' => $index === 0,
                'alt_text' => $product->name,
                'order' => $index + 1
            ]);
        }
    }

    /**
     * Gérer les variantes du produit
     */
    private function handleProductVariants(Product $product, array $variants): void
    {
        foreach ($variants as $variant) {
            $product->variants()->create([
                'sku' => $variant['sku'] ?? null,
                'price' => $variant['price'] ?? $product->price,
                'compare_price' => $variant['compare_price'] ?? null,
                'stock_quantity' => $variant['stock_quantity'] ?? 0,
                'weight' => $variant['weight'] ?? null,
                'height' => $variant['height'] ?? null,
                'width' => $variant['width'] ?? null,
                'length' => $variant['length'] ?? null,
                'meta' => $variant['meta'] ?? null,
            ]);
        }
    }

    /**
     * Gérer les attributs du produit
     */
    private function handleProductAttributes(Product $product, array $attributes): void
    {
        foreach ($attributes as $attribute) {
            $product->attributes()->attach($attribute['id'], [
                'value' => $attribute['value']
            ]);
        }
    }

    /**
     * Vérifier si l'utilisateur peut gérer le produit
     */
    private function canManageProduct(Product $product, $user): bool
    {
        // L'utilisateur peut gérer le produit s'il est admin ou propriétaire du store
        return $user->role === 'admin' || $product->store->user_id === $user->id;
    }
}
