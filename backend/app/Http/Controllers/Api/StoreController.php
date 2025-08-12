<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    /**
     * Récupérer toutes les boutiques de l'utilisateur authentifié
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        try {
            $stores = Store::where('owner_id', $user->id)
                ->where('status', 'active')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Boutiques récupérées avec succès',
                'stores' => $stores->map(function ($store) {
                    return [
                        'id' => $store->id,
                        'name' => $store->name,
                        'description' => $store->description,
                        'address' => $store->address,
                        'phone' => $store->phone,
                        'website' => $store->website,
                        'status' => $store->status,
                        'created_at' => $store->created_at,
                        'updated_at' => $store->updated_at,
                    ];
                })
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des boutiques: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des boutiques'
            ], 500);
        }
    }

    /**
     * Créer une nouvelle boutique pour un utilisateur
     * Cette méthode est appelée après le Just-in-time registration
     */
    public function createStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category' => 'required|string|max:255',
            'address' => 'nullable|array',
            'address.street' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:255',
            'address.country' => 'nullable|string|max:255',
            'contact' => 'nullable|array',
            'contact.email' => 'nullable|email|max:255',
            'contact.phone' => 'nullable|string|max:20',
            'settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Vérifier si l'utilisateur a déjà une boutique
        $existingStore = Store::where('owner_id', $user->id)->first();

        if ($existingStore) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà une boutique'
            ], 400);
        }

        try {
            // Générer un slug unique
            $slug = Str::slug($request->name);
            $originalSlug = $slug;
            $counter = 1;
            
            while (Store::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Créer la boutique
            $store = Store::create([
                'id' => Str::uuid(),
                'owner_id' => $user->id,
                'name' => $request->name,
                'slug' => $slug,
                'description' => $request->description,
                'category' => $request->category,
                'address' => $request->address ? json_encode($request->address) : json_encode([]),
                'contact' => $request->contact ? json_encode($request->contact) : json_encode([]),
                'settings' => $request->settings ? json_encode($request->settings) : json_encode([]),
                'status' => 'active',
            ]);

            // Mettre à jour le rôle de l'utilisateur en "store_owner"
            $user->update([
                'role' => 'store_owner',
                'updated_at' => now(),
            ]);

            Log::info("Boutique créée pour l'utilisateur: {$user->email} - Boutique: {$store->name}");

            return response()->json([
                'success' => true,
                'message' => 'Boutique créée avec succès',
                'data' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'slug' => $store->slug,
                    'description' => $store->description,
                    'category' => $store->category,
                    'address' => json_decode($store->address, true),
                    'contact' => json_decode($store->contact, true),
                    'settings' => json_decode($store->settings, true),
                    'status' => $store->status,
                    'owner_id' => $store->owner_id,
                    'created_at' => $store->created_at,
                    'updated_at' => $store->updated_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la création de la boutique: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la boutique'
            ], 500);
        }
    }

    /**
     * Obtenir les informations de la boutique de l'utilisateur connecté
     */
    public function getMyStore(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $store = Store::where('owner_id', $user->id)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune boutique trouvée',
                'has_store' => false
            ], 404);
        }

        return response()->json([
            'success' => true,
            'has_store' => true,
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'description' => $store->description,
                'address' => $store->address,
                'phone' => $store->phone,
                'website' => $store->website,
                'status' => $store->status,
                'created_at' => $store->created_at,
                'updated_at' => $store->updated_at,
            ]
        ]);
    }

    /**
     * Mettre à jour les informations de la boutique
     */
    public function updateStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        $store = Store::where('owner_id', $user->id)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune boutique trouvée'
            ], 404);
        }

        try {
            // Mettre à jour la boutique
            $store->update($request->only([
                'name', 'description', 'address', 'phone', 'website'
            ]));

            Log::info("Boutique mise à jour pour l'utilisateur: {$user->email}");

            return response()->json([
                'success' => true,
                'message' => 'Boutique mise à jour avec succès',
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'address' => $store->address,
                    'phone' => $store->phone,
                    'website' => $store->website,
                    'status' => $store->status,
                    'created_at' => $store->created_at,
                    'updated_at' => $store->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour de la boutique: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la boutique'
            ], 500);
        }
    }
} 
