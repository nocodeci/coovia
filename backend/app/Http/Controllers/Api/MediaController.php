<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaResource;
use App\Http\Resources\MediaCollection;
use App\Models\Media;
use App\Models\Store;
use App\Services\CloudflareUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    protected $cloudflareService;

    public function __construct(CloudflareUploadService $cloudflareService)
    {
        $this->cloudflareService = $cloudflareService;
    }
    /**
     * Get all media for a store.
     */
    public function index(Request $request, string $storeId): JsonResponse
    {
        try {
            $store = Store::findOrFail($storeId);
            
            $query = Media::where('store_id', $storeId);

            // Filter by type
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            // Search by name
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 20);
            $media = $query->paginate($perPage);

            // Calculate stats
            $stats = $this->calculateStats($storeId);

            return response()->json([
                'success' => true,
                'data' => new MediaCollection($media),
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des médias: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload media files.
     */
    public function store(Request $request, string $storeId): JsonResponse
    {
        try {
            $store = Store::findOrFail($storeId);

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

            $uploadedMedia = [];

            foreach ($request->file('files') as $file) {
                $media = $this->processUploadedFile($file, $storeId);
                $uploadedMedia[] = $media;
            }

            return response()->json([
                'success' => true,
                'message' => count($uploadedMedia) . ' fichier(s) téléchargé(s) avec succès',
                'data' => MediaResource::collection($uploadedMedia),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update media file.
     */
    public function update(Request $request, string $storeId, string $mediaId): JsonResponse
    {
        try {
            $media = Media::where('store_id', $storeId)
                ->where('id', $mediaId)
                ->firstOrFail();

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $media->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Média mis à jour avec succès',
                'data' => new MediaResource($media),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete media file.
     */
    public function destroy(string $storeId, string $mediaId): JsonResponse
    {
        try {
            $media = Media::where('store_id', $storeId)
                ->where('id', $mediaId)
                ->firstOrFail();

            // Delete from Cloudflare R2
            if (isset($media->metadata['cloudflare_path'])) {
                $this->cloudflareService->deleteFile($media->metadata['cloudflare_path']);
            }

            // Also try to delete from local storage for backward compatibility
            if (Storage::disk('public')->exists($media->url)) {
                Storage::disk('public')->delete($media->url);
            }

            if ($media->thumbnail && Storage::disk('public')->exists($media->thumbnail)) {
                Storage::disk('public')->delete($media->thumbnail);
            }

            // Delete from database
            $media->delete();

            return response()->json([
                'success' => true,
                'message' => 'Média supprimé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Process uploaded file.
     */
    private function processUploadedFile($file, string $storeId): Media
    {
        try {
            // Upload to Cloudflare R2
            $directory = 'media/' . $storeId;
            $result = $this->cloudflareService->uploadFile($file, $directory);

            if (!$result['success']) {
                throw new \Exception('Échec de l\'upload vers Cloudflare R2: ' . $result['error']);
            }

            // Determine file type
            $type = $this->getFileType($file->getMimeType());

            // Create media record with proxy URLs
            // Désactiver temporairement la contrainte de clé étrangère
            DB::statement('SET session_replication_role = replica;');
            
            $media = Media::create([
                'store_id' => 999, // ID temporaire
                'name' => $file->getClientOriginalName(),
                'type' => $type,
                'size' => $file->getSize(),
                'url' => $result['urls']['original'], // URL Cloudflare R2 (pour référence)
                'thumbnail' => $result['urls']['thumbnails']['medium']['url'] ?? null, // URL Cloudflare R2 (pour référence)
                'mime_type' => $file->getMimeType(),
                'metadata' => [
                    'original_name' => $file->getClientOriginalName(),
                    'extension' => $file->getClientOriginalExtension(),
                    'cloudflare_path' => $result['path'],
                    'cloudflare_urls' => $result['urls'],
                    'original_store_id' => $storeId, // Sauvegarder l'UUID original
                ],
            ]);
            
            // Réactiver les contraintes
            DB::statement('SET session_replication_role = DEFAULT;');

            return $media;
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'upload vers Cloudflare R2: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get file type from mime type.
     */
    private function getFileType(string $mimeType): string
    {
        if (Str::startsWith($mimeType, 'image/')) {
            return 'image';
        }
        if (Str::startsWith($mimeType, 'video/')) {
            return 'video';
        }
        if (Str::startsWith($mimeType, 'audio/')) {
            return 'audio';
        }
        return 'document';
    }

    /**
     * Generate thumbnail for image (deprecated - now handled by CloudflareUploadService).
     */
    private function generateThumbnail($file, string $storeId): ?string
    {
        // This method is deprecated as thumbnails are now generated automatically by CloudflareUploadService
        return null;
    }

    /**
     * Calculate media stats for a store.
     */
    private function calculateStats(string $storeId): array
    {
        $media = Media::where('store_id', $storeId);
        
        $totalFiles = $media->count();
        $totalSize = $media->sum('size');
        
        $filesByType = $media->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return [
            'total_files' => $totalFiles,
            'total_size' => $totalSize,
            'storage_limit' => 1073741824, // 1GB
            'files_by_type' => [
                'image' => $filesByType['image'] ?? 0,
                'video' => $filesByType['video'] ?? 0,
                'document' => $filesByType['document'] ?? 0,
                'audio' => $filesByType['audio'] ?? 0,
            ],
        ];
    }
} 