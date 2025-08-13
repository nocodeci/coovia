<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudflare R2 Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour Cloudflare R2 Object Storage
    | Utilisé pour le stockage des fichiers média (images, vidéos, etc.)
    |
    */

    'r2' => [
        'account_id' => env('CLOUDFLARE_ACCOUNT_ID'),
        'access_key_id' => env('CLOUDFLARE_ACCESS_KEY_ID'),
        'secret_access_key' => env('CLOUDFLARE_SECRET_ACCESS_KEY'),
        'bucket' => env('CLOUDFLARE_R2_BUCKET', 'wozif-media'),
        'region' => env('CLOUDFLARE_R2_REGION', 'auto'),
        'endpoint' => env('CLOUDFLARE_R2_ENDPOINT'),
        'public_url' => env('CLOUDFLARE_R2_PUBLIC_URL'),
        'use_path_style_endpoint' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Upload Settings
    |--------------------------------------------------------------------------
    |
    | Paramètres pour les uploads de fichiers
    |
    */

    'upload' => [
        'max_file_size' => env('CLOUDFLARE_MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB
        'allowed_types' => [
            'image' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            'video' => ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
            'document' => ['pdf', 'doc', 'docx', 'txt'],
        ],
        'image_quality' => 85,
        'generate_thumbnails' => true,
        'thumbnail_sizes' => [
            'small' => [150, 150],
            'medium' => [300, 300],
            'large' => [600, 600],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CDN Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour l'accès public aux fichiers
    |
    */

    'cdn' => [
        'enabled' => env('CLOUDFLARE_CDN_ENABLED', true),
        'domain' => env('CLOUDFLARE_CDN_DOMAIN'),
        'cache_duration' => env('CLOUDFLARE_CACHE_DURATION', 86400), // 24 heures
    ],

];
