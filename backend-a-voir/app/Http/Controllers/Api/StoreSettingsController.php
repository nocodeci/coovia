<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreSettings;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class StoreSettingsController extends Controller
{
    /**
     * Get all settings for a store
     */
    public function index($storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $settings = StoreSettings::getAll($storeId);
            
            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Paramètres de la boutique récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des paramètres',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get settings by group for a store
     */
    public function getByGroup(Request $request, $storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'group' => 'required|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $group = $request->input('group');
            $settings = StoreSettings::getByGroup($storeId, $group);
            
            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => "Paramètres du groupe '{$group}' récupérés avec succès"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des paramètres',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific setting for a store
     */
    public function get(Request $request, $storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'key' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $key = $request->input('key');
            $setting = StoreSettings::get($storeId, $key);
            
            if ($setting === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paramètre non trouvé'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'key' => $key,
                    'value' => $setting
                ],
                'message' => 'Paramètre récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du paramètre',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set a setting for a store
     */
    public function set(Request $request, $storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'key' => 'required|string|max:100',
                'value' => 'required',
                'type' => 'required|string|in:string,integer,boolean,json,array,float',
                'group' => 'required|string|max:50',
                'description' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $setting = StoreSettings::set(
                $storeId,
                $request->input('key'),
                $request->input('value'),
                $request->input('type'),
                $request->input('group'),
                $request->input('description')
            );
            
            return response()->json([
                'success' => true,
                'data' => $setting,
                'message' => 'Paramètre mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du paramètre',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update multiple settings for a store
     */
    public function updateMultiple(Request $request, $storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'settings' => 'required|array',
                'settings.*.key' => 'required|string|max:100',
                'settings.*.value' => 'required',
                'settings.*.type' => 'required|string|in:string,integer,boolean,json,array,float',
                'settings.*.group' => 'required|string|max:50',
                'settings.*.description' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $updatedSettings = [];
            foreach ($request->input('settings') as $settingData) {
                $setting = StoreSettings::set(
                    $storeId,
                    $settingData['key'],
                    $settingData['value'],
                    $settingData['type'],
                    $settingData['group'],
                    $settingData['description'] ?? null
                );
                $updatedSettings[] = $setting;
            }
            
            return response()->json([
                'success' => true,
                'data' => $updatedSettings,
                'message' => 'Paramètres mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour des paramètres',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a setting for a store
     */
    public function delete(Request $request, $storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'key' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $key = $request->input('key');
            $setting = StoreSettings::delete($storeId, $key);
            
            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paramètre non trouvé'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Paramètre supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du paramètre',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Initialize default settings for a store
     */
    public function initializeDefaults($storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            StoreSettings::initializeDefaults($storeId);
            
            return response()->json([
                'success' => true,
                'message' => 'Paramètres par défaut initialisés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initialisation des paramètres',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all settings groups for a store
     */
    public function getGroups($storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            $groups = StoreSettings::where('store_id', $storeId)
                                 ->select('group')
                                 ->distinct()
                                 ->pluck('group')
                                 ->toArray();
            
            return response()->json([
                'success' => true,
                'data' => $groups,
                'message' => 'Groupes de paramètres récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des groupes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear settings cache for a store
     */
    public function clearCache($storeId): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Check if user owns the store
            $store = Store::where('id', $storeId)
                         ->where('owner_id', $user->id)
                         ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Boutique non trouvée ou accès non autorisé'
                ], 404);
            }

            StoreSettings::clearCache($storeId);
            
            return response()->json([
                'success' => true,
                'message' => 'Cache des paramètres vidé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du vidage du cache',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
