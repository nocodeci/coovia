<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudflareUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SimpleMediaController extends Controller
{
    protected $cloudflareService;

    public function __construct(CloudflareUploadService $cloudflareService)
    {
        $this->cloudflareService = $cloudflareService;
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
     * Get media files for a store (simplified).
     */
    public function index(Request $request, string $storeId): JsonResponse
    {
        try {
            // Pour l'instant, retourner une liste vide
            // Plus tard, on pourra implémenter la récupération depuis Cloudflare R2
            return response()->json([
                'success' => true,
                'data' => [
                    'current_page' => 1,
                    'data' => [],
                    'total' => 0,
                    'per_page' => 20,
                ],
                'stats' => [
                    'total_files' => 0,
                    'total_size' => 0,
                    'storage_limit' => 1073741824, // 1GB
                    'files_by_type' => [
                        'image' => 0,
                        'video' => 0,
                        'document' => 0,
                        'audio' => 0,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
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
}
