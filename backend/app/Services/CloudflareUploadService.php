<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CloudflareUploadService
{
    /**
     * Upload un logo vers Cloudflare R2
     */
    public function uploadLogo(UploadedFile $file, string $storeSlug): ?string
    {
        try {
            // Validation du fichier
            if (!$this->validateLogo($file)) {
                Log::error('Logo invalide pour upload Cloudflare', [
                    'filename' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType()
                ]);
                return null;
            }

            // Générer un nom de fichier unique
            $extension = $file->getClientOriginalExtension();
            $filename = 'store-logos/' . $storeSlug . '/' . Str::uuid() . '.' . $extension;
            
            // Upload vers Cloudflare R2
            $path = Storage::disk('r2')->putFileAs(
                dirname($filename),
                $file,
                basename($filename),
                'public'
            );

            if ($path) {
                // Retourner l'URL publique
                $url = Storage::disk('r2')->url($path);
                Log::info('Logo uploadé avec succès vers Cloudflare', [
                    'store_slug' => $storeSlug,
                    'filename' => $filename,
                    'url' => $url
                ]);
                return $url;
            }

            Log::error('Échec de l\'upload du logo vers Cloudflare', [
                'store_slug' => $storeSlug,
                'filename' => $filename
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'upload du logo vers Cloudflare', [
                'store_slug' => $storeSlug,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Supprimer un logo de Cloudflare R2
     */
    public function deleteLogo(string $logoUrl): bool
    {
        try {
            // Extraire le chemin du fichier de l'URL
            $path = $this->extractPathFromUrl($logoUrl);
            
            if (!$path) {
                Log::warning('Impossible d\'extraire le chemin du logo', ['url' => $logoUrl]);
                return false;
            }

            // Supprimer le fichier
            $deleted = Storage::disk('r2')->delete($path);
            
            if ($deleted) {
                Log::info('Logo supprimé avec succès de Cloudflare', [
                    'path' => $path,
                    'url' => $logoUrl
                ]);
            } else {
                Log::warning('Logo non trouvé lors de la suppression', [
                    'path' => $path,
                    'url' => $logoUrl
                ]);
            }

            return $deleted;

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du logo de Cloudflare', [
                'url' => $logoUrl,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Valider un fichier logo
     */
    private function validateLogo(UploadedFile $file): bool
    {
        // Vérifier la taille (max 2MB)
        if ($file->getSize() > 2 * 1024 * 1024) {
            return false;
        }

        // Vérifier le type MIME
        $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            return false;
        }

        // Vérifier l'extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
        if (!in_array(strtolower($file->getClientOriginalExtension()), $allowedExtensions)) {
            return false;
        }

        return true;
    }

    /**
     * Extraire le chemin du fichier de l'URL Cloudflare
     */
    private function extractPathFromUrl(string $url): ?string
    {
        // Exemple d'URL: https://pub-xxx.r2.dev/bucket-name/store-logos/store-slug/uuid.jpg
        $parsedUrl = parse_url($url);
        
        if (!isset($parsedUrl['path'])) {
            return null;
        }

        // Enlever le nom du bucket du chemin
        $path = $parsedUrl['path'];
        $pathParts = explode('/', trim($path, '/'));
        
        // Supprimer le premier élément (nom du bucket)
        array_shift($pathParts);
        
        return implode('/', $pathParts);
    }

    /**
     * Vérifier si Cloudflare R2 est configuré
     */
    public function isConfigured(): bool
    {
        $config = config('filesystems.disks.r2');
        
        return !empty($config['key']) && 
               !empty($config['secret']) && 
               !empty($config['bucket']) && 
               !empty($config['endpoint']);
    }

    /**
     * Upload un fichier média vers Cloudflare R2
     */
    public function uploadMedia(UploadedFile $file, string $storeId, string $fileName): ?string
    {
        try {
            // Générer le chemin du fichier
            $filePath = 'media/' . $storeId . '/' . $fileName;
            
            // Upload vers Cloudflare R2
            $path = Storage::disk('r2')->putFileAs(
                dirname($filePath),
                $file,
                basename($filePath),
                'public'
            );

            if ($path) {
                // Retourner l'URL publique
                $url = Storage::disk('r2')->url($path);
                Log::info('Média uploadé avec succès vers Cloudflare', [
                    'store_id' => $storeId,
                    'filename' => $fileName,
                    'url' => $url
                ]);
                return $url;
            }

            Log::error('Échec de l\'upload du média vers Cloudflare', [
                'store_id' => $storeId,
                'filename' => $fileName
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'upload du média vers Cloudflare', [
                'store_id' => $storeId,
                'filename' => $fileName,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Upload une thumbnail vers Cloudflare R2
     */
    public function uploadThumbnail(string $thumbnailContent, string $storeId, string $thumbnailName): ?string
    {
        try {
            // Générer le chemin de la thumbnail
            $thumbnailPath = 'media/' . $storeId . '/thumbnails/' . $thumbnailName;
            
            // Upload vers Cloudflare R2
            $path = Storage::disk('r2')->put($thumbnailPath, $thumbnailContent, 'public');

            if ($path) {
                // Retourner l'URL publique
                $url = Storage::disk('r2')->url($path);
                Log::info('Thumbnail uploadée avec succès vers Cloudflare', [
                    'store_id' => $storeId,
                    'filename' => $thumbnailName,
                    'url' => $url
                ]);
                return $url;
            }

            Log::error('Échec de l\'upload de la thumbnail vers Cloudflare', [
                'store_id' => $storeId,
                'filename' => $thumbnailName
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'upload de la thumbnail vers Cloudflare', [
                'store_id' => $storeId,
                'filename' => $thumbnailName,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Tester la connexion à Cloudflare R2
     */
    public function testConnection(): bool
    {
        try {
            if (!$this->isConfigured()) {
                Log::error('Cloudflare R2 non configuré');
                return false;
            }

            // Tester en listant les fichiers (opération légère)
            Storage::disk('r2')->files('test', false);
            
            Log::info('Connexion Cloudflare R2 testée avec succès');
            return true;

        } catch (\Exception $e) {
            Log::error('Erreur de connexion à Cloudflare R2', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
