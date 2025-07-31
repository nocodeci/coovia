<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaController extends Controller
{
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
                'data' => $media,
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
                'data' => $uploadedMedia,
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
                'data' => $media,
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

            // Delete from storage
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
        $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $filePath = 'media/' . $storeId . '/' . $fileName;

        // Store the file
        $file->storeAs('public/' . dirname($filePath), basename($filePath));

        // Determine file type
        $type = $this->getFileType($file->getMimeType());

        // Generate thumbnail for images
        $thumbnail = null;
        if ($type === 'image') {
            $thumbnail = $this->generateThumbnail($file, $storeId);
        }

        // Create media record
        $media = Media::create([
            'store_id' => $storeId,
            'name' => $file->getClientOriginalName(),
            'type' => $type,
            'size' => $file->getSize(),
            'url' => $filePath,
            'thumbnail' => $thumbnail,
            'mime_type' => $file->getMimeType(),
            'metadata' => [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
            ],
        ]);

        return $media;
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
     * Generate thumbnail for image.
     */
    private function generateThumbnail($file, string $storeId): ?string
    {
        try {
            // Utiliser la nouvelle syntaxe d'Intervention Image v3
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($file);
            $image->cover(300, 300);

            $thumbnailName = 'thumb_' . time() . '_' . Str::random(10) . '.jpg';
            $thumbnailPath = 'media/' . $storeId . '/thumbnails/' . $thumbnailName;

            // Créer le dossier thumbnails s'il n'existe pas
            Storage::disk('public')->makeDirectory(dirname($thumbnailPath));

            // Encoder et sauvegarder l'image
            $encoded = $image->toJpeg(80);
            Storage::disk('public')->put($thumbnailPath, $encoded);

            return $thumbnailPath;
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la génération de thumbnail: ' . $e->getMessage());
            return null;
        }
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