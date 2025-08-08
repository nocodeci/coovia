<?php

namespace App\Http\Controllers;

use App\Helpers\FileUploadHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FileController extends Controller
{
    /**
     * Upload un fichier
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'path' => 'string|nullable'
        ]);

        $file = $request->file('file');
        $path = $request->input('path', 'uploads');

        try {
            $filePath = FileUploadHelper::uploadToR2($file, $path);
            $url = FileUploadHelper::getUrl($filePath);

            return response()->json([
                'success' => true,
                'path' => $filePath,
                'url' => $url,
                'filename' => basename($filePath)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload une image avec redimensionnement
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:10240', // 10MB max
            'path' => 'string|nullable',
            'sizes' => 'array|nullable'
        ]);

        $file = $request->file('image');
        $path = $request->input('path', 'images');
        $sizes = $request->input('sizes', [
            'thumbnail' => [150, 150],
            'medium' => [300, 300],
            'large' => [800, 800]
        ]);

        try {
            $urls = FileUploadHelper::uploadImage($file, $path, $sizes);

            return response()->json([
                'success' => true,
                'urls' => $urls,
                'original_url' => $urls['original']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un fichier
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $path = $request->input('path');

        try {
            $deleted = FileUploadHelper::deleteFromR2($path);

            return response()->json([
                'success' => $deleted,
                'message' => $deleted ? 'Fichier supprimé' : 'Fichier non trouvé'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lister les fichiers
     */
    public function list(Request $request): JsonResponse
    {
        $path = $request->input('path', '');
        
        try {
            $files = FileUploadHelper::listFiles($path);
            $urls = [];

            foreach ($files as $file) {
                $urls[] = [
                    'path' => $file,
                    'url' => FileUploadHelper::getUrl($file),
                    'filename' => basename($file)
                ];
            }

            return response()->json([
                'success' => true,
                'files' => $urls
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la liste: ' . $e->getMessage()
            ], 500);
        }
    }
}
