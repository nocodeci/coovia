<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports "GD Library" and "Imagick" to process images
    | internally. You may choose one of them according to your PHP
    | configuration. By default PHP's "GD Library" implementation is used.
    |
    | Supported: "gd", "imagick"
    |
    */

    'driver' => env('IMAGE_DRIVER', 'gd'),

    /*
    |--------------------------------------------------------------------------
    | Image Cache
    |--------------------------------------------------------------------------
    |
    | Here you may specify if image caching should be used and for how long.
    | By default images are cached for 1 year.
    |
    */

    'cache' => [
        'lifetime' => env('IMAGE_CACHE_LIFETIME', 43200),
        'prefix' => env('IMAGE_CACHE_PREFIX', 'image'),
    ],

];
