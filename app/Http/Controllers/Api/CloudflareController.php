<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudflareUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CloudflareController extends Controller
{
    protected $cloudflareService;

    public function __construct(CloudflareUploadService $cloudflareService)
    {
        $this->cloudflareService = $cloudflareService;
    }

    /**
     * Upload un fichier vers Cloudflare R2
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240', // 10MB max
                'directory' => 'string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $directory = $request->input('directory', 'uploads');

            $result = $this->cloudflareService->uploadFile($file, $directory);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Fichier uploadé avec succès',
                    'data' => $result
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'upload',
                    'error' => $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error("Erreur dans CloudflareController::upload: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload multiple de fichiers
     */
    public function uploadMultiple(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'files.*' => 'required|file|max:10240', // 10MB max par fichier
                'directory' => 'string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $files = $request->file('files');
            $directory = $request->input('directory', 'uploads');

            $results = $this->cloudflareService->uploadMultiple($files, $directory);

            $successCount = count(array_filter($results, fn($r) => $r['success']));
            $errorCount = count($results) - $successCount;

            return response()->json([
                'success' => true,
                'message' => "Upload terminé: {$successCount} succès, {$errorCount} erreurs",
                'data' => [
                    'total_files' => count($results),
                    'successful_uploads' => $successCount,
                    'failed_uploads' => $errorCount,
                    'results' => $results
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Erreur dans CloudflareController::uploadMultiple: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload direct depuis le frontend (pour les composants React)
     */
    public function uploadFromFrontend(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240',
                'type' => 'string|in:image,video,document,avatar,product',
                'store_id' => 'required|string|exists:stores,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $type = $request->input('type', 'general');
            $storeId = $request->input('store_id');

            // Déterminer le répertoire selon le type
            $directory = $this->getDirectoryByType($type, $storeId);

            $result = $this->cloudflareService->uploadFile($file, $directory);

            if ($result['success']) {
                // Enregistrer dans la base de données si nécessaire
                if ($storeId) {
                    $this->saveMediaRecord($result, $type, $storeId);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Fichier uploadé avec succès',
                    'data' => $result
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'upload',
                    'error' => $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error("Erreur dans CloudflareController::uploadFromFrontend: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un fichier de Cloudflare R2
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'path' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chemin du fichier requis',
                    'errors' => $validator->errors()
                ], 422);
            }

            $path = $request->input('path');
            $deleted = $this->cloudflareService->deleteFile($path);

            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'message' => 'Fichier supprimé avec succès'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la suppression du fichier'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error("Erreur dans CloudflareController::delete: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les informations d'un fichier
     */
    public function info(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'path' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chemin du fichier requis',
                    'errors' => $validator->errors()
                ], 422);
            }

            $path = $request->input('path');
            $fileInfo = $this->cloudflareService->getFileInfo($path);

            if ($fileInfo['exists']) {
                return response()->json([
                    'success' => true,
                    'data' => $fileInfo
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier non trouvé'
                ], 404);
            }

        } catch (\Exception $e) {
            Log::error("Erreur dans CloudflareController::info: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Déterminer le répertoire selon le type de fichier
     */
    protected function getDirectoryByType(string $type, ?int $storeId = null): string
    {
        $baseDirectory = match($type) {
            'image' => 'images',
            'video' => 'videos',
            'document' => 'documents',
            'avatar' => 'avatars',
            'product' => 'products',
            default => 'uploads'
        };

        if ($storeId) {
            return "stores/{$storeId}/{$baseDirectory}";
        }

        return $baseDirectory;
    }

    /**
     * Sauvegarder l'enregistrement média dans la base de données
     */
    protected function saveMediaRecord(array $uploadResult, string $type, string $storeId): void
    {
        try {
            // Utiliser le modèle StoreMediaFile pour sauvegarder les informations
            \App\Models\StoreMediaFile::create([
                'store_id' => $storeId,
                'file_id' => uniqid(),
                'name' => $uploadResult['filename'],
                'type' => $type,
                'size' => $uploadResult['size'],
                'url' => $uploadResult['urls']['original'],
                'thumbnail_url' => $uploadResult['urls']['thumbnails']['medium']['url'] ?? null,
                'mime_type' => $uploadResult['mime_type'],
                'cloudflare_path' => $uploadResult['path'],
                'metadata' => [
                    'original_name' => $uploadResult['filename'],
                    'cloudflare_urls' => $uploadResult['urls'],
                    'upload_type' => $type,
                ],
            ]);
            
            Log::info("Enregistrement média sauvegardé pour le store {$storeId}: {$uploadResult['filename']}");
        } catch (\Exception $e) {
            Log::error("Erreur lors de la sauvegarde de l'enregistrement média: " . $e->getMessage());
        }
    }
}
