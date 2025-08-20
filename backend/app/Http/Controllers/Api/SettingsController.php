<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get all public settings
     */
    public function getPublic(): JsonResponse
    {
        try {
            $settings = Settings::getPublic();
            
            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Paramètres publics récupérés avec succès'
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
     * Get settings by group
     */
    public function getByGroup(Request $request): JsonResponse
    {
        try {
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

            $group = $request->input('group');
            $settings = Settings::getByGroup($group);
            
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
     * Get a specific setting
     */
    public function get(Request $request): JsonResponse
    {
        try {
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

            $key = $request->input('key');
            $setting = Settings::get($key);
            
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
     * Set a setting (Admin only)
     */
    public function set(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'key' => 'required|string|max:100',
                'value' => 'required',
                'type' => 'required|string|in:string,integer,boolean,json,array,float',
                'group' => 'required|string|max:50',
                'description' => 'nullable|string|max:255',
                'is_public' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $setting = Settings::set(
                $request->input('key'),
                $request->input('value'),
                $request->input('type'),
                $request->input('group'),
                $request->input('description'),
                $request->input('is_public', false)
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
     * Get all settings groups
     */
    public function getGroups(): JsonResponse
    {
        try {
            $groups = Settings::select('group')
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
     * Clear settings cache
     */
    public function clearCache(): JsonResponse
    {
        try {
            Settings::clearCache();
            
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
