<?php

namespace App\Http\Controllers\Lunar;

use App\Http\Controllers\Controller;
use App\Models\Lunar\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CollectionController extends Controller
{
    /**
     * Afficher la liste des collections
     */
    public function index(Request $request): JsonResponse
    {
        $query = Collection::with(['products']);

        // Filtrage par statut
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            }
        }

        // Recherche
        if ($request->has('search')) {
            $query->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('description', 'ilike', "%{$request->search}%");
        }

        // Tri
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $collections = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $collections,
        ]);
    }

    /**
     * Afficher une collection spécifique
     */
    public function show(string $id): JsonResponse
    {
        $collection = Collection::with(['products'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $collection,
        ]);
    }

    /**
     * Afficher une collection par slug
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $collection = Collection::with(['products'])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $collection,
        ]);
    }

    /**
     * Créer une nouvelle collection
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:lunar_collections,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'meta' => 'nullable|array',
        ]);

        // Générer le slug automatiquement si non fourni
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $collection = Collection::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Collection créée avec succès',
            'data' => $collection,
        ], 201);
    }

    /**
     * Mettre à jour une collection
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $collection = Collection::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => [
                'sometimes',
                'string',
                Rule::unique('lunar_collections', 'slug')->ignore($id),
            ],
            'description' => 'sometimes|nullable|string',
            'is_active' => 'sometimes|boolean',
            'meta' => 'sometimes|nullable|array',
        ]);

        $collection->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Collection mise à jour avec succès',
            'data' => $collection,
        ]);
    }

    /**
     * Supprimer une collection
     */
    public function destroy(string $id): JsonResponse
    {
        $collection = Collection::findOrFail($id);
        $collection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Collection supprimée avec succès',
        ]);
    }

    /**
     * Obtenir les produits d'une collection
     */
    public function products(string $id, Request $request): JsonResponse
    {
        $collection = Collection::findOrFail($id);
        
        $query = $collection->products()->with(['store', 'variants']);

        // Filtrage par statut
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            }
        }

        // Filtrage par stock
        if ($request->has('stock')) {
            if ($request->stock === 'in_stock') {
                $query->inStock();
            }
        }

        // Tri
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}
