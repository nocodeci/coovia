<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadHelper
{
    /**
     * Upload un fichier vers Cloudflare R2
     */
    public static function uploadToR2(UploadedFile $file, string $path = 'uploads'): string
    {
        $filename = self::generateUniqueFilename($file);
        $fullPath = $path . '/' . $filename;
        
        // Upload vers R2
        Storage::disk('r2')->put($fullPath, file_get_contents($file));
        
        return $fullPath;
    }

    /**
     * Upload une image avec redimensionnement
     */
    public static function uploadImage(UploadedFile $file, string $path = 'images', array $sizes = []): array
    {
        $filename = self::generateUniqueFilename($file);
        $originalPath = $path . '/original/' . $filename;
        
        // Upload original
        Storage::disk('r2')->put($originalPath, file_get_contents($file));
        
        $urls = [
            'original' => Storage::disk('r2')->url($originalPath)
        ];

        // Créer des versions redimensionnées si demandé
        if (!empty($sizes)) {
            $image = \Intervention\Image\Facades\Image::make($file);
            
            foreach ($sizes as $size => $dimensions) {
                $resizedImage = clone $image;
                $resizedImage->fit($dimensions[0], $dimensions[1]);
                
                $resizedPath = $path . '/' . $size . '/' . $filename;
                Storage::disk('r2')->put($resizedPath, $resizedImage->encode());
                
                $urls[$size] = Storage::disk('r2')->url($resizedPath);
            }
        }

        return $urls;
    }

    /**
     * Supprimer un fichier de R2
     */
    public static function deleteFromR2(string $path): bool
    {
        return Storage::disk('r2')->delete($path);
    }

    /**
     * Obtenir l'URL d'un fichier
     */
    public static function getUrl(string $path): string
    {
        return Storage::disk('r2')->url($path);
    }

    /**
     * Générer un nom de fichier unique
     */
    private static function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        
        return $name . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    /**
     * Vérifier si un fichier existe
     */
    public static function exists(string $path): bool
    {
        return Storage::disk('r2')->exists($path);
    }

    /**
     * Lister les fichiers dans un dossier
     */
    public static function listFiles(string $path = ''): array
    {
        return Storage::disk('r2')->files($path);
    }
}
