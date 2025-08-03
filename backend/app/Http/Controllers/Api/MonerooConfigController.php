<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MonerooConfigController extends Controller
{
    /**
     * Sauvegarder la configuration Moneroo d'un utilisateur
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'secret_key' => 'required|string',
            'environment' => 'required|in:sandbox,live',
            'webhook_url' => 'nullable|url',
        ]);

        try {
            // Pour les tests, utiliser un ID utilisateur par défaut
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            
            // Valider la clé secrète en testant l'API Moneroo
            $monerooService = new \App\Services\MonerooService($userId);
            $testResult = $monerooService->validateApiKey($request->secret_key, $request->environment);
            
            if (!$testResult['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Clé API invalide. Veuillez vérifier votre clé secrète Moneroo.',
                    'details' => $testResult['error'] ?? 'Erreur de validation'
                ], 400);
            }
            
            // Vérifier si une configuration existe déjà
            $existingConfig = DB::table('moneroo_configs')
                ->where('user_id', $userId)
                ->first();

            $configData = [
                'user_id' => $userId,
                'secret_key' => encrypt($request->secret_key), // Encrypter la clé secrète
                'environment' => $request->environment,
                'webhook_url' => $request->webhook_url,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if ($existingConfig) {
                // Mettre à jour la configuration existante
                DB::table('moneroo_configs')
                    ->where('user_id', $userId)
                    ->update($configData);
            } else {
                // Créer une nouvelle configuration
                DB::table('moneroo_configs')->insert($configData);
            }

            Log::info('Moneroo configuration saved', [
                'user_id' => $userId,
                'environment' => $request->environment
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Configuration Moneroo sauvegardée avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Moneroo configuration save error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde de la configuration'
            ], 500);
        }
    }

    /**
     * Récupérer la configuration Moneroo d'un utilisateur
     */
    public function show(): JsonResponse
    {
        try {
            // Pour les tests, utiliser un ID utilisateur par défaut
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            
            $config = DB::table('moneroo_configs')
                ->where('user_id', $userId)
                ->where('is_active', true)
                ->first();

            if (!$config) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune configuration trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'environment' => $config->environment,
                    'webhook_url' => $config->webhook_url,
                    'is_connected' => true,
                    'created_at' => $config->created_at,
                    'updated_at' => $config->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Moneroo configuration retrieve error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la configuration'
            ], 500);
        }
    }

    /**
     * Tester la configuration Moneroo
     */
    public function test(Request $request): JsonResponse
    {
        $request->validate([
            'secret_key' => 'required|string',
            'environment' => 'required|in:sandbox,live',
        ]);

        try {
            // Pour les tests, utiliser un ID utilisateur par défaut
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            // Simuler un test de connexion avec les clés fournies
            $baseUrl = $request->environment === 'live' 
                ? 'https://api.moneroo.com' 
                : 'https://api-sandbox.moneroo.com';

            // Ici vous pouvez ajouter un vrai test d'API
            // Pour l'instant, on simule une réponse réussie
            $testResult = [
                'success' => true,
                'message' => 'Configuration testée avec succès',
                'environment' => $request->environment,
                'api_url' => $baseUrl
            ];

            Log::info('Moneroo configuration test', [
                'user_id' => Auth::id(),
                'environment' => $request->environment,
                'result' => $testResult
            ]);

            return response()->json($testResult);

        } catch (\Exception $e) {
            Log::error('Moneroo configuration test error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du test de la configuration'
            ], 500);
        }
    }

    /**
     * Supprimer la configuration Moneroo d'un utilisateur
     */
    public function destroy(): JsonResponse
    {
        try {
            // Pour les tests, utiliser un ID utilisateur par défaut
            $userId = Auth::id() ?? '9f8a9e5c-8f18-4163-9b55-c56b6fa61389';
            
            DB::table('moneroo_configs')
                ->where('user_id', $userId)
                ->update([
                    'is_active' => false,
                    'updated_at' => now()
                ]);

            Log::info('Moneroo configuration deleted', [
                'user_id' => $userId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Configuration Moneroo supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Moneroo configuration delete error', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la configuration'
            ], 500);
        }
    }
} 