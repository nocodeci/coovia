<?php

namespace App\Http\Controllers\Lunar;

use App\Http\Controllers\Controller;
use App\Models\Lunar\Product;
use App\Models\Lunar\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Afficher la liste des produits
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['store', 'variants', 'collections']);

        // Filtrage par boutique
        if ($request->has('store_id')) {
            $query->byStore($request->store_id);
        }

        // Filtrage par statut
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'featured') {
                $query->featured();
            }
        }

        // Filtrage par stock
        if ($request->has('stock')) {
            if ($request->stock === 'in_stock') {
                $query->inStock();
            }
        }

        // Recherche
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Afficher un produit spécifique
     */
    public function show(string $id): JsonResponse
    {
        $product = Product::with(['store', 'variants', 'collections'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Afficher un produit par slug
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $product = Product::with(['store', 'variants', 'collections'])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Créer un nouveau produit
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'required|uuid|exists:stores,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:lunar_products,slug',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|unique:lunar_products,sku',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'meta' => 'nullable|array',
        ]);

        // Générer le slug automatiquement si non fourni
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès',
            'data' => $product,
        ], 201);
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => [
                'sometimes',
                'string',
                Rule::unique('lunar_products', 'slug')->ignore($id),
            ],
            'description' => 'sometimes|nullable|string',
            'sku' => [
                'sometimes',
                'nullable',
                'string',
                Rule::unique('lunar_products', 'sku')->ignore($id),
            ],
            'price' => 'sometimes|numeric|min:0',
            'compare_price' => 'sometimes|nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
            'meta' => 'sometimes|nullable|array',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès',
            'data' => $product,
        ]);
    }

    /**
     * Supprimer un produit
     */
    public function destroy(string $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès',
        ]);
    }

    /**
     * Ajouter un produit à une collection
     */
    public function addToCollection(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'collection_id' => 'required|uuid|exists:lunar_collections,id',
        ]);

        $product = Product::findOrFail($id);
        $collection = Collection::findOrFail($request->collection_id);

        $product->collections()->attach($request->collection_id);

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté à la collection avec succès',
        ]);
    }

    /**
     * Retirer un produit d'une collection
     */
    public function removeFromCollection(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'collection_id' => 'required|uuid|exists:lunar_collections,id',
        ]);

        $product = Product::findOrFail($id);
        $product->collections()->detach($request->collection_id);

        return response()->json([
            'success' => true,
            'message' => 'Produit retiré de la collection avec succès',
        ]);
    }
}
