<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRequest;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    /**
     * Liste toutes les boutiques de l'utilisateur connecté
     */
    public function index()
    {
        try {
            $stores = Store::where('owner_id', Auth::id())
                ->get();

            return StoreResource::collection($stores);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des boutiques', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la récupération des boutiques'
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

            $data = $request->validated();
            $data['owner_id'] = Auth::id();
            $data['slug'] = Str::slug($data['name']);

            // Vérifier l'unicité du slug
            $originalSlug = $data['slug'];
            $counter = 1;
            while (Store::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Structurer les données JSON pour PostgreSQL
            $data['contact'] = [
                'email' => $data['contact']['email'] ?? '',
                'phone' => $data['contact']['phone'] ?? '',
                'website' => $data['contact']['website'] ?? ''
            ];

            $data['address'] = [
                'street' => $data['address']['street'] ?? '',
                'city' => $data['address']['city'] ?? '',
                'state' => $data['address']['state'] ?? '',
                'country' => $data['address']['country'] ?? 'Côte d\'Ivoire',
                'postal_code' => $data['address']['postal_code'] ?? ''
            ];

            $data['settings'] = [
                'currency' => $data['settings']['currency'] ?? 'XOF',
                'language' => $data['settings']['language'] ?? 'fr',
                'timezone' => $data['settings']['timezone'] ?? 'Africa/Abidjan',
                'tax_rate' => 18
            ];

            $data['status'] = 'active';
            $data['is_active'] = true;

            $store = Store::create($data);

            Log::info('Boutique créée avec succès', ['store_id' => $store->id]);

            return new StoreResource($store);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la boutique', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la création de la boutique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher les détails d'une boutique
     */
    public function show($id)
    {
        try {
            $store = Store::where('id', $id)
                ->where('owner_id', Auth::id())
                ->firstOrFail();

            return new StoreResource($store);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Boutique non trouvée'
            ], 404);
        }
    }

    /**
     * Mettre à jour une boutique
     */
    public function update(StoreRequest $request, $id)
    {
        try {
            $store = Store::where('id', $id)
                ->where('owner_id', Auth::id())
                ->firstOrFail();

            $data = $request->validated();

            // Mettre à jour le slug si le nom change
            if (isset($data['name']) && $data['name'] !== $store->name) {
                $data['slug'] = Str::slug($data['name']);

                // Vérifier l'unicité du slug
                $originalSlug = $data['slug'];
                $counter = 1;
                while (Store::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                    $data['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $store->update($data);

            return new StoreResource($store);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la boutique'
            ], 500);
        }
    }

    /**
     * Supprimer une boutique
     */
    public function destroy($id)
    {
        try {
            $store = Store::where('id', $id)
                ->where('owner_id', Auth::id())
                ->firstOrFail();

            $store->delete();

            return response()->json([
                'message' => 'Boutique supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la suppression de la boutique'
            ], 500);
        }
    }

    /**
     * Activer/Désactiver une boutique
     */
    public function toggleStatus($id)
    {
        try {
            $store = Store::where('id', $id)
                ->where('owner_id', Auth::id())
                ->firstOrFail();

            $store->update([
                'is_active' => !$store->is_active
            ]);

            return new StoreResource($store);
        } catch (\Exception $e) {
            Log::error('Erreur lors du changement de statut de la boutique', [
                'error' => $e->getMessage(),
                'store_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Erreur lors du changement de statut'
            ], 500);
        }
    }

    /**
     * Dashboard d'une boutique avec statistiques
     */
    public function dashboard($id)
    {
        try {
            $store = Store::where('id', $id)
                ->where('owner_id', Auth::id())
                ->firstOrFail();

            // Statistiques de base (pour l'instant avec des valeurs par défaut)
            $stats = [
                'total_products' => 0,
                'total_orders' => 0,
                'total_customers' => 0,
                'total_revenue' => 0,
                'revenue_growth' => 0
            ];

            return response()->json([
                'store' => new StoreResource($store),
                'stats' => $stats,
                'monthly_revenue' => [],
                'top_products' => [],
                'recent_orders' => []
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du dashboard', [
                'error' => $e->getMessage(),
                'store_id' => $id,
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la récupération du dashboard'
            ], 500);
        }
    }
}
