<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudflare R2 Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour Cloudflare R2 Storage
    |
    */

    'r2' => [
        'driver' => 's3',
        'key' => env('CLOUDFLARE_R2_ACCESS_KEY_ID', 'dummy'),
        'secret' => env('CLOUDFLARE_R2_SECRET_ACCESS_KEY', 'dummy'),
        'region' => env('CLOUDFLARE_R2_DEFAULT_REGION', 'auto'),
        'bucket' => env('CLOUDFLARE_R2_BUCKET', 'dummy-bucket'),
        'url' => env('CLOUDFLARE_R2_URL', 'https://dummy.r2.cloudflarestorage.com'),
        'endpoint' => env('CLOUDFLARE_R2_ENDPOINT', 'https://dummy.r2.cloudflarestorage.com'),
        'use_path_style_endpoint' => false,
    ],

    'upload' => [
        'max_file_size' => 10 * 1024 * 1024, // 10MB
        'allowed_types' => [
            'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            'documents' => ['pdf', 'doc', 'docx', 'txt'],
            'videos' => ['mp4', 'avi', 'mov', 'wmv'],
            'audio' => ['mp3', 'wav', 'ogg', 'aac'],
        ],
        'thumbnails' => [
            'small' => [150, 150],
            'medium' => [300, 300],
            'large' => [600, 600],
        ],
    ],

    'cdn' => [
        'enabled' => env('CLOUDFLARE_CDN_ENABLED', false),
        'domain' => env('CLOUDFLARE_CDN_DOMAIN', ''),
    ],
];
