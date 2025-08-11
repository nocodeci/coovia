<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Auth0 Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour l'intégration Auth0 avec Laravel
    |
    */

    'domain' => env('AUTH0_DOMAIN', 'your-domain.auth0.com'),
    'client_id' => env('AUTH0_CLIENT_ID', 'your-client-id'),
    'client_secret' => env('AUTH0_CLIENT_SECRET', 'your-client-secret'),
    'audience' => env('AUTH0_AUDIENCE', 'https://api.coovia.com'),
    'redirect_uri' => env('AUTH0_REDIRECT_URI', 'http://localhost:3000'),
    
    /*
    |--------------------------------------------------------------------------
    | JWT Configuration
    |--------------------------------------------------------------------------
    */
    'jwt_leeway' => env('AUTH0_JWT_LEEWAY', 10),
    'jwt_algorithm' => env('AUTH0_JWT_ALGORITHM', 'RS256'),
    
    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    */
    'cache_enabled' => env('AUTH0_CACHE_ENABLED', true),
    'cache_ttl' => env('AUTH0_CACHE_TTL', 3600), // 1 heure
    
    /*
    |--------------------------------------------------------------------------
    | User Sync Configuration
    |--------------------------------------------------------------------------
    */
    'auto_sync_user' => env('AUTH0_AUTO_SYNC_USER', true),
    'create_user_if_not_exists' => env('AUTH0_CREATE_USER_IF_NOT_EXISTS', true),
    
    /*
    |--------------------------------------------------------------------------
    | Role Mapping
    |--------------------------------------------------------------------------
    */
    'role_mapping' => [
        'admin' => 'admin',
        'vendor' => 'vendor',
        'customer' => 'customer',
    ],
];
