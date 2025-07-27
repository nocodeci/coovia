<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequest;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    /**
     * Lister toutes les boutiques de l'utilisateur connecté
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $stores = Store::where('owner_id', $user->id)
                ->when($request->search, function ($query, $search) {
                    return $query->where('name', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%");
                })
                ->when($request->status, function ($query, $status) {
                    return $query->where('status', $status);
                })
                ->when($request->category, function ($query, $category) {
                    return $query->where('category', $category);
                })
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'message' => 'Boutiques récupérées avec succès',
                'data' => StoreResource::collection($stores),
                'meta' => [
                    'current_page' => $stores->currentPage(),
                    'last_page' => $stores->lastPage(),
                    'per_page' => $stores->perPage(),
                    'total' => $stores->total(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des boutiques', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des boutiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une nouvelle boutique
     */
    public function store(StoreRequest $request)
    {
        try {
            Log::info('Création d\'une nouvelle boutique', $request->validated());

            $user = $request->user();

            $store = Store::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'category' => $request->category,
                'address' => $request->address ?? [],
                'contact' => $request->contact ?? [],
                'settings' => array_merge([
                    'currency' => 'XOF',
                    'language' => 'fr',
                    'timezone' => 'Africa/Abidjan',
                    'tax_rate' => 18
                ], $request->settings ?? []),
                'status' => 'active',
                'owner_id' => $user->id,
            ]);

            Log::info('Boutique créée avec succès', ['store_id' => $store->id]);

            return response()->json([
                'success' => true,
                'message' => 'Boutique créée avec succès',
                'data' => new StoreResource($store)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la boutique', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la boutique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une boutique spécifique
     */
    public function show(Request $request, Store $store)
    {
        try {
            // Vérifier que l'utilisateur est propriétaire de la boutique
            if ($store->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à cette boutique',
                    'error' => 'unauthorized'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Boutique récupérée avec succès',
                'data' => new StoreResource($store)
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $store->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la boutique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour une boutique
     */
    public function update(StoreRequest $request, Store $store)
    {
        try {
            // Vérifier que l'utilisateur est propriétaire de la boutique
            if ($store->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à cette boutique',
                    'error' => 'unauthorized'
                ], 403);
            }

            $store->update([
                'name' => $request->name ?? $store->name,
                'slug' => $request->name ? Str::slug($request->name) : $store->slug,
                'description' => $request->description ?? $store->description,
                'category' => $request->category ?? $store->category,
                'address' => $request->address ?? $store->address,
                'contact' => $request->contact ?? $store->contact,
                'settings' => array_merge($store->settings ?? [], $request->settings ?? []),
            ]);

            Log::info('Boutique mise à jour avec succès', ['store_id' => $store->id]);

            return response()->json([
                'success' => true,
                'message' => 'Boutique mise à jour avec succès',
                'data' => new StoreResource($store->fresh())
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $store->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la boutique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une boutique
     */
    public function destroy(Request $request, Store $store)
    {
        try {
            // Vérifier que l'utilisateur est propriétaire de la boutique
            if ($store->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à cette boutique',
                    'error' => 'unauthorized'
                ], 403);
            }

            $store->delete();

            Log::info('Boutique supprimée avec succès', ['store_id' => $store->id]);

            return response()->json([
                'success' => true,
                'message' => 'Boutique supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $store->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la boutique',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
