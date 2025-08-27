<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Upload Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour les uploads de fichiers
    |
    */

    // Taille maximale des fichiers (en bytes)
    'max_file_size' => env('UPLOAD_MAX_FILE_SIZE', 50 * 1024 * 1024), // 50MB par défaut

    // Taille maximale totale des uploads (en bytes)
    'max_total_size' => env('UPLOAD_MAX_TOTAL_SIZE', 100 * 1024 * 1024), // 100MB par défaut

    // Nombre maximal de fichiers par upload
    'max_files' => env('UPLOAD_MAX_FILES', 10),

    // Types de fichiers autorisés
    'allowed_types' => [
        'image' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        'video' => ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
        'audio' => ['mp3', 'wav', 'ogg', 'aac', 'flac'],
        'document' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    ],

    // Configuration des thumbnails
    'thumbnails' => [
        'enabled' => true,
        'width' => 300,
        'height' => 300,
        'quality' => 80,
    ],

    // Configuration du stockage
    'storage' => [
        'disk' => env('FILESYSTEM_DISK', 'r2'),
        'path' => 'public/media',
    ],
];
