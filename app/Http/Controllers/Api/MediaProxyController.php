<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MediaProxyController extends Controller
{
    /**
     * Servir un fichier média depuis Cloudflare R2
     */
    public function serve(Request $request, string $storeId, string $mediaId): Response
    {
        try {
            // Récupérer le média depuis la base de données
            $media = Media::where('id', $mediaId)
                         ->where('store_id', $storeId)
                         ->firstOrFail();

            // Récupérer le fichier depuis Cloudflare R2
            $disk = Storage::disk('r2');
            
            // Extraire le chemin du fichier depuis l'URL
            $url = $media->url;
            $path = $this->extractPathFromUrl($url);
            
            if (!$disk->exists($path)) {
                abort(404, 'Fichier non trouvé');
            }

            // Récupérer le contenu du fichier
            $content = $disk->get($path);
            $mimeType = $media->mime_type ?: $this->getMimeTypeFromExtension($media->name);

            // Retourner le fichier avec les bons headers
            return response($content, 200, [
                'Content-Type' => $mimeType,
                'Content-Length' => strlen($content),
                'Cache-Control' => 'public, max-age=31536000', // Cache 1 an
                'Access-Control-Allow-Origin' => '*',
            ]);

        } catch (\Exception $e) {
            abort(404, 'Fichier non trouvé');
        }
    }

    /**
     * Servir une thumbnail depuis Cloudflare R2
     */
    public function serveThumbnail(Request $request, string $storeId, string $mediaId, string $size = 'medium'): Response
    {
        try {
            // Récupérer le média depuis la base de données
            $media = Media::where('id', $mediaId)
                         ->where('store_id', $storeId)
                         ->firstOrFail();

            // Récupérer le fichier depuis Cloudflare R2
            $disk = Storage::disk('r2');
            
            // Construire le chemin de la thumbnail
            $originalPath = $this->extractPathFromUrl($media->url);
            $thumbnailPath = $this->buildThumbnailPath($originalPath, $size);
            
            if (!$disk->exists($thumbnailPath)) {
                // Si la thumbnail n'existe pas, servir l'original
                return $this->serve($request, $storeId, $mediaId);
            }

            // Récupérer le contenu de la thumbnail
            $content = $disk->get($thumbnailPath);
            $mimeType = $media->mime_type ?: $this->getMimeTypeFromExtension($media->name);

            // Retourner la thumbnail avec les bons headers
            return response($content, 200, [
                'Content-Type' => $mimeType,
                'Content-Length' => strlen($content),
                'Cache-Control' => 'public, max-age=31536000', // Cache 1 an
                'Access-Control-Allow-Origin' => '*',
            ]);

        } catch (\Exception $e) {
            abort(404, 'Thumbnail non trouvée');
        }
    }

    /**
     * Extraire le chemin du fichier depuis l'URL Cloudflare
     */
    private function extractPathFromUrl(string $url): string
    {
        // Supprimer l'URL de base pour obtenir le chemin relatif
        $baseUrl = env('CLOUDFLARE_R2_PUBLIC_URL');
        return str_replace($baseUrl . '/', '', $url);
    }

    /**
     * Construire le chemin de la thumbnail
     */
    private function buildThumbnailPath(string $originalPath, string $size): string
    {
        $pathInfo = pathinfo($originalPath);
        $directory = $pathInfo['dirname'];
        $filename = $pathInfo['filename'];
        $extension = $pathInfo['extension'];
        
        return $directory . '/thumbnails/' . $filename . '_' . $size . '.' . $extension;
    }

    /**
     * Obtenir le type MIME à partir de l'extension du fichier
     */
    private function getMimeTypeFromExtension(string $filename): string
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'pdf' => 'application/pdf',
            'txt' => 'text/plain',
        ];
        
        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    /**
     * Servir un fichier par chemin depuis Cloudflare R2
     */
    public function serveByPath(Request $request, string $storeId): Response
    {
        try {
            $filePath = $request->query('path');
            
            if (!$filePath) {
                return response('Chemin du fichier manquant', 400);
            }

            // Récupérer le fichier depuis Cloudflare R2
            $disk = Storage::disk('r2');
            
            if (!$disk->exists($filePath)) {
                return response('Fichier non trouvé', 404);
            }

            // Récupérer le contenu du fichier
            $fileContent = $disk->get($filePath);
            
            // Déterminer le type MIME
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $mimeType = $this->getMimeTypeFromExtension(basename($filePath));

            // Retourner le fichier avec les bons headers
            return response($fileContent, 200, [
                'Content-Type' => $mimeType,
                'Content-Length' => strlen($fileContent),
                'Cache-Control' => 'public, max-age=3600',
                'Access-Control-Allow-Origin' => '*',
            ]);
        } catch (\Exception $e) {
            return response('Erreur lors de la récupération du fichier: ' . $e->getMessage(), 500);
        }
    }
}
