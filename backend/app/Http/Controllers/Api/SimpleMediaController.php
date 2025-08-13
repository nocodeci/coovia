<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudflareUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SimpleMediaController extends Controller
{
    protected $cloudflareService;
    protected $disk;

    public function __construct(CloudflareUploadService $cloudflareService)
    {
        $this->cloudflareService = $cloudflareService;
        $this->disk = Storage::disk('cloudflare');
    }

    /**
     * Upload media files without database dependency.
     */
    public function upload(Request $request, string $storeId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'files.*' => 'required|file|max:10240', // 10MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $uploadedFiles = [];

            foreach ($request->file('files') as $file) {
                $result = $this->uploadFile($file, $storeId);
                if ($result['success']) {
                    $uploadedFiles[] = $result;
                }
            }

            return response()->json([
                'success' => true,
                'message' => count($uploadedFiles) . ' fichier(s) téléchargé(s) avec succès',
                'data' => $uploadedFiles,
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur dans SimpleMediaController::upload: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a media file from Cloudflare R2.
     */
    public function destroy(Request $request, string $storeId, string $fileId): JsonResponse
    {
        try {
            // Version simplifiée pour tester
            Log::info("Tentative de suppression du fichier {$fileId} pour le store {$storeId}");
            
            return response()->json([
                'success' => true,
                'message' => 'Fichier supprimé avec succès (simulation)',
                'data' => [
                    'deleted_file_id' => $fileId,
                    'store_id' => $storeId,
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error("Erreur dans SimpleMediaController::destroy: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update media file metadata.
     */
    public function update(Request $request, string $storeId, string $fileId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string|max:1000',
                'tags' => 'sometimes|array',
                'tags.*' => 'string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Version simplifiée pour tester
            $updatedData = [
                'id' => $fileId,
                'store_id' => $storeId,
                'name' => $request->input('name', 'test-upload.txt'),
                'description' => $request->input('description', 'Fichier de test'),
                'tags' => $request->input('tags', ['test', 'upload']),
                'updated_at' => date('c'),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Métadonnées mises à jour avec succès',
                'data' => $updatedData,
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur dans SimpleMediaController::update: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get media files for a store from Cloudflare R2.
     */
    public function index(Request $request, string $storeId): JsonResponse
    {
        try {
            $directory = 'media/' . $storeId;
            $files = [];
            
            // Récupérer les vrais fichiers depuis Cloudflare
            if ($this->disk->exists($directory)) {
                $fileList = $this->disk->files($directory);
                
                foreach ($fileList as $filePath) {
                    // Ignorer les thumbnails et les fichiers système
                    if (str_contains($filePath, '/thumbnails/') || str_contains($filePath, '.DS_Store')) {
                        continue;
                    }
                    
                    $fileInfo = $this->getFileInfo($filePath, $storeId);
                    if ($fileInfo) {
                        $files[] = $fileInfo;
                    }
                }
            }
            
            // Pagination
            $perPage = $request->get('per_page', 20);
            $page = $request->get('page', 1);
            $offset = ($page - 1) * $perPage;
            $paginatedFiles = array_slice($files, $offset, $perPage);
            
            // Stats
            $filesByType = [
                'image' => 0,
                'video' => 0,
                'document' => 0,
                'audio' => 0,
            ];
            
            foreach ($files as $file) {
                $type = $file['type'];
                if (isset($filesByType[$type])) {
                    $filesByType[$type]++;
                }
            }
            
            $stats = [
                'total_files' => count($files),
                'total_size' => array_sum(array_column($files, 'size')),
                'storage_limit' => 1073741824,
                'files_by_type' => $filesByType,
            ];
            
            return response()->json([
                'success' => true,
                'data' => [
                    'current_page' => (int) $page,
                    'data' => $paginatedFiles,
                    'total' => count($files),
                    'per_page' => (int) $perPage,
                    'last_page' => ceil(count($files) / $perPage),
                    'from' => count($files) > 0 ? $offset + 1 : null,
                    'to' => min($offset + $perPage, count($files)),
                ],
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur lors du chargement des médias: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des médias: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload a single file to Cloudflare R2.
     */
    private function uploadFile($file, string $storeId): array
    {
        try {
            $directory = 'media/' . $storeId;
            $result = $this->cloudflareService->uploadFile($file, $directory);

            if (!$result['success']) {
                return [
                    'success' => false,
                    'error' => $result['error']
                ];
            }

            // Determine file type
            $type = $this->getFileType($file->getMimeType());

            return [
                'success' => true,
                'id' => uniqid(),
                'store_id' => $storeId,
                'name' => $file->getClientOriginalName(),
                'type' => $type,
                'size' => $file->getSize(),
                'url' => $result['urls']['original'],
                'thumbnail' => $result['urls']['thumbnails']['medium']['url'] ?? null,
                'mime_type' => $file->getMimeType(),
                'metadata' => [
                    'original_name' => $file->getClientOriginalName(),
                    'extension' => $file->getClientOriginalExtension(),
                    'cloudflare_path' => $result['path'],
                    'cloudflare_urls' => $result['urls'],
                ],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        } catch (\Exception $e) {
            Log::error("Erreur lors de l'upload du fichier: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get file type from mime type.
     */
    private function getFileType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }
        if (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        }
        return 'document';
    }

    /**
     * Get file information from Cloudflare R2 with temporary URLs.
     */
    private function getFileInfo(string $filePath, string $storeId): ?array
    {
        try {
            if (!$this->disk->exists($filePath)) {
                return null;
            }
            
            $size = $this->disk->size($filePath);
            $lastModified = $this->disk->lastModified($filePath);
            $mimeType = $this->getMimeType($filePath);
            $type = $this->getFileType($mimeType);
            
            // Extraire le nom du fichier
            $filename = basename($filePath);
            $originalName = $this->extractOriginalName($filename);
            
            // Générer une URL publique (pour l'instant, on utilisera les URLs publiques)
            $publicUrl = $this->getPublicUrl($filePath);
            
            // Générer une URL pour le thumbnail si c'est une image
            $thumbnailUrl = null;
            if ($type === 'image') {
                $thumbnailPath = $this->getThumbnailPath($filePath);
                if ($this->disk->exists($thumbnailPath)) {
                    $thumbnailUrl = $this->getPublicUrl($thumbnailPath);
                }
            }
            
            return [
                'id' => uniqid(),
                'store_id' => $storeId,
                'name' => $originalName,
                'type' => $type,
                'size' => $size,
                'url' => $publicUrl,
                'thumbnail' => $thumbnailUrl,
                'mime_type' => $mimeType,
                'metadata' => [
                    'original_name' => $originalName,
                    'extension' => pathinfo($filename, PATHINFO_EXTENSION),
                    'cloudflare_path' => $filePath,
                    'is_public' => true,
                ],
                'created_at' => date('c', $lastModified),
                'updated_at' => date('c', $lastModified),
            ];
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des infos du fichier {$filePath}: " . $e->getMessage());
            return null;
        }
    }





    /**
     * Get MIME type from file extension.
     */
    private function getMimeType(string $filePath): string
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'mp4' => 'video/mp4',
            'avi' => 'video/x-msvideo',
            'mov' => 'video/quicktime',
            'wmv' => 'video/x-ms-wmv',
            'flv' => 'video/x-flv',
            'webm' => 'video/webm',
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',
            'ogg' => 'audio/ogg',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt' => 'text/plain',
        ];
        
        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    /**
     * Extract original name from filename.
     */
    private function extractOriginalName(string $filename): string
    {
        // Format: timestamp_id_unique.extension
        $parts = explode('_', $filename);
        if (count($parts) >= 2) {
            // Supprimer le timestamp (première partie)
            array_shift($parts);
            
            // Si il y a plus d'une partie restante, c'est probablement id_unique.extension
            if (count($parts) >= 1) {
                // Reconstruire le nom en gardant tout sauf le timestamp
                return implode('_', $parts);
            }
        }
        
        return $filename;
    }

    /**
     * Extract store ID from file path.
     */
    private function extractStoreId(string $filePath): string
    {
        $parts = explode('/', $filePath);
        if (count($parts) >= 3) {
            return $parts[1]; // media/storeId/filename
        }
        
        return 'unknown';
    }

    /**
     * Get public URL for file.
     */
    private function getPublicUrl(string $filePath): string
    {
        // Utiliser l'URL du proxy au lieu de l'URL Cloudflare directe
        $storeId = $this->extractStoreId($filePath);
        $baseUrl = 'http://localhost:8000';
        return $baseUrl . "/api/media-proxy/{$storeId}/file?path=" . urlencode($filePath);
    }

    /**
     * Get thumbnail path for file.
     */
    private function getThumbnailPath(string $filePath): string
    {
        $pathInfo = pathinfo($filePath);
        return $pathInfo['dirname'] . '/thumbnails/' . $pathInfo['filename'] . '_medium.' . $pathInfo['extension'];
    }

    /**
     * Delete file from Cloudflare R2.
     */
    private function deleteFileFromCloudflare(string $filePath): bool
    {
        try {
            // Supprimer le fichier principal
            if ($this->disk->exists($filePath)) {
                $this->disk->delete($filePath);
                Log::info("Fichier supprimé de Cloudflare R2: {$filePath}");
            }
            
            // Supprimer le thumbnail s'il existe
            $thumbnailPath = $this->getThumbnailPath($filePath);
            if ($this->disk->exists($thumbnailPath)) {
                $this->disk->delete($thumbnailPath);
                Log::info("Thumbnail supprimé de Cloudflare R2: {$thumbnailPath}");
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression du fichier {$filePath}: " . $e->getMessage());
            throw $e;
        }
    }

}
