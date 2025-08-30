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
                'store_id' => 'string|exists:stores,id', // Ajout du store_id optionnel
                'type' => 'string|in:image,video,document,avatar,product', // Ajout du type optionnel
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
            $storeId = $request->input('store_id'); // Récupérer le store_id
            
            // Détecter automatiquement le type de fichier si non fourni
            $type = $request->input('type');
            if (!$type) {
                $type = $this->detectFileType($file);
                Log::info("🔥 Type détecté automatiquement: {$type} pour le fichier: " . $file->getClientOriginalName());
            }

            $result = $this->cloudflareService->uploadFile($file, $directory);

            if ($result['success']) {
                // Enregistrer dans la base de données si un store_id est fourni
                if ($storeId) {
                    Log::info("🔥 Appel de saveMediaRecord depuis upload() - Store: {$storeId}, Type: {$type}");
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
     * Détecter automatiquement le type de fichier
     */
    protected function detectFileType($file): string
    {
        $mimeType = $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());
        
        // Détection par MIME type
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }
        if (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        }
        
        // Détection par extension (fallback)
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
        $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
        $audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'];
        
        if (in_array($extension, $imageExtensions)) {
            return 'image';
        }
        if (in_array($extension, $videoExtensions)) {
            return 'video';
        }
        if (in_array($extension, $audioExtensions)) {
            return 'audio';
        }
        
        return 'document';
    }

    /**
     * Sauvegarder l'enregistrement média dans la base de données
     */
    protected function saveMediaRecord(array $uploadResult, string $type, string $storeId): void
    {
        try {
            Log::info("🔥 DEBUT saveMediaRecord - Store: {$storeId}, Type: {$type}, Filename: " . ($uploadResult['filename'] ?? 'unknown'));
            Log::info("🔥 uploadResult complet: " . json_encode($uploadResult));
            
            // Vérifier la structure des données
            if (!isset($uploadResult['filename']) || !isset($uploadResult['size']) || !isset($uploadResult['urls']['original'])) {
                Log::error("🔥 Structure de uploadResult invalide - Champs manquants");
                Log::error("🔥 uploadResult keys: " . json_encode(array_keys($uploadResult)));
                return;
            }
            
            // Créer l'enregistrement média
            $mediaFile = \App\Models\StoreMediaFile::create([
                'store_id' => $storeId,
                'file_id' => uniqid('media_'),
                'name' => $uploadResult['filename'],
                'type' => $type,
                'size' => $uploadResult['size'],
                'url' => $uploadResult['urls']['original'],
                'thumbnail_url' => $uploadResult['urls']['thumbnails']['medium']['url'] ?? null,
                'mime_type' => $uploadResult['mime_type'] ?? 'application/octet-stream',
                'cloudflare_path' => $uploadResult['path'],
                'metadata' => json_encode([
                    'original_name' => $uploadResult['filename'],
                    'cloudflare_urls' => $uploadResult['urls'],
                    'upload_type' => $type,
                    'saved_at' => now()->toISOString(),
                ]),
            ]);
            
            Log::info("🔥 SUCCES - Enregistrement média sauvegardé avec ID: {$mediaFile->id} pour le store {$storeId}: {$uploadResult['filename']}");
            
            // Vérifier que l'enregistrement existe bien
            $count = \App\Models\StoreMediaFile::where('store_id', $storeId)->count();
            Log::info("🔥 Nombre total de médias pour ce store après sauvegarde: {$count}");
            
        } catch (\Exception $e) {
            Log::error("🔥 ERREUR saveMediaRecord: " . $e->getMessage());
            Log::error("🔥 Stack trace: " . $e->getTraceAsString());
        }
    }
}
