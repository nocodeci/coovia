<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class CloudflareUploadService
{
    protected $disk;
    protected $config;

    public function __construct()
    {
        $this->config = config('cloudflare');
        try {
            $this->disk = Storage::disk('r2');
            Log::info("Disque Cloudflare R2 configuré avec succès");
        } catch (\Exception $e) {
            // En mode local, utiliser le disque local
            Log::warning("Erreur configuration Cloudflare R2: " . $e->getMessage() . " - Fallback vers disque local");
            $this->disk = Storage::disk('local');
        }
    }

    /**
     * Upload un fichier vers Cloudflare R2
     */
    public function uploadFile(UploadedFile $file, string $directory = 'uploads'): array
    {
        try {
            // Validation du fichier
            $this->validateFile($file);

            // Génération du nom de fichier unique
            $filename = $this->generateUniqueFilename($file);
            $path = $directory . '/' . $filename;

            // Upload du fichier
            $uploaded = $this->disk->putFileAs($directory, $file, $filename);

            if (!$uploaded) {
                throw new \Exception('Échec de l\'upload vers Cloudflare R2');
            }

            // Génération des URLs
            $urls = $this->generateUrls($path, $file);

            // Si c'est une image, générer les thumbnails
            if ($this->isImage($file)) {
                $urls['thumbnails'] = $this->generateThumbnails($file, $directory, $filename);
            }

            Log::info("Fichier uploadé avec succès vers Cloudflare R2: {$path}");

            return [
                'success' => true,
                'path' => $path,
                'filename' => $filename,
                'urls' => $urls,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ];

        } catch (\Exception $e) {
            Log::error("Erreur lors de l'upload vers Cloudflare R2: " . $e->getMessage());
            
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Upload multiple de fichiers
     */
    public function uploadMultiple(array $files, string $directory = 'uploads'): array
    {
        $results = [];
        
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $results[] = $this->uploadFile($file, $directory);
            }
        }

        return $results;
    }

    /**
     * Supprimer un fichier de Cloudflare R2
     */
    public function deleteFile(string $path): bool
    {
        try {
            $deleted = $this->disk->delete($path);
            
            if ($deleted) {
                Log::info("Fichier supprimé avec succès de Cloudflare R2: {$path}");
            }

            return $deleted;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression du fichier: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Valider un fichier
     */
    protected function validateFile(UploadedFile $file): void
    {
        $maxSize = $this->config['upload']['max_file_size'];
        
        // Extraire tous les types autorisés de manière correcte
        $allowedTypes = [];
        foreach ($this->config['upload']['allowed_types'] as $category => $types) {
            $allowedTypes = array_merge($allowedTypes, $types);
        }

        if ($file->getSize() > $maxSize) {
            throw new \Exception("Le fichier est trop volumineux. Taille maximale: " . ($maxSize / 1024 / 1024) . "MB");
        }

        $extension = strtolower($file->getClientOriginalExtension());
        
        // Log pour déboguer
        Log::info("Validation du fichier: extension={$extension}, types_autorisés=" . implode(', ', $allowedTypes));
        
        if (!in_array($extension, $allowedTypes)) {
            throw new \Exception("Type de fichier non autorisé. Types autorisés: " . implode(', ', $allowedTypes));
        }
    }

    /**
     * Générer un nom de fichier unique
     */
    protected function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $basename = Str::slug($basename);
        
        return $basename . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    /**
     * Générer les URLs pour le fichier
     */
    protected function generateUrls(string $path, UploadedFile $file): array
    {
        $urls = [
            'original' => $this->getPublicUrl($path),
            'cdn' => $this->getCdnUrl($path),
        ];

        return $urls;
    }

    /**
     * Vérifier si c'est une image
     */
    protected function isImage(UploadedFile $file): bool
    {
        $imageTypes = $this->config['upload']['allowed_types']['images'] ?? [];
        $extension = strtolower($file->getClientOriginalExtension());
        
        return in_array($extension, $imageTypes);
    }

    /**
     * Générer les thumbnails pour une image
     */
    protected function generateThumbnails(UploadedFile $file, string $directory, string $filename): array
    {
        $thumbnails = [];
        $sizes = $this->config['upload']['thumbnails'] ?? [];

        try {
            // Utiliser la nouvelle syntaxe d'Intervention Image v3
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($file);
            
            foreach ($sizes as $size => $dimensions) {
                $thumbnailFilename = $this->generateThumbnailFilename($filename, $size);
                $thumbnailPath = $directory . '/thumbnails/' . $thumbnailFilename;

                // Créer le thumbnail
                $thumbnail = $image->cover($dimensions[0], $dimensions[1]);

                // Sauvegarder le thumbnail
                $thumbnailData = $thumbnail->toJpeg(80); // Qualité par défaut
                $this->disk->put($thumbnailPath, $thumbnailData);

                $thumbnails[$size] = [
                    'url' => $this->getPublicUrl($thumbnailPath),
                    'cdn_url' => $this->getCdnUrl($thumbnailPath),
                    'width' => $dimensions[0],
                    'height' => $dimensions[1],
                ];
            }

        } catch (\Exception $e) {
            Log::error("Erreur lors de la génération des thumbnails: " . $e->getMessage());
        }

        return $thumbnails;
    }

    /**
     * Générer le nom du fichier thumbnail
     */
    protected function generateThumbnailFilename(string $filename, string $size): string
    {
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $basename = pathinfo($filename, PATHINFO_FILENAME);
        
        return $basename . '_' . $size . '.' . $extension;
    }

    /**
     * Obtenir l'URL publique du fichier
     */
    protected function getPublicUrl(string $path): string
    {
        $publicUrl = $this->config['r2']['url'] ?? $this->config['r2']['public_url'] ?? null;
        
        if ($publicUrl) {
            return rtrim($publicUrl, '/') . '/' . $path;
        }

        return $this->disk->url($path);
    }

    /**
     * Obtenir l'URL CDN du fichier
     */
    protected function getCdnUrl(string $path): string
    {
        if ($this->config['cdn']['enabled'] && $this->config['cdn']['domain']) {
            return 'https://' . $this->config['cdn']['domain'] . '/' . $path;
        }

        return $this->getPublicUrl($path);
    }

    /**
     * Obtenir les informations d'un fichier
     */
    public function getFileInfo(string $path): array
    {
        try {
            $exists = $this->disk->exists($path);
            
            if (!$exists) {
                return ['exists' => false];
            }

            $size = $this->disk->size($path);
            $lastModified = $this->disk->lastModified($path);

            return [
                'exists' => true,
                'size' => $size,
                'last_modified' => $lastModified,
                'url' => $this->getPublicUrl($path),
                'cdn_url' => $this->getCdnUrl($path),
            ];
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des informations du fichier: " . $e->getMessage());
            return ['exists' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Vérifier si Cloudflare R2 est configuré
     */
    public function isConfigured(): bool
    {
        try {
            // Vérifier si les variables d'environnement sont définies
            $accessKey = config('filesystems.disks.r2.key');
            $secretKey = config('filesystems.disks.r2.secret');
            $bucket = config('filesystems.disks.r2.bucket');
            $endpoint = config('filesystems.disks.r2.endpoint');

            if (!$accessKey || !$secretKey || !$bucket || !$endpoint) {
                return false;
            }

            // Vérifier si le disk R2 est configuré comme disk par défaut
            $defaultDisk = config('filesystems.default');
            if ($defaultDisk !== 'r2') {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la vérification de la configuration Cloudflare R2: " . $e->getMessage());
            return false;
        }
    }
}
